export interface Player {
  username: string;
  latitude: number;
  longitude: number;
  elo: number;
}

export interface SuitabilityOptions {
  maxDistanceKm: number;
  targetElo: number;
  eloTolerance: number;
  weights?: {
    distance?: number;
    elo?: number;
  };
}

export function distanceScore(
  user: Player,
  candidate: Player,
  maxDistanceKm: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(candidate.latitude - user.latitude);
  const dLon = toRad(candidate.longitude - user.longitude);
  const lat1 = toRad(user.latitude);
  const lat2 = toRad(candidate.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;

  if (dist >= maxDistanceKm) return 0;
  return 1 - dist / maxDistanceKm;
}

export function eloScore(
  candidateElo: number,
  targetElo: number,
  tolerance: number
): number {
  const diff = Math.abs(candidateElo - targetElo);
  if (diff >= tolerance) return 0;
  return 1 - diff / tolerance;
}

export function computeSuitability(
  user: Player,
  candidate: Player,
  options: SuitabilityOptions
): number {
  const {
    maxDistanceKm,
    targetElo,
    eloTolerance,
    weights = { distance: 1, elo: 1 },
  } = options;

  const dScore = distanceScore(user, candidate, maxDistanceKm);
  const eScore = eloScore(candidate.elo, targetElo, eloTolerance);

  const totalWeight = weights.distance! + weights.elo!;
  const weightedSum = weights.distance! * dScore + weights.elo! * eScore;

  return weightedSum / totalWeight;
}
