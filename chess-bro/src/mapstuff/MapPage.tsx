import "leaflet/dist/leaflet.css";
import L from "leaflet";
/*import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"*/
import { useEffect, useState } from "react";
import MapMenu from "./MapMenu";
import { challengeModeRef, mapRef } from "./map";
import ChallengeMenu from "./ChallengeMenu";

export default function MapPage() {

  const [challengeMode, setChallengeMode] = useState(false);

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

  useEffect(() => {
    challengeModeRef.setChallengeMode = setChallengeMode;
  }, []);

  useEffect(() => {
    challengeModeRef.chal = challengeMode;
  }, [challengeMode]);

  return (
    <div className="flex">
      {!challengeModeRef.chal ? <MapMenu/> : <ChallengeMenu />}
      <div id="map" 
        style={{ height: "800px", width: "80%" }}
      ></div>
    </div>
  );
  
}
