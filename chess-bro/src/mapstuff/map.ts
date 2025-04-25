import L, { LatLngTuple } from "leaflet";
import { user } from "../login/user";
//import { useEffect, useRef } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configure default Leaflet marker icon
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const mapRef: { current: L.Map | null } = { current: null };
export const challengeModeRef: {
  setChallengeMode?: React.Dispatch<React.SetStateAction<boolean>>;
  chal?: boolean;
  selectedUser?: user;
} = {};

const TRONDHEIM_CENTER: LatLngTuple = [63.4305, 10.3951];
const DEFAULT_ZOOM = 13;

let userPos: LatLngTuple = [0, 0];
let searchRange: L.Circle | null = null;
let drawnRoutes: L.Polyline[] = [];

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

  map.setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);
}

export function drawCircle(radiusKm: number) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  map.setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);

  if (searchRange) {
    map.removeLayer(searchRange);
  }
  searchRange = L.circle(userPos, { radius: radiusKm * 1000 });
  searchRange.addTo(map);
}
/*
export function userLocation() {
  if (!mapRef.current) return;
  const map = mapRef.current;

  // Read stored coordinates
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    const cu = JSON.parse(stored) as { latitude?: number; longitude?: number };
    if (cu.latitude != null && cu.longitude != null) {
      userPos = [cu.latitude, cu.longitude];
    }
  }*/

export function userLocation() {
      if (!mapRef.current) return;
      const map = mapRef.current;
    
      // Read stored coordinates
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const cu = JSON.parse(stored) as { latitude?: number; longitude?: number };
        if (cu.latitude != null && cu.longitude != null) {
          userPos = [cu.latitude, cu.longitude];
        }
      }

  map.off("click");

  // Use default blue pin icon
  const icon = new L.Icon.Default();
  let marker = (map as any)._userMarker as L.Marker | undefined;
  if (marker) {
    marker.setLatLng(userPos);
  } else {
    marker = L.marker(userPos, { icon, draggable: true })
      .addTo(map)
      .bindPopup("Din posisjon")
      .openPopup();
    (map as any)._userMarker = marker;
  }

  // Drag to save
  marker.off("dragend").on("dragend", (e) => {
    const { lat, lng } = (e.target as L.Marker).getLatLng();
    userPos = [lat, lng];
    saveUserLocation(lat, lng);
  });

  // Click to move & save
  map.on("click", (e: L.LeafletMouseEvent) => {
    marker!.setLatLng(e.latlng).openPopup();
    userPos = [e.latlng.lat, e.latlng.lng];
    saveUserLocation(userPos[0], userPos[1]);
  });
}


function saveUserLocation(lat: number, lng: number) {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return;
  const cu = JSON.parse(stored) as { username: string };

  fetch("http://localhost:3001/api/users/location", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cu.username, latitude: lat, longitude: lng }),
  })
    .then((res) => res.json())
    .then((data) => console.log("✅ Location saved:", data))
    .catch((err) => console.error("🔥 Save failed:", err));
}

export function searchProfiles(
  whiteMode: boolean,
  ratingRange: [number, number],
  distanceKm: number
) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  resetMap();
  drawCircle(distanceKm);
  userLocation();

  const stored = localStorage.getItem("currentUser");
  let me = "";
  if (stored) {
    const cu = JSON.parse(stored) as {
      username: string;
      latitude?: number;
      longitude?: number;
    };
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
            whiteMode,
            distKm
          );
        });
      }
    )
    .catch(console.error);
}

function userPopup(
  u: { username: string; rating: number; location: LatLngTuple },
  whiteMode: boolean,
  distKm: number
) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  let img: string;
  if (u.rating < 500) img = "pawn.png";
  else if (u.rating < 800) img = "bishop.png";
  else if (u.rating < 1000) img = "knight.png";
  else if (u.rating < 1500) img = "rook.png";
  else if (u.rating < 2000) img = "queen.png";
  else img = "king.png";

  const icon = L.icon({
    iconUrl: whiteMode ? `white${img}` : `black${img}`,
    iconSize: [30, 30],
  });

  const marker = L.marker(u.location, { icon }).addTo(map);

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

function challengeView(opponent: any) {
  if (challengeModeRef.setChallengeMode) {
    challengeModeRef.selectedUser = opponent;
    challengeModeRef.setChallengeMode((prev) => {
      challengeModeRef.chal = !prev;
      return !prev;
    });
  }

  if (mapRef.current) {
    mapRef.current.closePopup();
  }
}

export function exitChallengeView() {
  if (challengeModeRef.setChallengeMode) {
    challengeModeRef.setChallengeMode(() => false);
    challengeModeRef.chal = false;
  }
  resetMap();
}

export function suitableLocations(player: user, opponent: user) {
  const locations: number[] = [1, 2, 3];
  return locations;
}

export function initMap(containerId = "map") {
  // 1) Create the map if needed
  if (!mapRef.current) {
    mapRef.current = L.map(containerId).setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);
  }

  // 2) Fix sizing if the container was hidden/re-shown
  mapRef.current.invalidateSize();

  // 3) Prompt for geolocation
  if (!navigator.geolocation) {
    console.error("Geolocation not supported by this browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      userPos = [latitude, longitude];

      // 4) Store coords so userLocation() picks them up
      const cu = JSON.parse(localStorage.getItem("currentUser") || "{}");
      cu.latitude  = latitude;
      cu.longitude = longitude;
      localStorage.setItem("currentUser", JSON.stringify(cu));

      // 5) Center map & drop/move marker
      mapRef.current!.setView(userPos, DEFAULT_ZOOM, { animate: true });
      userLocation();

      // 6) Send this first position immediately to your backend
      saveUserLocation(latitude, longitude);
    },
    (err) => console.error("Geolocation error:", err),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}