// MapMenu.tsx

import { Button, FormControlLabel, Slider, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { drawCircle, resetMap, searchProfiles, userLocation } from "./map";

export default function MapMenu() {
  const [isHidden, setIsHidden] = useState(false);
  const [searchRating, setSearchRating] = useState<[number, number]>([
    600, 1200,
  ]);
  const [searchDistance, setSearchDistance] = useState<number>(1);
  const [whiteMode, setWhiteMode] = useState<boolean>(true);

  // Whenever these change, redraw your own marker + circle
  useEffect(() => {
    if (!isHidden) {
      userLocation(whiteMode);
      drawCircle(searchDistance);
    }
  }, [whiteMode, searchDistance, isHidden]);

  return (
    <div className="w-1/4 flex flex-col items-center">
      <FormControlLabel
        control={
          <Switch
            color="success"
            checked={!isHidden}
            onChange={() => {
              setIsHidden(!isHidden);
              resetMap();
            }}
          />
        }
        label="Show me to other profiles"
        labelPlacement="start"
      />

      {!isHidden && (
        <div className="w-full border-2 flex flex-col p-2">
          <p>Preferred rating</p>
          <Slider
            sx={{ width: "80%", alignSelf: "center" }}
            getAriaLabel={() => "Rating"}
            valueLabelDisplay="auto"
            min={0}
            max={3000}
            step={10}
            value={searchRating}
            onChange={(_, val) => setSearchRating(val as [number, number])}
          />

          <p>Maximum distance (km)</p>
          <Slider
            sx={{ width: "80%", alignSelf: "center" }}
            valueLabelDisplay="auto"
            min={0.5}
            max={10}
            step={0.5}
            value={searchDistance}
            onChange={(_, val) => setSearchDistance(val as number)}
          />

          <div className="flex items-center justify-center my-2">
            <img src="whiteking.png" className="w-8 h-8" />
            <Switch
              color="success"
              checked={!whiteMode}
              onChange={() => setWhiteMode(!whiteMode)}
            />
            <img src="blackking.png" className="w-8 h-8" />
          </div>

          <Button
            sx={{ width: "50%", alignSelf: "center" }}
            variant="contained"
            color="success"
            onClick={() =>
              searchProfiles(whiteMode, searchRating, searchDistance)
            }
          >
            Search profiles
          </Button>
        </div>
      )}
    </div>
  );
}
