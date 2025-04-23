import L, { LatLngTuple } from "leaflet";
import { user } from "../login/user";

export const mapRef: { current: L.Map | null } = { current: null };

// Trondheim center + default zoom
const TRONDHEIM_CENTER: LatLngTuple = [63.4305, 10.3951];
const DEFAULT_ZOOM = 13;

// current user coords (loaded from localStorage)
let userPos: LatLngTuple = [0, 0];
let searchRange: L.Circle | null = null;

/** Clears non-tile layers and recenters on Trondheim */
export function resetMap() {
  if (!mapRef.current) return;
  const map = mapRef.current;

  map.eachLayer((layer) => {
    if (!(layer instanceof L.TileLayer)) {
      map.removeLayer(layer);
    }
  });

  // recenter
  map.setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);
}

/** Draws the radius circle and recenters on Trondheim */
export function drawCircle(radiusKm: number) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  // recenter first
  map.setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);

  if (searchRange) {
    map.removeLayer(searchRange);
  }
  searchRange = L.circle(userPos, { radius: radiusKm * 1000 });
  searchRange.addTo(map);
}

/** Shows draggable 📍 marker for current user + click-to-move */
export function userLocation(whiteMode: boolean) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  // load saved coords
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    const cu = JSON.parse(stored) as { latitude?: number; longitude?: number };
    if (cu.latitude != null && cu.longitude != null) {
      userPos = [cu.latitude, cu.longitude];
    }
  }

  // remove old click handlers
  map.off("click");

  const icon = L.divIcon({
    html: `<div style="font-size:26px;">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  // add or move the marker
  let myMarker = (mapRef.current as any)._userMarker as L.Marker | undefined;
  if (myMarker) {
    myMarker.setLatLng(userPos);
  } else {
    myMarker = L.marker(userPos, { icon, draggable: true })
      .addTo(map)
      .bindPopup("Din posisjon")
      .openPopup();
    (mapRef.current as any)._userMarker = myMarker;

    myMarker.on("dragend", (e: L.LeafletEvent) => {
      const { lat, lng } = (e.target as L.Marker).getLatLng();
      saveUserLocation(lat, lng);
    });
  }

  // click anywhere to move & save
  map.on("click", (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    myMarker!.setLatLng([lat, lng]).openPopup();
    saveUserLocation(lat, lng);
  });
}

/** Persist to backend + update localStorage */
function saveUserLocation(lat: number, lng: number) {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return;
  const cu = JSON.parse(stored);

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
    .then(() => {
      cu.latitude = lat;
      cu.longitude = lng;
      localStorage.setItem("currentUser", JSON.stringify(cu));
    })
    .catch(console.error);
}

/**
 * Fetch & plot other users, filtering by ELO-range & distance,
 * always recenters on Trondheim first.
 */
export function searchProfiles(
  whiteMode: boolean,
  ratingRange: [number, number],
  distanceKm: number
) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  // clear & recenter
  resetMap();

  // draw radius (which also recovers center)
  drawCircle(distanceKm);

  // refresh userPos if changed
  const stored = localStorage.getItem("currentUser");
  if (stored) {
    const cu = JSON.parse(stored) as { latitude?: number; longitude?: number };
    if (cu.latitude != null && cu.longitude != null) {
      userPos = [cu.latitude, cu.longitude];
    }
  }

  // fetch and plot
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

// marker + popup for other users
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
  marker.bindPopup(
    `<b>${u.username}</b><br/>
     ELO: ${u.rating}<br/>
     Avstand: ${distKm.toFixed(2)} km`
  );
}
