import { Button, FormControlLabel, Slider, Switch } from "@mui/material";
import { useState } from "react";

export default function MapMenu() {

    const [isHidden, setIsHidden] = useState(false);
    const [searchRating, setSearchRating] = useState([600, 1200]);
    const [searchDistance, setSearchDistance] = useState(1);

    function searchProfiles(){
        //Vis profiler i nærheten på kart
        return;
    }

    function changeDistance(value : number){
        //Tegn sirkel på kart

        setSearchDistance(value);
    }

    return (
        <div className="w-1/4 flex flex-col items-center">
            Hello on the toilet

            <FormControlLabel 
                control={<Switch 
                    color="success"
                    checked={!isHidden}
                    onChange={() => setIsHidden(!isHidden)}
                />}
                label={"Show me to other profiles"}
                labelPlacement="start"
            />
            
            {isHidden ? null : <div className="w-full border-2 flex flex-col">
                <p>Preferred rating</p>
                <Slider 
                    sx={{width: 4/5, alignSelf: "center"}}
                    aria-label="Rating"
                    valueLabelDisplay="auto"
                    min={0}
                    max={3000}
                    value={searchRating}
                    onChange={(e, value) => setSearchRating(value as number[])}
                />

                <p>Maximum distance (km)</p>
                <Slider 
                    sx={{width: 4/5, alignSelf: "center"}}
                    aria-label="Rating"
                    valueLabelDisplay="auto"
                    min={1}
                    max={20}
                    value={searchDistance}
                    onChange={(e, value) => changeDistance(value as number)}
                />

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