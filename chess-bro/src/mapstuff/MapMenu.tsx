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
import { useEffect, useState } from "react";
import { drawCircle, resetMap, searchProfiles, userLocation } from "./map";
import {
  fetchUsers,
  fetchDistanceMatrix,
  buildGraph,
  dijkstra,
  fetchRoutePolyline,
  UserNode,
} from "./dijkstra";
import { mapRef } from "./map";
import L from "leaflet";

// Store your API key here or in .env if you're using dotenv
const ORS_API_KEY = "5b3ce3597851110001cf6248531655d52f1145c084f0e9a22f18ff56";

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

  useEffect(() => {
    if (!isHidden) {
      userLocation(whiteMode);
      drawCircle(searchDistance);
    }
  }, [whiteMode, searchDistance, isHidden]);

  const findClosestPlayer = async () => {
    const stored = localStorage.getItem("currentUser");
    if (!stored || !mapRef.current) return;

    const currentUser = JSON.parse(stored);
    const username = currentUser.username;

    try {
      const allUsers = await fetchUsers();
      const self = allUsers.find((u) => u.username === username);
      if (!self) return;

      const filteredUsers = allUsers.filter(
        (u) =>
          u.username !== username &&
          u.elo >= searchRating[0] &&
          u.elo <= searchRating[1]
      );

      const users: UserNode[] = [self, ...filteredUsers];
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

      for (const [name, dist] of Object.entries(dists)) {
        if (name !== username && dist < minDist) {
          minDist = dist;
          closest = users.find((u) => u.username === name) || null;
        }
      }

      if (!closest) {
        alert("No closest player found.");
        return;
      }

      const map = mapRef.current;

      L.marker([closest.latitude, closest.longitude])
        .addTo(map)
        .bindPopup(
          `<b>${closest.username}</b><br/>ELO: ${
            closest.elo
          }<br/>Distance: ${minDist.toFixed(2)} km`
        )
        .openPopup();

      const polyline = await fetchRoutePolyline(
        [self.longitude, self.latitude],
        [closest.longitude, closest.latitude],
        ORS_API_KEY,
        transportMode
      );

      if (polyline) polyline.addTo(map);

      map.setView([closest.latitude, closest.longitude], 13);
    } catch (err) {
      console.error("Error finding closest player:", err);
      alert("Could not find closest player or route.");
    }
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
            }}
          />
        }
        label="Show me to other profiles"
        labelPlacement="start"
      />

      {!isHidden && (
        <div className="w-full border-2 flex flex-col p-2">
          <p>Preferred rating</p>
          <Slider
            sx={{ width: "80%", alignSelf: "center" }}
            getAriaLabel={() => "Rating"}
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
        </div>
      )}
    </div>
  );
}
