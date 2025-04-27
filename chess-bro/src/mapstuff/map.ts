// src/map.ts

import L, { LatLngTuple } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  fetchUsers,
  fetchDistanceMatrix,
  buildGraph,
  dijkstra,
  fetchRoutePolyline,
  UserNode,
} from "./dijkstra";

import { computeSuitability, SuitabilityOptions } from "./suitability";

import {
  fetchChessLocations,
  createChessLocation,
  ChessLocation,
} from "./setLocation";

// ─── Setup default Leaflet marker ───────────────────────────────────────────
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ─── Refs and Global Vars ───────────────────────────────────────────────────
export const mapRef: { current: L.Map | null } = { current: null };
export const challengeModeRef: {
  setChallengeMode?: React.Dispatch<React.SetStateAction<boolean>>;
  chal?: boolean;
  selectedUser?: any;
  searchDistance?: number;
} = {};

export const addingSpotRef: {
  setAddingSpot?: React.Dispatch<React.SetStateAction<boolean>>;
} = {};

const TRONDHEIM_CENTER: LatLngTuple = [63.4305, 10.3951];
const DEFAULT_ZOOM = 13;
const ORS_API_KEY = "5b3ce3597851110001cf6248531655d52f1145c084f0e9a22f18ff56";

let userPos: LatLngTuple = [0, 0];
let searchRange: L.Circle | null = null;
let drawnRoutes: L.Polyline[] = [];
let white: boolean = true;

