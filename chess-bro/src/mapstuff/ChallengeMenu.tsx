import { useEffect, useState } from "react";
import {
  challengeModeRef,
  drawChessSpot,
  exitChallengeView,
  getUser,
  mapRef,
} from "./map";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ChessLocation, fetchChessLocations } from "./setLocation";

interface ChessStats {
  username: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  favoritetype: string;
}

export default function ChallengeMenu() {
  const [format, setFormat] = useState<
    "bullet" | "blitz" | "rapid" | "classical"
  >("blitz");
  const [location, setLocation] = useState<ChessLocation>();
  const [suitableLocations, setSuitableLocations] = useState<ChessLocation[]>();
  const [playerFav, setPlayerFav] = useState<string>("");
  const [opponentFav, setOpponentFav] = useState<string>("");

  const player = getUser()!;
  const opponent = challengeModeRef.selectedUser!;

  useEffect(() => {
    fetch(`http://localhost:3001/api/chess/${player.username}`)
      .then((r) => r.json())
      .then((d: { chessStats: ChessStats | null }) =>
        setPlayerFav(d.chessStats?.favoritetype || "")
      )
      .catch(console.error);

    fetch(`http://localhost:3001/api/chess/${opponent.username}`)
      .then((r) => r.json())
      .then((d: { chessStats: ChessStats | null }) =>
        setOpponentFav(d.chessStats?.favoritetype || "")
      )
      .catch(console.error);
  }, [player.username, opponent.username]);

  useEffect(() => {
    (async () => {
      const all = await fetchChessLocations();
      if (!mapRef.current || !challengeModeRef.searchDistance) return;
      const max = challengeModeRef.searchDistance;
      const filtered = all.filter((loc) => {
        const d1 =
          mapRef.current!.distance(
            [player.latitude, player.longitude],
            [loc.latitude, loc.longitude]
          ) / 1000;
        const d2 =
          mapRef.current!.distance(opponent.location, [
            loc.latitude,
            loc.longitude,
          ]) / 1000;
        return d1 <= max || d2 <= max;
      });
      filtered.forEach(drawChessSpot);
      setSuitableLocations(filtered);
    })();
  }, []);

  const outline = (f: string) => {
    if (f === playerFav && f === opponentFav)
      return "0 0 15px rgba(0,0,200,0.5)";
    if (f === playerFav) return "0 0 15px rgba(0,200,0,0.5)";
    if (f === opponentFav) return "0 0 15px rgba(200,0,0,0.5)";
    return "";
  };

  const labelText = (f: string) => {
    if (f === playerFav && f === opponentFav) return "Both players’ favorite";
    if (f === playerFav) return "Your favorite";
    if (f === opponentFav) return `${opponent.username}’s favorite`;
    return "";
  };

  async function sendChallenge() {
    if (!player || !opponent || !format || !location) {
      alert("Select format and location first");
      return;
    }
    await fetch("http://localhost:3001/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromUser: player.username,
        toUser: opponent.username,
        format,
        locationId: location.location_id,
      }),
    });
    alert("Challenge sent");
    exitChallengeView();
  }

  return (
    <div className="w-1/4 flex flex-col items-center">
      <Button
        onClick={exitChallengeView}
        variant="contained"
        color="error"
        sx={{ my: 2, width: "50%" }}
      >
        Close
      </Button>

      <h2 className="text-4xl mb-4">Challenge {opponent.username}</h2>

      <p>Suggest a format</p>
      <ToggleButtonGroup
        value={format}
        exclusive
        onChange={(_, f) => setFormat(f || format)}
        sx={{ width: "100%", justifyContent: "space-between" }}
      >
        {["bullet", "blitz", "rapid", "classical"].map((f) => (
          <ToggleButton
            key={f}
            value={f}
            sx={{ flex: 1, boxShadow: outline(f) }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className="flex justify-between w-full px-5 mb-4">
        {["bullet", "blitz", "rapid", "classical"].map((f) => (
          <div key={f} className="text-xs text-center w-1/5">
            {labelText(f)}
          </div>
        ))}
      </div>

      <p>Suggest a location</p>
      <ToggleButtonGroup
        value={location}
        exclusive
        onChange={(_, loc) => setLocation(loc!)}
        sx={{
          width: "100%",
          justifyContent: "space-around",
          mb: 4,
          overflowX: "auto",
        }}
      >
        {suitableLocations?.map((loc) => (
          <ToggleButton key={loc.location_id} value={loc}>
            {loc.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Button
        onClick={sendChallenge}
        variant="contained"
        color="success"
        sx={{ my: 2, width: "50%" }}
      >
        Send challenge
      </Button>
    </div>
  );
}
