import "leaflet/dist/leaflet.css";
import L from "leaflet";
/*import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"*/
import { useEffect } from "react";
import MapMenu from "./MapMenu";
import { mapRef } from "./map";

export default function MapPage() {
  useEffect(() => {
    // Ensure the map is only initialized once
    if (!document.getElementById("map")?.hasChildNodes()) {
      var map = L.map("map").setView([63.43, 10.4], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapRef.current = map;
    }
  }, []);

  return (
    <div className="flex">
      <MapMenu />
      <div id="map" style={{ height: "700px", width: "100%" }}></div>
    </div>
  );
}
