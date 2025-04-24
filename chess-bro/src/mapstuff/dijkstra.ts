import { Heap } from "heap-js";
import L from "leaflet";

export type UserNode = {
  username: string;
  latitude: number;
  longitude: number;
  elo: number;
};

export type Graph = Record<string, { [neighbor: string]: number }>;

/**
 * Fetch all user locations from backend.
 */
export async function fetchUsers(): Promise<UserNode[]> {
  const res = await fetch("http://localhost:3001/api/users/locations");
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }
  const data = await res.json();
  return data.locations;
}

/**
 * Fetch distance matrix from ORS with dynamic transport type.
 */
export async function fetchDistanceMatrix(
  users: UserNode[],
  apiKey: string,
  profile: "driving-car" | "foot-walking"
): Promise<number[][]> {
  const locations = users.map((u) => [u.longitude, u.latitude]);

  const res = await fetch(
    `https://api.openrouteservice.org/v2/matrix/${profile}`,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations,
        metrics: ["distance"],
        units: "km",
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`ORS matrix error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.distances) {
    throw new Error("ORS matrix response missing distances");
  }

  return data.distances;
}

/**
 * Build graph from matrix.
 */
export function buildGraph(users: UserNode[], distances: number[][]): Graph {
  const graph: Graph = {};
  users.forEach((user, i) => {
    graph[user.username] = {};
    users.forEach((other, j) => {
      if (i !== j) {
        graph[user.username][other.username] = distances[i][j];
      }
    });
  });
  return graph;
}

/**
 * Dijkstra's shortest path algorithm.
 */
export function dijkstra(graph: Graph, start: string): Record<string, number> {
  const dist: Record<string, number> = {};
  const visited = new Set<string>();
  const heap = new Heap<{ node: string; cost: number }>(
    (a, b) => a.cost - b.cost
  );

  Object.keys(graph).forEach((node) => (dist[node] = Infinity));
  dist[start] = 0;
  heap.push({ node: start, cost: 0 });

  while (!heap.isEmpty()) {
    const { node, cost } = heap.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);

    for (const neighbor in graph[node]) {
      const newCost = cost + graph[node][neighbor];
      if (newCost < dist[neighbor]) {
        dist[neighbor] = newCost;
        heap.push({ node: neighbor, cost: newCost });
      }
    }
  }

  return dist;
}

/**
 * Fetch a line between two points from ORS (supports walk/car).
 */
export async function fetchRoutePolyline(
  from: [number, number],
  to: [number, number],
  apiKey: string,
  profile: "driving-car" | "foot-walking"
): Promise<L.Polyline | null> {
  const res = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [from, to],
      }),
    }
  );

  if (!res.ok) {
    console.error(`ORS route error: ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const coords = data?.features?.[0]?.geometry?.coordinates;

  if (!coords || !Array.isArray(coords)) {
    console.error("Invalid route geometry from ORS");
    return null;
  }

  const latlngs: [number, number][] = coords.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );
  return L.polyline(latlngs, {
    color: profile === "foot-walking" ? "green" : "blue",
    weight: 4,
  });
}
