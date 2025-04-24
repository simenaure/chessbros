import L, { LatLngTuple } from "leaflet";

export const mapRef: { current: L.Map | null } = { current: null };

const TRONDHEIM_CENTER: LatLngTuple = [63.4305, 10.3951];
const DEFAULT_ZOOM = 13;

let userPos: LatLngTuple = [0, 0];
let searchRange: L.Circle | null = null;

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

  map.setView(TRONDHEIM_CENTER, DEFAULT_ZOOM);
}

/** Draws a search radius around the current user */
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

/** Displays the current user’s marker and enables moving it */
export function userLocation() {
  if (!mapRef.current) return;
  const map = mapRef.current;

  const stored = localStorage.getItem("currentUser");
  if (stored) {
    const cu = JSON.parse(stored) as { latitude?: number; longitude?: number };
    if (cu.latitude != null && cu.longitude != null) {
      userPos = [cu.latitude, cu.longitude];
    }
  }

  map.off("click");

  const icon = L.divIcon({
    html: `<div style="font-size:26px;">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  let myMarker = (map as any)._userMarker as L.Marker | undefined;

  if (myMarker) {
    myMarker.setLatLng(userPos);
  } else {
    myMarker = L.marker(userPos, { icon, draggable: true })
      .addTo(map)
      .bindPopup("Din posisjon")
      .openPopup();
    (map as any)._userMarker = myMarker;

    myMarker.on("dragend", (e: L.LeafletEvent) => {
      const { lat, lng } = (e.target as L.Marker).getLatLng();
      saveUserLocation(lat, lng, () => {
        userPos = [lat, lng];
        drawCircle(1); // or store last radius value
      });
    });
  }

  map.on("click", (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    myMarker!.setLatLng([lat, lng]).openPopup();
    saveUserLocation(lat, lng, () => {
      userPos = [lat, lng];
      drawCircle(1);
    });
  });
}

function saveUserLocation(lat: number, lng: number, onUpdate?: () => void) {
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
      if (onUpdate) onUpdate();
    })
    .catch(console.error);
}

/** Loads other users and shows them as piece markers */
export function searchProfiles(
  whiteMode: boolean,
  ratingRange: [number, number],
  distanceKm: number
) {
  if (!mapRef.current) return;
  const map = mapRef.current;

  resetMap();
  drawCircle(distanceKm);
  userLocation(); // restore your own 📍 marker

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
  marker.bindPopup(
    `<b>${u.username}</b><br/>
     ELO: ${u.rating}<br/>
     Avstand: ${distKm.toFixed(2)} km`
  );
}
