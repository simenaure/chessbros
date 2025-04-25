import "leaflet/dist/leaflet.css";
import L from "leaflet";
/*import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"*/
import { useEffect, useState } from "react";
import MapMenu from "./MapMenu";
import { challengeModeRef, mapRef, initMap } from "./map";
import ChallengeMenu from "./ChallengeMenu";

export default function MapPage() {
  const [challengeMode, setChallengeMode] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/current-user");
        if (res.ok) {
          const user = await res.json();
          if (user?.username) {
            localStorage.setItem("currentUser", JSON.stringify(user));
          }
        }
      } catch (err) {
        console.warn("No user logged in or server not reachable.");
      } finally {
        // Always initialize the map, even if no user
        initMap("map");
      }
    };

    loadUser();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    challengeModeRef.setChallengeMode = setChallengeMode;
  }, []);

  useEffect(() => {
    challengeModeRef.chal = challengeMode;
  }, [challengeMode]);

  return (
    <div className="flex">
      {!challengeModeRef.chal ? <MapMenu /> : <ChallengeMenu />}
      <div id="map" style={{ height: "800px", width: "80%" }}></div>
    </div>
  );
}
