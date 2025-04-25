import { useState } from "react";
import {challengeModeRef, exitChallengeView } from "./map";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";


export default function ChallengeMenu() {

    const [format, setFormat] = useState("blitz");
    const [location, setLocation] = useState();

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;
    const player = JSON.parse(currentUser);
    const opponent = challengeModeRef.selectedUser;

    const playerFav = "bullet";
    const opponentFav = "rapid";

    const suitableLocations : number[] = [1, 2, 3, 4, 5];

    const formatOutline  = (format : string) => {
        if (format == playerFav && format == opponentFav) return "0 0 25px rgba(0, 0, 200, 0.5)";
        if (format == playerFav) return "0 0 25px rgba(0, 200, 0, 0.5)";
        if (format == opponentFav) return "0 0 25px rgba(200, 0, 0, 0.5)";
        return "";
    };

    const favoriteFormat = (format : string) => {
        if (format == playerFav && format == opponentFav) return "Both players' favorite";
        if (format == playerFav) return "Your favorite";
        if (format == opponentFav) return opponent.username + "'s favorite";
        return "";
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
                onChange={(e, val) => setFormat(val)}
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
                onChange={(e, val) => setLocation(val)}
                exclusive
                color="warning"
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    paddingX: "20px"
                }}
            >
                {suitableLocations.map((loc, i) => (
                    <ToggleButton key={i} value={loc}>
                        {loc}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Button
                onClick={exitChallengeView}
                variant="contained"
                color="success"
                sx={{
                    my: "20px",
                    width: "50%"
                }}
            >
                Send challenge
            </Button>
            {format}{location}
        </div>
    )
}