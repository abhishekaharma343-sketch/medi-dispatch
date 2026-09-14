import { Ambulance, EmergencyRequest, RecommendationScore } from '../types/dispatch';
import { calculateDistanceKm, calculateEtaMinutes } from './distance';

export function calculateAmbulanceRecommendations(
  incident: EmergencyRequest,
  ambulances: Ambulance[]
): RecommendationScore[] {
  const scored: RecommendationScore[] = ambulances.map((amb) => {
    const distanceKm = calculateDistanceKm(
      amb.latitude,
      amb.longitude,
      incident.latitude,
      incident.longitude
    );
    const etaMinutes = calculateEtaMinutes(distanceKm);
    const reasons: string[] = [];

    // 1. Availability Score (0 - 35 pts)
    let availabilityScore = 0;
    if (amb.status === 'AVAILABLE') {
      availabilityScore = 35;
      reasons.push('Unit is active and immediately available');
    } else if (amb.status === 'TRANSPORTING') {
      // In hospital transit, might clear soon
      availabilityScore = 15;
      reasons.push('Currently finishing hospital transit, available soon');
    } else if (amb.status === 'ASSIGNED' || amb.status === 'EN_ROUTE' || amb.status === 'AT_INCIDENT') {
      availabilityScore = 5;
      reasons.push('Unit is actively assigned to another mission');
    } else {
      availabilityScore = 0;
      reasons.push('Unit is offline / undergoing maintenance');
    }

    // 2. Distance / Proximity Score (0 - 35 pts)
    // Closest units get maximum proximity points
    let distanceScore = 0;
    if (distanceKm <= 2.0) {
      distanceScore = 35;
      reasons.push(`Very close proximity (${distanceKm} km, ~${etaMinutes}m ETA)`);
    } else if (distanceKm <= 4.0) {
      distanceScore = 28;
      reasons.push(`Close response radius (${distanceKm} km)`);
    } else if (distanceKm <= 7.0) {
      distanceScore = 20;
      reasons.push(`Moderate transit distance (${distanceKm} km)`);
    } else if (distanceKm <= 12.0) {
      distanceScore = 10;
      reasons.push(`Extended transit distance (${distanceKm} km)`);
    } else {
      distanceScore = 3;
      reasons.push(`Far response zone (${distanceKm} km)`);
    }

    // 3. Ambulance Type & Capability Match (0 - 20 pts)
    let typeMatchScore = 0;
    const reqType = incident.requiredAmbulanceType;
    const ambType = amb.type;

    if (reqType === ambType) {
      typeMatchScore = 20;
      reasons.push(`Exact equipment match: ${ambType}`);
    } else if (
      (reqType === 'BLS' && (ambType === 'ALS' || ambType === 'MICU')) ||
      (reqType === 'ALS' && ambType === 'MICU')
    ) {
      typeMatchScore = 18;
      reasons.push(`Higher tier capability available: ${ambType} exceeds ${reqType} spec`);
    } else if (reqType === 'MICU' && ambType === 'ALS') {
      typeMatchScore = 12;
      reasons.push(`ALS can handle severe critical care if MICU unavailable`);
    } else {
      typeMatchScore = 5;
      reasons.push(`Unit type ${ambType} does not meet optimal ${reqType} level`);
    }

    // 4. Critical Readiness & Crew (0 - 10 pts)
    let readinessScore = 0;
    if (amb.fuelLevel >= 70) {
      readinessScore += 5;
    } else if (amb.fuelLevel >= 40) {
      readinessScore += 3;
    }

    if (amb.medicalCrew.length >= 2) {
      readinessScore += 5;
      reasons.push(`Full dual-paramedic/EMT crew on board`);
    } else {
      readinessScore += 2;
    }

    const overallScore = Math.min(100, Math.round(availabilityScore + distanceScore + typeMatchScore + readinessScore));

    return {
      ambulance: amb,
      distanceKm,
      etaMinutes,
      typeMatchScore,
      availabilityScore,
      overallScore,
      isRecommended: false,
      reasons,
    };
  });

  // Sort descending by score, prioritizing AVAILABLE first, then distance
  scored.sort((a, b) => {
    // Available units strictly prioritized over busy units
    if (a.ambulance.status === 'AVAILABLE' && b.ambulance.status !== 'AVAILABLE') return -1;
    if (b.ambulance.status === 'AVAILABLE' && a.ambulance.status !== 'AVAILABLE') return 1;
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  // Mark the top available unit as recommended
  const topAvailable = scored.find((s) => s.ambulance.status === 'AVAILABLE') || scored[0];
  if (topAvailable) {
    topAvailable.isRecommended = true;
  }

  return scored;
}
