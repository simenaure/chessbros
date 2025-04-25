// src/mapmenu.tsx
// src/mapmenu.tsx

import React, { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  Slider,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { drawCircle, resetMap, userLocation, searchProfiles } from "./map";
import {
  fetchUsers,
  fetchDistanceMatrix,
  buildGraph,
  dijkstra,
  fetchRoutePolyline,
  UserNode,
} from "./dijkstra";
import { computeSuitability, SuitabilityOptions } from "./suitability";
import { mapRef } from "./map";
import L from "leaflet";

// Your helper module pointing at http://localhost:3001
import {
  fetchChessLocations,
  createChessLocation,
  ChessLocation,
} from "./setLocation";

const ORS_API_KEY = "5b3ce3597851110001cf6248531655d52f1145c084f0e9a22f18ff56";

// ─── Chessboard icon definition ─────────────────────────────────────────────
const chessboardIcon = new L.Icon({
  iconUrl: "/Chessboard.png", // put chessboard.png in your public folder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

let activeRouteLine: L.Polyline | null = null;
let activeOpponentMarker: L.Marker | null = null;
let chessMarkers: L.Marker[] = [];

export default function MapMenu() {
  const [isHidden, setIsHidden] = useState(false);
  const [searchRating, setSearchRating] = useState<[number, number]>([
    600, 1200,
  ]);
  const [searchDistance, setSearchDistance] = useState<number>(1);
  const [whiteMode, setWhiteMode] = useState<boolean>(true);
  const [transportMode, setTransportMode] = useState<
    "driving-car" | "foot-walking"
  >("driving-car");

  const [addingSpot, setAddingSpot] = useState(false);

  useEffect(() => {
    if (!isHidden) {
      userLocation();
      drawCircle(searchDistance);
    }
  }, [whiteMode, searchDistance, isHidden]);

  const clearMapExtras = () => {
    if (!mapRef.current) return;
    if (activeRouteLine) {
      mapRef.current.removeLayer(activeRouteLine);
      activeRouteLine = null;
    }
    if (activeOpponentMarker) {
      mapRef.current.removeLayer(activeOpponentMarker);
      activeOpponentMarker = null;
    }
    chessMarkers.forEach((m) => mapRef.current?.removeLayer(m));
    chessMarkers = [];
  };

  // 1) Load & draw all saved chess spots using chessboardIcon
  const loadChessSpots = async () => {
    clearMapExtras();
    try {
      const spots = await fetchChessLocations();
      spots.forEach((s) => {
        if (!mapRef.current) return;
        const m = L.marker([s.latitude, s.longitude], { icon: chessboardIcon })
          .addTo(mapRef.current)
          .bindPopup(`<b>${s.name}</b><br/>Type: ${s.location_type}`);
        chessMarkers.push(m);
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to load chess spots");
    }
  };

  // 2) One-time click to add exactly one new spot with chessboardIcon
  const enableAddSpot = () => {
    if (!mapRef.current) return;
    setAddingSpot(true);

    mapRef.current.once("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const name = prompt("Spot name:")?.trim();
      const location_type = prompt("Spot type (e.g. park):")?.trim();
      if (!name || !location_type) {
        alert("Name & type required");
        setAddingSpot(false);
        return;
      }
      try {
        const newLoc = await createChessLocation({
          name,
          location_type,
          latitude: lat,
          longitude: lng,
        });
        if (mapRef.current) {
          const m = L.marker([lat, lng], { icon: chessboardIcon })
            .addTo(mapRef.current)
            .bindPopup(
              `<b>${newLoc.name}</b><br/>Type: ${newLoc.location_type}`
            );
          chessMarkers.push(m);
        }
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to save chess spot");
      } finally {
        setAddingSpot(false);
      }
    });
  };

  // 3) Find Closest Player (unchanged)
  const findClosestPlayer = async () => {
    clearMapExtras();
    const stored = localStorage.getItem("currentUser");
    if (!stored || !mapRef.current) return;
    const currentUser = JSON.parse(stored);
    const username = currentUser.username;

    const allUsers = await fetchUsers();
    const self = allUsers.find((u) => u.username === username);
    if (!self) return;

    const filtered = allUsers.filter(
      (u) =>
        u.username !== username &&
        u.elo >= searchRating[0] &&
        u.elo <= searchRating[1]
    );
    const users: UserNode[] = [self, ...filtered];
    if (users.length < 2) {
      alert("No other matching players found.");
      return;
    }

    const distances = await fetchDistanceMatrix(
      users,
      ORS_API_KEY,
      transportMode
    );
    const graph = buildGraph(users, distances);
    const dists = dijkstra(graph, username);

    let closest: UserNode | null = null;
    let minDist = Infinity;
    for (const [uname, dist] of Object.entries(dists)) {
      if (uname !== username && dist < minDist) {
        minDist = dist;
        closest = users.find((u) => u.username === uname) || null;
      }
    }
    if (!closest) return;

    activeOpponentMarker = L.marker([closest.latitude, closest.longitude])
      .addTo(mapRef.current)
      .bindPopup(
        `<b>${closest.username}</b><br/>ELO: ${
          closest.elo
        }<br/>Distance: ${minDist.toFixed(2)} km`
      )
      .openPopup();

    activeRouteLine = await fetchRoutePolyline(
      [self.longitude, self.latitude],
      [closest.longitude, closest.latitude],
      ORS_API_KEY,
      transportMode
    );
    if (activeRouteLine) activeRouteLine.addTo(mapRef.current);
    mapRef.current.setView([closest.latitude, closest.longitude], 13);
  };

  // 4) Find Best Match (unchanged)
  const findBestMatch = async () => {
    clearMapExtras();
    const stored = localStorage.getItem("currentUser");
    if (!stored || !mapRef.current) return;
    const currentUser = JSON.parse(stored);
    const username = currentUser.username;

    const allUsers = await fetchUsers();
    const self = allUsers.find((u) => u.username === username);
    if (!self) return;

    const filtered = allUsers.filter(
      (u) =>
        u.username !== username &&
        u.elo >= searchRating[0] &&
        u.elo <= searchRating[1]
    );
    const users: UserNode[] = [self, ...filtered];
    if (users.length < 2) {
      alert("No other matching players found.");
      return;
    }

    const suitabilityOpts: SuitabilityOptions = {
      maxDistanceKm: searchDistance,
      targetElo: self.elo,
      eloTolerance: 400,
      weights: { distance: 1, elo: 2 },
    };
    let bestMatch: { user: UserNode; score: number } | null = null;
    for (const candidate of users) {
      if (candidate.username === username) continue;
      const score = computeSuitability(self, candidate, suitabilityOpts);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { user: candidate, score };
      }
    }
    if (!bestMatch) return;

    activeOpponentMarker = L.marker([
      bestMatch.user.latitude,
      bestMatch.user.longitude,
    ])
      .addTo(mapRef.current)
      .bindPopup(
        `<b>${bestMatch.user.username}</b><br/>ELO: ${
          bestMatch.user.elo
        }<br/>Suitability: ${bestMatch.score.toFixed(2)}`
      )
      .openPopup();

    activeRouteLine = await fetchRoutePolyline(
      [self.longitude, self.latitude],
      [bestMatch.user.longitude, bestMatch.user.latitude],
      ORS_API_KEY,
      transportMode
    );
    if (activeRouteLine) activeRouteLine.addTo(mapRef.current);
    mapRef.current.setView(
      [bestMatch.user.latitude, bestMatch.user.longitude],
      13
    );
  };

  return (
    <div className="w-1/4 flex flex-col items-center">
      <FormControlLabel
        control={
          <Switch
            color="success"
            checked={!isHidden}
            onChange={() => {
              setIsHidden(!isHidden);
              resetMap();
              clearMapExtras();
            }}
          />
        }
        label="Show me to other profiles"
        labelPlacement="start"
      />

      {!isHidden && (
        <div className="w-full border-2 flex flex-col p-2">
          {/* your existing controls… */}
          <p>Preferred rating</p>
          <Slider
            sx={{ width: "80%", alignSelf: "center" }}
            valueLabelDisplay="auto"
            min={0}
            max={3000}
            step={10}
            value={searchRating}
            onChange={(_, val) => setSearchRating(val as [number, number])}
          />

          <p>Maximum distance (km)</p>
          <Slider
            sx={{ width: "80%", alignSelf: "center" }}
            valueLabelDisplay="auto"
            min={0.5}
            max={10}
            step={0.5}
            value={searchDistance}
            onChange={(_, val) => setSearchDistance(val as number)}
          />

          <FormControl sx={{ width: "80%", alignSelf: "center", mt: 2 }}>
            <InputLabel id="mode-label">Transport Mode</InputLabel>
            <Select
              labelId="mode-label"
              value={transportMode}
              label="Transport Mode"
              onChange={(e) =>
                setTransportMode(
                  e.target.value as "driving-car" | "foot-walking"
                )
              }
            >
              <MenuItem value="driving-car">Car</MenuItem>
              <MenuItem value="foot-walking">Walking</MenuItem>
            </Select>
          </FormControl>

          <div className="flex items-center justify-center my-2">
            <img src="whiteking.png" className="w-8 h-8" />
            <Switch
              color="success"
              checked={!whiteMode}
              onChange={() => setWhiteMode(!whiteMode)}
            />
            <img src="blackking.png" className="w-8 h-8" />
          </div>

          <Button
            sx={{ width: "50%", alignSelf: "center" }}
            variant="contained"
            color="success"
            onClick={() =>
              searchProfiles(whiteMode, searchRating, searchDistance)
            }
          >
            Search profiles
          </Button>

          <Button
            sx={{ width: "50%", alignSelf: "center", mt: 1 }}
            variant="outlined"
            color="secondary"
            onClick={findClosestPlayer}
          >
            Find Closest Player
          </Button>

          <Button
            sx={{ width: "50%", alignSelf: "center", mt: 1 }}
            variant="outlined"
            color="primary"
            onClick={findBestMatch}
          >
            Find Best Match
          </Button>

          {/* ─── Chess-spot buttons ────────────────────────────────────────── */}
          <Button
            sx={{ width: "80%", mt: 2 }}
            variant="contained"
            color="secondary"
            onClick={loadChessSpots}
          >
            Load Chess Spots
          </Button>

          <Button
            sx={{ width: "80%", mt: 1 }}
            variant="contained"
            color="secondary"
            onClick={enableAddSpot}
            disabled={addingSpot}
          >
            {addingSpot ? "Click on map…" : "Add Chess Spot"}
          </Button>
        </div>
      )}
    </div>
  );
}
