import "leaflet/dist/leaflet.css";
import L, { Map } from "leaflet";
/*import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"*/
import { useEffect } from "react";
import MapMenu from "./MapMenu";




/*
export default function MapPage() {
   
    /*const L = require('leaflet');*/
   /* var map = L.map('map').setView([51.505, -0.09], 13);


 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  return(

      <div>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
         <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
       integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
       crossOrigin=""></script>
  
        <div id="map"></div>
      </div>
    )


}*/



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


      userPopup(map);
    }
  }, []);

  return (
    <div className="flex">
      <MapMenu />
      <div id="map" 
        style={{ height: "700px", width: "80%" }}
      ></div>
    </div>
   
  );
}


function userPopup(map : Map) {
  var markerIcon = L.icon({
    iconUrl: "chess-kopi.jpg",
    iconSize: [80, 80]
  });

  L.marker([63.43, 10.4], {icon: markerIcon}).addTo(map);
}
  
  