const chessboardIcon = new L.Icon({
  iconUrl: "/Chessboard.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

let activeRouteLine: L.Polyline | null = null;
let activeOpponentMarker: L.Marker | null = null;
let chessMarkers: L.Marker[] = [];

// ─── Map Init ───────────────────────────────────────────────────────────────
export function initMap(containerId = "map") {
  if (!mapRef.current) {
    mapRef.current = L.map(containerId).setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);
  }
  mapRef.current.invalidateSize();

  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      userPos = [latitude, longitude];

      const cu = JSON.parse(localStorage.getItem("currentUser") || "{}");
      cu.latitude = latitude;
      cu.longitude = longitude;
      localStorage.setItem("currentUser", JSON.stringify(cu));

      mapRef.current!.setView(userPos, DEFAULT_ZOOM, { animate: true });
      userLocation();
      saveUserLocation(latitude, longitude);
    },
    (err) => console.error("Geolocation error:", err),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// ─── User Position Marker ───────────────────────────────────────────────────
export function userLocation() {
  if (!mapRef.current) return;
  const map = mapRef.current;

  const currentUser = getUser();
  if (currentUser?.latitude != null && currentUser?.longitude != null) {
    userPos = [currentUser.latitude, currentUser.longitude];
  }

  const icon = new L.Icon.Default();
  let m = (map as any)._userMarker as L.Marker | undefined;
  if (m) {
    m.setLatLng(userPos);
  } else {
    m = L.marker(userPos, { icon, draggable: true })
      .addTo(map)
      .bindPopup("Din posisjon")
      .openPopup();
    (map as any)._userMarker = m;
  }

  m.off("dragend").on("dragend", (e) => {
    const { lat, lng } = (e.target as L.Marker).getLatLng();
    userPos = [lat, lng];
    saveUserLocation(lat, lng);
  });
}

// ─── Save user location to backend ──────────────────────────────────────────
function saveUserLocation(lat: number, lng: number) {
  const cu = getUser();
  if (cu)
    fetch("http://localhost:3001/api/users/location", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: cu.username,
        latitude: lat,
        longitude: lng,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Location saved:", data))
      .catch((err) => console.error("🔥 Save failed:", err));
}

// ─── Localstorage getUser ───────────────────────────────────────────────────
export function getUser() {
  const stored = localStorage.getItem("currentUser");
  if (!stored || !mapRef.current) return;
  return JSON.parse(stored);
}

// ─── Clear routes and active markers ────────────────────────────────────────
export function clearMapExtras() {
  if (!mapRef.current) return;
  if (activeRouteLine) {
    mapRef.current.removeLayer(activeRouteLine);
    activeRouteLine = null;
  }
  if (activeOpponentMarker) {
    mapRef.current.removeLayer(activeOpponentMarker);
    activeOpponentMarker = null;
  }
}
// ─── Draw Search Circle ─────────────────────────────────────────────────────
export function drawCircle(radiusKm: number) {
  if (!mapRef.current) return;
  if (searchRange) mapRef.current.removeLayer(searchRange);
  searchRange = L.circle(userPos, { radius: radiusKm * 1000 });
  searchRange.addTo(mapRef.current);
}

// ─── Reset Map (clears everything except tile layer and user marker) ─────────
export function resetMap() {
  if (!mapRef.current) return;
  const map = mapRef.current;
  map.eachLayer((layer) => {
    if (!(layer instanceof L.TileLayer)) {
      if ((map as any)._userMarker && layer === (map as any)._userMarker)
        return;
      map.removeLayer(layer);
    }
  });
  drawnRoutes.forEach((line) => map.removeLayer(line));
  drawnRoutes = [];
}

// ─── Search Profiles ────────────────────────────────────────────────────────
export function searchProfiles(
  whiteMode: boolean,
  ratingRange: [number, number],
  distanceKm: number
) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  white = whiteMode;
  challengeModeRef.searchDistance = distanceKm;

  resetMap();
  drawCircle(distanceKm);
  userLocation();

  const cu = getUser();
  let me = "";
  if (cu) {
    if (cu.latitude != null && cu.longitude != null) {
      userPos = [cu.latitude, cu.longitude];
    }
    me = cu.username;
  }

  fetch("http://localhost:3001/api/users/locations")
    .then((res) => res.json())
    .then(
      (data: {
        locations: {
          username: string;
          latitude: number;
          longitude: number;
          elo: number | null;
        }[];
      }) => {
        data.locations.forEach((u) => {
          if (u.username === me) return;
          const elo = u.elo ?? 0;
          if (elo < ratingRange[0] || elo > ratingRange[1]) return;

          const distKm =
            map.distance(userPos, [u.latitude, u.longitude]) / 1000;
          if (distKm > distanceKm) return;

          userPopup(
            {
              username: u.username,
              rating: elo,
              location: [u.latitude, u.longitude],
            },
            whiteMode
          );
        });
      }
    )
    .catch(console.error);
}

// ─── User Popup ─────────────────────────────────────────────────────────────
function userPopup(
  u: { username: string; rating: number; location: LatLngTuple },
  whiteMode: boolean
) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  let img: string;
  if (u.rating < 500) img = "pawn.png";
  else if (u.rating < 800) img = "knight.png";
  else if (u.rating < 1000) img = "bishop.png";
  else if (u.rating < 1500) img = "rook.png";
  else if (u.rating < 2000) img = "queen.png";
  else img = "king.png";

  const icon = L.icon({
    iconUrl: whiteMode ? `white${img}` : `black${img}`,
    iconSize: [30, 30],
  });

  const marker = L.marker(u.location, { icon }).addTo(map);

  if (!challengeModeRef.chal) {
    const popupDiv = document.createElement("div");
    const heading = document.createElement("h1");
    heading.textContent = u.username;
    const ratingP = document.createElement("p");
    ratingP.textContent = `ELO: ${u.rating}`;

    const button = document.createElement("button");
    button.textContent = "Send challenge";
    button.style.backgroundColor = "lightblue";
    button.onclick = () => challengeView(u);

    popupDiv.appendChild(heading);
    popupDiv.appendChild(ratingP);
    popupDiv.appendChild(button);

    marker.bindPopup(popupDiv);
  }
}

