// src/mapmenu.tsx
// src/mapmenu.tsx

import { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  Slider,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  drawCircle,
  resetMap,
  userLocation,
  searchProfiles,
  clearMapExtras,
  findClosestPlayer,
  findBestMatch,
  loadChessSpots,
  enableAddSpot,
  addingSpotRef,
} from "./map";

export default function MapMenu() {
  const [isHidden, setIsHidden] = useState(false);
  const [searchRating, setSearchRating] = useState<[number, number]>([
    600, 1200,
  ]);
  const [searchDistance, setSearchDistance] = useState<number>(1);
  const [whiteMode, setWhiteMode] = useState<boolean>(true);
  const [transportMode, setTransportMode] = useState<
    "driving-car" | "foot-walking"
  >("driving-car");

  const [addingSpot, setAddingSpot] = useState(false);

  useEffect(() => {
    if (!isHidden) {
      userLocation();
      drawCircle(searchDistance);
    }
  }, [whiteMode, searchDistance, isHidden]);

  useEffect(() => {
    addingSpotRef.setAddingSpot = setAddingSpot;
  }, []);

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
              clearMapExtras();
            }}
          />
        }
        label="Show me to other profiles"
        labelPlacement="start"
      />

      {!isHidden && (
        <div className="w-full border-2 flex flex-col p-2">
          {/* your existing controls… */}
          <p>Preferred rating</p>
          <Slider
            sx={{ width: "80%", alignSelf: "center" }}
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

          <FormControl sx={{ width: "80%", alignSelf: "center", mt: 2 }}>
            <InputLabel id="mode-label">Transport Mode</InputLabel>
            <Select
              labelId="mode-label"
              value={transportMode}
              label="Transport Mode"
              onChange={(e) =>
                setTransportMode(
                  e.target.value as "driving-car" | "foot-walking"
                )
              }
            >
              <MenuItem value="driving-car">Car</MenuItem>
              <MenuItem value="foot-walking">Walking</MenuItem>
            </Select>
          </FormControl>

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

          <Button
            sx={{ width: "50%", alignSelf: "center", mt: 1 }}
            variant="outlined"
            color="secondary"
            onClick={() =>
              findClosestPlayer(searchRating[0], searchRating[1], transportMode)
            }
          >
            Find Closest Player
          </Button>

          <Button
            sx={{ width: "50%", alignSelf: "center", mt: 1 }}
            variant="outlined"
            color="primary"
            onClick={() =>
              findBestMatch(
                searchRating[0],
                searchRating[1],
                searchDistance,
                transportMode
              )
            }
          >
            Find Best Match
          </Button>
        </div>
      )}
      {/* ─── Chess-spot buttons ────────────────────────────────────────── */}
      <Button
        sx={{ width: "80%", mt: 2 }}
        variant="contained"
        color="secondary"
        onClick={() => loadChessSpots()}
      >
        Load Chess Spots
      </Button>

      <Button
        sx={{ width: "80%", mt: 1 }}
        variant="contained"
        color="secondary"
        onClick={() => {
          setAddingSpot(true);
          enableAddSpot();
        }}
        disabled={addingSpot}
      >
        {addingSpot ? "Click on map…" : "Add Chess Spot"}
      </Button>
    </div>
  );
}
