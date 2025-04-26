import { useEffect, useState } from "react";
import {challengeModeRef, drawChessSpot, exitChallengeView, getUser, mapRef } from "./map";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ChessLocation, fetchChessLocations } from "./setLocation";


export default function ChallengeMenu() {

    const [format, setFormat] = useState("blitz");
    const [location, setLocation] = useState<ChessLocation>();

    const[suitableLocations, setSuitableLocations] = useState<ChessLocation[]>();

    const player = getUser();
    const opponent = challengeModeRef.selectedUser;

    const playerFav = "bullet";
    const opponentFav = "rapid";
    //const playerFav = getFavoriteType(player);
    //const opponentFav = getFavoriteType(opponent);

    useEffect(() => {
        (async () => {
            try {
                const locations = await fetchChessLocations();
                if (!locations) return;                

                const filtered = locations.filter(loc => {
                    if (!mapRef.current) return false;
                    if (!challengeModeRef.searchDistance) return false;
                    //500 er lik halve søkeradius i meter
                    return mapRef.current.distance([player.latitude, player.longitude], [loc.latitude, loc.longitude])/500 < challengeModeRef.searchDistance
                    || mapRef.current.distance(opponent.location, [loc.latitude, loc.longitude])/500 < challengeModeRef.searchDistance;
                })
                //mapRef.current.distance(userPos, [u.latitude, u.longitude]) / 1000;

                filtered.forEach(loc => drawChessSpot(loc))
                setSuitableLocations(filtered);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
            }
        })();
    }, []);

        

    const formatOutline  = (format : string) => {
        if (format == playerFav && format == opponentFav) return "0 0 15px rgba(0, 0, 200, 0.5)";
        if (format == playerFav) return "0 0 15px rgba(0, 200, 0, 0.5)";
        if (format == opponentFav) return "0 0 15px rgba(200, 0, 0, 0.5)";
        return "";
    };

    const favoriteFormat = (format : string) => {
        if (format == playerFav && format == opponentFav) return "Both players' favorite";
        if (format == playerFav) return "Your favorite";
        if (format == opponentFav) return opponent.username + "'s favorite";
        return "";
    }





    function sendChallenge() {
        throw new Error("Function not implemented.");

        //Lagre utfordring i tabell i databasen og kanskje gi en alert "Utfordring sendt!"
        //OBS: bruk player.username og opponent.username for referanse til brukernavn
    }





    return (
        <div className="w-1/4 flex flex-col items-center">
            <Button
                onClick={exitChallengeView}
                variant="contained"
                color="error"
                sx={{
                    my: "20px",
                    width: "50%"
                }}
            >
                Close
            </Button>
            <h2 className="text-4xl mb-4">Challenge {opponent?.username}</h2>
            <h2 className="text-3xl mb-2">Suggest a format</h2>
            <ToggleButtonGroup
                value={format}
                onChange={(e, form) => setFormat(form)}
                exclusive
                color="warning"
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    paddingX: "20px"
                }}
            >
                <ToggleButton 
                    value={"bullet"} 
                    sx={{
                        boxShadow: formatOutline("bullet"),
                        width: "20%",
                        fontSize: "0.7em"
                    }}
                >
                    Bullet
                </ToggleButton>
                <ToggleButton 
                    value={"blitz"} 
                    sx={{
                        boxShadow: formatOutline("blitz"),
                        width: "20%",
                        fontSize: "0.7em"
                    }}
                >
                    Blitz
                </ToggleButton>
                <ToggleButton
                    value={"rapid"}
                    sx={{
                        boxShadow: formatOutline("rapid"),
                        width: "20%",
                        fontSize: "0.7em"
                    }}
                >
                    Rapid
                </ToggleButton>
                <ToggleButton
                    value={"classical"}
                    sx={{
                        boxShadow: formatOutline("classical"),
                        width: "20%",
                        fontSize: "0.7em"
                    }}
                >
                    Classical
                </ToggleButton>
            </ToggleButtonGroup>
            <div className="flex justify-between w-full px-5">
                    <div className="text-xs text-center w-1/5">{favoriteFormat("bullet")}</div>
                    <div className="text-xs text-center w-1/5">{favoriteFormat("blitz")}</div>
                    <div className="text-xs text-center w-1/5">{favoriteFormat("rapid")}</div>
                    <div className="text-xs text-center w-1/5">{favoriteFormat("classical")}</div>
            </div>
            <h2 className="text-3xl mb-2">Suggest a location</h2>
            <ToggleButtonGroup
                value={location}
                onChange={(e, loc) => setLocation(loc)}
                exclusive
                color="warning"
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    paddingX: "20px",
                    overflowX: "auto",
                    whiteSpace: "nowrap"
                }}
            >
                {suitableLocations?.map((loc, i) => (
                    <ToggleButton 
                        key={i}
                        value={loc}
                        sx={{
                            mx: "5px",
                            fontSize: "0.7em"
                        }}
                    >
                        {loc.name}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Button
                onClick={sendChallenge}
                variant="contained"
                color="success"
                sx={{
                    my: "20px",
                    width: "50%"
                }}
            >
                Send challenge
            </Button>
        </div>
    )
}

function getFavoriteType(player: any) {
    throw new Error("Function not implemented.");

    //Henter favoritt sjakktype fra databasen for en gitt bruker
}
