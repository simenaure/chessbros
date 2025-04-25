import { useState } from "react";
import {challengeModeRef, exitChallengeView } from "./map";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";


export default function ChallengeMenu() {

    const [format, setFormat] = useState("blitz");
    const [location, setLocation] = useState();

    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;
    const player = JSON.parse(currentUser);
    const opponent = challengeModeRef.selectedUser;

    const playerFav = "blitz";
    const opponentFav = "blitz";

    const formatOutline  = (format : string) => {
        if (format == playerFav && format == opponentFav) return "2px solid green";
        if (format == playerFav) return "2px solid blue";
        if (format == opponentFav) return "2px solid red";
    };

    return (
        <div className="w-1/4 flex flex-col items-center">
            FIGHT!
            <button onClick={exitChallengeView}>
                Close
            </button>
            <h1>Challenge {opponent?.username}</h1>
            <h2>Suggest a format</h2>
            <ToggleButtonGroup
                value={format}
                onChange={(e, val) => setFormat(val)}
                exclusive
                color="warning"
            >
                <ToggleButton 
                    value={"blitz"} 
                    sx={{
                        border: formatOutline("blitz"),
                        mx: 2
                    }}
                >
                    Blitz
                </ToggleButton>
                <ToggleButton
                    value={"rapid"}
                    sx={{
                        border: formatOutline("rapid"),
                        mx: 2
                    }}
                >
                    Rapid
                </ToggleButton>
                <ToggleButton
                    value={"classical"}
                    sx={{
                        border: formatOutline("classical"),
                        mx: 2
                    }}
                >
                    Classical
                </ToggleButton>
            </ToggleButtonGroup>
            <h2>Suggest a location</h2>
            <ul>

            </ul>
            <button>Send challenge</button>
            {format}
        </div>
    )
}