import L, { LatLngTuple } from "leaflet";
import markerImage from "../assets/chess-kopi.jpg";
import { user } from "../login/user";


export const mapRef: { current: L.Map | null } = { current: null };

//Trenger funksjon som henter inn sanntidsposisjon til bruker
var userPos : LatLngTuple = [63.42 , 10.41]
var searchRange : L.Circle | null = null;

export function searchProfiles() {

    //Alle brukere som er synlige for andre
    var activeUsers : user[] = [];

    const dummyUsers: user[] = [
        {
          username: "john_doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          gender: "Male",
          country: "USA",
          city: "New York",
          address: "123 Main St",
          zip: "10001",
          rating: 4.8,
          location: [63.42, 10.4]
        },
        {
          username: "jane_smith",
          email: "jane.smith@example.com",
          phone: "+0987654321",
          gender: "Female",
          country: "Canada",
          city: "Toronto",
          address: "456 Queen St",
          zip: "M5V 2B2",
          rating: 4.6,
          location: [63.43, 10.41]
        },
      ];


    //Brukere som tilfredstiller parameterene fra MapMenu
    var nearbyUsers : user[] = dummyUsers;

    for(var acu of activeUsers) {
        //Logikk for å filtrere på avstand/rating
    }

    //var currentUserMarker = L.marker([63.43, 10.4], {icon: userIcon}).addTo(map);



    var whiteMode = true;

    for(var nbu of nearbyUsers) {
      userPopup(nbu, whiteMode);
    }
}

export function drawCircle(radius : number) {
    if(!mapRef.current) return;
    const map = mapRef.current;

    if (searchRange) {
        map.removeLayer(searchRange);
    }

    searchRange = L.circle(userPos, {radius: radius*1000});
    searchRange.addTo(map);
}

export function userLocation(whiteMode : boolean) {

    if(!mapRef.current) return;
    const map = mapRef.current;

    var markerIcon = L.icon({
        iconUrl: whiteMode ? "whiteking.png" : "blackking.png",
        iconSize: [50, 50]
    });

    var myMarker = L.marker(userPos, {icon: markerIcon});
    myMarker.addTo(map)
}

function userPopup(user : user, whiteMode : boolean) {

    if(!mapRef.current) return;
    const map = mapRef.current;

    var whiteImage;
    var blackImage;

    if(user.rating < 600){
        whiteImage = "whitepawn.png";
        blackImage = "blackpawn.png";
    }
    else if(user.rating < 1200){
        whiteImage = "whiteknight.png";
        blackImage = "blackknight.png";
    }
    else if(user.rating < 1800){
        whiteImage = "whitebishop.png";
        blackImage = "blackbishop.png";
    }
    else if(user.rating < 2400){
        whiteImage = "whiterook.png";
        blackImage = "blackrook.png";
    }
    else{
        whiteImage = "whitequeen.png";
        blackImage = "blackqueen.png";
    }

    var markerIcon = L.icon({
        iconUrl: whiteMode ? whiteImage : blackImage,
        iconSize: [30, 30]
    });

    var myMarker = L.marker([user.location[0], user.location[1]], {icon: markerIcon});
    myMarker.addTo(map)

    var popupContent = `<div>
        <h1>${user.username}</h1>
        <p>${user.rating}</p>
        <button style="background-color: lightblue;" onclick=${sendChallenge}>Send challenge</button>
    </div>`;
    myMarker.bindPopup(popupContent);
}


function sendChallenge(){
    return;
}