import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPage() {
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const mapDiv = document.getElementById("map");
    if (!mapDiv || mapRef.current) return;

    // 1. Initialize map
    const map = L.map(mapDiv).setView([63.4305, 10.3951], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // 2. Fetch all user locations
    fetch("http://localhost:3001/api/users/locations")
      .then((res) => res.json())
      .then((data) => {
        data.locations.forEach(
          (user: {
            username: string;
            latitude: number;
            longitude: number;
            elo: number | null;
          }) => {
            const emoji = getChessEmoji(user.elo);

            L.marker([user.latitude, user.longitude], {
              icon: L.divIcon({
                className: "custom-emoji-icon",
                html: `<div style="font-size: 24px;">${emoji}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              }),
            })
              .addTo(map)
              .bindPopup(
                `<b>${emoji} ${user.username}</b><br/>ELO: ${user.elo ?? "?"}`
              );
          }
        );
      })
      .catch(console.error);

    // 3. Add interaction for logged-in user
    const stored = localStorage.getItem("currentUser");
    if (!stored) return;

    const currentUser = JSON.parse(stored) as {
      username: string;
      latitude?: number;
      longitude?: number;
    };

    // 3a. Show current user’s marker if it exists
    if (currentUser.latitude != null && currentUser.longitude != null) {
      const marker = L.marker([currentUser.latitude, currentUser.longitude], {
        draggable: true,
        icon: L.divIcon({
          html: `<div style="font-size: 26px;">📍</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      })
        .addTo(map)
        .bindPopup("Din posisjon")
        .openPopup();

      userMarkerRef.current = marker;

      marker.on("dragend", (e) => {
        const { lat, lng } = (e.target as L.Marker).getLatLng();
        updateUserLocation(currentUser.username, lat, lng);
      });
    }

    // 3b. Allow setting/updating user location on map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const newMarker = L.marker([lat, lng], {
        draggable: true,
        icon: L.divIcon({
          html: `<div style="font-size: 26px;">📍</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      })
        .addTo(map)
        .bindPopup("Din nye posisjon")
        .openPopup();

      userMarkerRef.current = newMarker;
      updateUserLocation(currentUser.username, lat, lng);

      newMarker.on("dragend", (e) => {
        const { lat, lng } = (e.target as L.Marker).getLatLng();
        updateUserLocation(currentUser.username, lat, lng);
        window.location.reload();
      });
    });
  }, []);

  // Send new coordinates to backend
  const updateUserLocation = (username: string, lat: number, lng: number) => {
    fetch("http://localhost:3001/api/users/location", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, latitude: lat, longitude: lng }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Location updated:", data);
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
        user.latitude = lat;
        user.longitude = lng;
        localStorage.setItem("currentUser", JSON.stringify(user));
      })
      .catch(console.error);
  };

  // ELO → emoji
  function getChessEmoji(elo: number | null): string {
    if (elo === null) return "❓";
    if (elo < 500) return "♙"; // bonde
    if (elo < 800) return "♗"; // løper
    if (elo < 1000) return "♘"; // springer
    if (elo < 1500) return "♖"; // tårn
    if (elo < 2000) return "♕"; // dronning
    return "♔"; // konge
  }

  return <div id="map" style={{ height: "700px", width: "100%" }} />;
}