// ─── Challenge View ─────────────────────────────────────────────────────────
function challengeView(opponent: any) {
  if (challengeModeRef.setChallengeMode) {
    challengeModeRef.selectedUser = opponent;
    challengeModeRef.setChallengeMode(() => true);
    challengeModeRef.chal = true;
  }
  resetMap();
  userPopup(opponent, white);
}

export function exitChallengeView() {
  if (challengeModeRef.setChallengeMode) {
    challengeModeRef.setChallengeMode(() => false);
    challengeModeRef.chal = false;
  }
  resetMap();
}

// ─── Suitable Locations Dummy ───────────────────────────────────────────────
export function suitableLocations(_: any, __: any) {
  return [1, 2, 3];
}

// ─── Chess Spots: Draw, Load, Add ───────────────────────────────────────────
export function drawChessSpot(spot: ChessLocation) {
  if (!mapRef.current) return;
  const newSpot = L.marker([spot.latitude, spot.longitude], {
    icon: chessboardIcon,
  })
    .addTo(mapRef.current)
    .bindPopup(
      `<b>${spot.name}</b><br/>Type: ${spot.location_type}<br/>
      <select id="transport-${spot.location_id}" style="margin-top:5px;">
        <option value="foot-walking">Walk</option>
        <option value="driving-car">Drive</option>
      </select><br/>
      <button id="goToSpot-${spot.location_id}" style="background-color:lightblue;margin-top:5px;">Find Route</button>`
    )
    .on("popupopen", () => {
      const btn = document.getElementById(`goToSpot-${spot.location_id}`);
      const select = document.getElementById(
        `transport-${spot.location_id}`
      ) as HTMLSelectElement;
      if (btn && select) {
        btn.addEventListener("click", async () => {
          const mode = select.value as "foot-walking" | "driving-car";
          await findPathToLocation(spot, mode);
        });
      }
    });
  return newSpot;
}

export async function loadChessSpots() {
  if (chessMarkers.length > 0) {
    chessMarkers.forEach((m) => mapRef.current?.removeLayer(m));
    chessMarkers = [];
  }
  try {
    const spots = await fetchChessLocations();
    spots.forEach((s) => {
      const m = drawChessSpot(s);
      if (m) chessMarkers.push(m);
    });
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Failed to load chess spots");
  }
}

export function enableAddSpot() {
  if (!mapRef.current) return;
  if (addingSpotRef.setAddingSpot) {
    addingSpotRef.setAddingSpot(() => true);
  }

  mapRef.current.once("click", async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const name = prompt("Spot name:")?.trim();
    const location_type = prompt("Spot type (e.g. park):")?.trim();
    if (!name || !location_type) {
      alert("Name & type required");
      if (addingSpotRef.setAddingSpot) {
        addingSpotRef.setAddingSpot(() => false);
      }
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
        const m = drawChessSpot(newLoc);
        if (m) chessMarkers.push(m);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save chess spot");
    } finally {
      if (addingSpotRef.setAddingSpot) {
        addingSpotRef.setAddingSpot(() => false);
      }
    }
  });
}

// ─── Fetch Route Polyline with Distance ─────────────────────────────────────
export async function fetchRoutePolylineWithDistance(
  from: [number, number],
  to: [number, number],
  apiKey: string,
  transportMode: "driving-car" | "foot-walking"
): Promise<{ polyline: L.Polyline; distanceKm: number }> {
  const url = `https://api.openrouteservice.org/v2/directions/${transportMode}/geojson`;
  const body = { coordinates: [from, to] };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch route");
  }

  const data = await res.json();
  const coords = data.features[0].geometry.coordinates.map((c: number[]) => [
    c[1],
    c[0],
  ]) as LatLngTuple[];
  const distanceMeters = data.features[0].properties.summary.distance;
  const distanceKm = distanceMeters / 1000;

  return {
    polyline: L.polyline(coords, { weight: 5 }),
    distanceKm,
  };
}

