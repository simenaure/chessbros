import L, { LatLngTuple } from "leaflet";
import { user } from "../login/user";

export const mapRef: { current: L.Map | null } = { current: null };
export const challengeModeRef : {
    setChallengeMode?: React.Dispatch<React.SetStateAction<boolean>>;
    chal?: boolean;
    selectedUser?: user;
} = {};


//Trenger funksjon som henter inn sanntidsposisjon til bruker
var userPos : LatLngTuple = [63.42 , 10.41]
var searchRange : L.Circle | null = null;

var white : boolean = true

export function resetMap() {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
            map.removeLayer(layer);
        }
    })
}

export function searchProfiles(whiteMode : boolean) {

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
          rating: 1004.8,
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

    white = whiteMode;

    var whiteImage;
    var blackImage;

    if(user.rating < 600){
        whiteImage = "blackpawn.png";
        blackImage = "whitepawn.png";
    }
    else if(user.rating < 1200){
        whiteImage = "blackknight.png";
        blackImage = "whiteknight.png";
    }
    else if(user.rating < 1800){
        whiteImage = "blackbishop.png";
        blackImage = "whitebishop.png";
    }
    else if(user.rating < 2400){
        whiteImage = "blackrook.png";
        blackImage = "whiterook.png";
    }
    else{
        whiteImage = "blackqueen.png";
        blackImage = "whitequeen.png";
    }

    var markerIcon = L.icon({
        iconUrl: whiteMode ? whiteImage : blackImage,
        iconSize: [30, 30]
    });

    var myMarker = L.marker([user.location[0], user.location[1]], {icon: markerIcon});
    myMarker.addTo(map)

    if (!challengeModeRef.chal) {
        const popupContent = document.createElement("div");

        const title = document.createElement("h1");
        title.textContent = user.username;
    
        const rating = document.createElement("p");
        rating.textContent = user.rating.toString();
    
        const button = document.createElement("button");
        button.textContent = "Send challenge";
        button.style.backgroundColor = "lightblue";
        button.onclick = () => challengeView(user);
    
        popupContent.appendChild(title);
        popupContent.appendChild(rating);
        popupContent.appendChild(button);
    
        myMarker.bindPopup(popupContent);
    }
}


function challengeView(opponent : user){
    if (challengeModeRef.setChallengeMode) {
        challengeModeRef.selectedUser = opponent;
        challengeModeRef.setChallengeMode(prev => {
          const updated = !prev;
          challengeModeRef.chal = !prev;
          challengeModeRef.selectedUser = opponent;
          return updated;
        });
    }
    resetMap();
    userLocation(white);
    userPopup(opponent, white);
}

export function exitChallengeView(){
    if (challengeModeRef.setChallengeMode) {
        challengeModeRef.setChallengeMode(() => false);
        challengeModeRef.chal = false;
    }
    resetMap();
    userLocation(white);
}

export function suitableLocations(player : user, opponent : user){
    //Hente inn spillesteder i nærheten av spillerne
    const locations : number[] = [1, 2, 3];
    return locations;
}