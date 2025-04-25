import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Box,
} from "@mui/material";

type ChessStats = {
  username: string;
  elo: number | "";
  wins: number | "";
  losses: number | "";
  draws: number | "";
  favoritetype: string;
};

type Props = {
  username: string;
};

export default function ChessProfile({ username }: Props) {
  const [stats, setStats] = useState<ChessStats>({
    username,
    elo: "",
    wins: "",
    losses: "",
    draws: "",
    favoritetype: "",
  });
  const [editMode, setEditMode] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chess stats when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3001/api/chess/${username}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(`HTTP error: ${res.status}`);
      })
      .then((data: { chessStats: ChessStats | null }) => {
        if (data.chessStats) {
          setStats(data.chessStats);
        }
      })
      .catch((err) => {
        console.error("Error fetching chess stats:", err);
      });
  }, [username]);

  const handleChange =
    (field: keyof ChessStats) =>
    (
      e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }
    ) => {
      setStats((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/chess", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: stats.username,
          elo: Number(stats.elo),
          wins: Number(stats.wins),
          losses: Number(stats.losses),
          draws: Number(stats.draws),
          favoritetype: stats.favoritetype,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Unknown error");
      } else {
        const updatedData = await response.json();
        alert("Chess stats saved successfully!");
        setStats(updatedData.chessStats);
        setEditMode(false);
        // Optionally, update localStorage if needed
        localStorage.setItem(
          "chessStats",
          JSON.stringify(updatedData.chessStats)
        );
      }
    } catch (err) {
      console.error("Error saving chess stats:", err);
      setError("Error saving chess stats");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 600,
        margin: "40px auto",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }} align="center">
        Your Chess Stats: {username}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          {/* ELO */}
          <Grid item xs={12}>
            <TextField
              label="ELO"
              variant="outlined"
              size="small"
              fullWidth
              value={stats.elo}
              onChange={handleChange("elo")}
              disabled={!editMode}
            />
          </Grid>
          {/* Wins, Losses, Draws */}
          <Grid item xs={4}>
            <TextField
              label="Wins"
              variant="outlined"
              size="small"
              fullWidth
              value={stats.wins}
              onChange={handleChange("wins")}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Losses"
              variant="outlined"
              size="small"
              fullWidth
              value={stats.losses}
              onChange={handleChange("losses")}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Draws"
              variant="outlined"
              size="small"
              fullWidth
              value={stats.draws}
              onChange={handleChange("draws")}
              disabled={!editMode}
            />
          </Grid>
          {/* Favorite Type */}
          <Grid item xs={12}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="favorite-type-label">
                Favorite Type of Chess
              </InputLabel>
              <Select
                labelId="favorite-type-label"
                id="favorite-type"
                value={stats.favoritetype || ""}
                onChange={(e) =>
                  handleChange("favoritetype")(
                    e as { target: { value: string } }
                  )
                }
                disabled={!editMode}
                label="Favorite Type of Chess"
              >
                <MenuItem value="blitz">Blitz</MenuItem>
                <MenuItem value="bullet">Bullet</MenuItem>
                <MenuItem value="classical">Classical</MenuItem>
                <MenuItem value="rapid">Rapid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {editMode ? (
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="contained" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </Box>
    </Paper>
  );
}