// ─── Find Path to Chess Spot ─────────────────────────────────────────────────
export async function findPathToLocation(
  spot: ChessLocation,
  transportMode: "driving-car" | "foot-walking"
) {
  clearMapExtras();
  if (!mapRef.current) return;
  const currentUser = getUser();
  if (!currentUser) return;

  const marker = L.marker([spot.latitude, spot.longitude], {
    icon: chessboardIcon,
  }).addTo(mapRef.current);
  activeOpponentMarker = marker;

  const { polyline, distanceKm } = await fetchRoutePolylineWithDistance(
    [currentUser.longitude, currentUser.latitude],
    [spot.longitude, spot.latitude],
    ORS_API_KEY,
    transportMode
  );

  activeRouteLine = polyline;
  activeRouteLine.addTo(mapRef.current);

  marker
    .bindPopup(
      `<b>${spot.name}</b><br/>Type: ${
        spot.location_type
      }<br/>Travel Distance: ${distanceKm.toFixed(2)} km`
    )
    .openPopup();

  mapRef.current.setView([spot.latitude, spot.longitude], 13);
}

// ─── Find Closest Player ────────────────────────────────────────────────────
export async function findClosestPlayer(
  minRating: number,
  maxRating: number,
  transportMode: "driving-car" | "foot-walking"
) {
  clearMapExtras();
  const currentUser = getUser();
  if (!currentUser) return;
  const username = currentUser.username;

  const allUsers = await fetchUsers();
  const self = allUsers.find((u) => u.username === username);
  if (!self) return;

  const filtered = allUsers.filter(
    (u) =>
      u.username !== username &&
      u.elo !== null &&
      u.elo >= minRating &&
      u.elo <= maxRating
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

  if (!mapRef.current) return;
  const marker = L.marker([closest.latitude, closest.longitude])
    .addTo(mapRef.current)
    .bindPopup(
      `<b>${closest.username}</b><br/>ELO: ${
        closest.elo
      }<br/>Travel Distance: ${minDist.toFixed(2)} km`
    )
    .openPopup();
  activeOpponentMarker = marker;

  const { polyline } = await fetchRoutePolylineWithDistance(
    [self.longitude, self.latitude],
    [closest.longitude, closest.latitude],
    ORS_API_KEY,
    transportMode
  );

  activeRouteLine = polyline;
  activeRouteLine.addTo(mapRef.current);

  mapRef.current.setView([closest.latitude, closest.longitude], 13);
}

// ─── Find Best Match Player ─────────────────────────────────────────────────
export async function findBestMatch(
  minRating: number,
  maxRating: number,
  searchDistance: number,
  transportMode: "driving-car" | "foot-walking"
) {
  clearMapExtras();
  const currentUser = getUser();
  if (!currentUser) return;
  const username = currentUser.username;

  const allUsers = await fetchUsers();
  const self = allUsers.find((u) => u.username === username);
  if (!self) return;

  const filtered = allUsers.filter(
    (u) =>
      u.username !== username &&
      u.elo !== null &&
      u.elo >= minRating &&
      u.elo <= maxRating
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

  if (!mapRef.current) return;
  const marker = L.marker([bestMatch.user.latitude, bestMatch.user.longitude])
    .addTo(mapRef.current)
    .bindPopup(
      `<b>${bestMatch.user.username}</b><br/>ELO: ${
        bestMatch.user.elo
      }<br/>Suitability Score: ${bestMatch.score.toFixed(2)}`
    )
    .openPopup();
  activeOpponentMarker = marker;

  const { polyline } = await fetchRoutePolylineWithDistance(
    [self.longitude, self.latitude],
    [bestMatch.user.longitude, bestMatch.user.latitude],
    ORS_API_KEY,
    transportMode
  );

  activeRouteLine = polyline;
  activeRouteLine.addTo(mapRef.current);

  mapRef.current.setView(
    [bestMatch.user.latitude, bestMatch.user.longitude],
    13
  );
}
