import { Button, FormControlLabel, Slider, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { drawCircle, resetMap, searchProfiles, userLocation } from "./map";

export default function MapMenu() {

    const [isHidden, setIsHidden] = useState(false);
    const [searchRating, setSearchRating] = useState([600, 1200]);
    const [searchDistance, setSearchDistance] = useState(1);
    const [whiteMode, setWhiteMode] = useState(true);
    

    useEffect(() => {
        if (!isHidden){
            userLocation(whiteMode);
            drawCircle(searchDistance);
        }
    }, [whiteMode, searchDistance, isHidden])


    return (
        <div className="w-1/4 flex flex-col items-center">
            Hello on the toilet

            <FormControlLabel 
                control={<Switch 
                    color="success"
                    checked={!isHidden}
                    onChange={() => {
                        setIsHidden(!isHidden);
                        resetMap();
                    }}
                />}
                label={"Show me to other profiles"}
                labelPlacement="start"
            />
            
            {isHidden ? null : <div className="w-full border-2 flex flex-col">
                <p>Preferred rating</p>
                <Slider 
                    sx={{width: 4/5, alignSelf: "center"}}
                    getAriaLabel={() => "Rating"}
                    valueLabelDisplay="auto"
                    min={0}
                    max={3000}
                    step={10}
                    value={searchRating}
                    onChange={(e, value) => setSearchRating(value as number[])}
                />

                <p>Maximum distance (km)</p>
                <Slider 
                    sx={{width: 4/5, alignSelf: "center"}}
                    aria-label="Rating"
                    valueLabelDisplay="auto"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={searchDistance}
                    onChange={(e, value) => setSearchDistance(value as number)}
                />

                <div className="flex items-center justify-center">       
                    <img src="whiteking.png" className="w-1/8"/>
                    <Switch 
                        color="success"
                        checked={!whiteMode}
                        onChange={() => setWhiteMode(!whiteMode)}
                    />
                    <img src="blackking.png" className="w-1/8"/>
                </div> 
                <Button
                    sx={{width: 1/2, alignSelf: "center"}}
                    variant="contained"
                    color="success"
                    onClick={searchProfiles}
                >
                    Search profiles
                </Button>
            </div>}

        </div>
    )
}