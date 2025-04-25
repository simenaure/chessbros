// src/setLocation.ts

// Base URL of your Express API:
const API_BASE = "http://localhost:3001";

export interface ChessLocation {
  location_id: number;
  longitude: number;
  latitude: number;
  name: string;
  location_type: string;
}

// Fetch all chess spots from the server
export async function fetchChessLocations(): Promise<ChessLocation[]> {
  const res = await fetch(`${API_BASE}/api/chesslocations`);
  if (!res.ok) {
    throw new Error(`Failed to load chess spots (${res.status})`);
  }
  const data = await res.json();
  return data.locations as ChessLocation[];
}

// Create a new chess spot on the server
export async function createChessLocation(
  loc: Omit<ChessLocation, "location_id">
): Promise<ChessLocation> {
  const res = await fetch(`${API_BASE}/api/chesslocations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loc),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || `Failed to save chess spot (${res.status})`);
  }
  const data = await res.json();
  return data.location as ChessLocation;
}
