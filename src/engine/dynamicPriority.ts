import { Train } from '../types/railway';

/**
 * Dynamic Priority Scoring Engine
 * Computes real-time utility weights for each train rather than static rules.
 * Considers passenger density, downstream track clearance value, cascading delay penalty, and cargo economic urgency.
 */
export function calculateDynamicPriority(
  train: Train,
  allTrains: Train[],
  isPeakHour: boolean = true
): number {
  // Base weights based on train category
  let baseScore = 5.0;
  switch (train.type) {
    case 'VANDE_BHARAT':
      baseScore = 9.5;
      break;
    case 'RAJDHANI':
      baseScore = 9.0;
      break;
    case 'EXPRESS':
      baseScore = 8.0;
      break;
    case 'MEMU':
      // During peak commuter hours, suburban MEMU density gets elevated protection
      baseScore = isPeakHour ? 8.2 : 7.0;
      break;
    case 'FREIGHT_COAL':
      baseScore = 5.5;
      break;
    case 'FREIGHT_CONTAINER':
      baseScore = 5.0;
      break;
  }

  // 1. Passenger Count Utility Factor (Up to +1.5 pts)
  const paxWeight = train.passengersCount > 0 ? Math.min(1.5, (train.passengersCount / 1500) * 1.5) : 0;

  // 2. Delay Urgency Factor (Up to +1.8 pts)
  // If a train is already delayed, its marginal recovery importance increases to avoid cascading miss of connections
  const delayWeight = Math.min(1.8, (train.delayMinutes / 15) * 1.8);

  // 3. Network Unblocking Factor (Critical RAILMIND Innovation!)
  // If a heavy freight train is currently sitting at a critical junction bottleneck,
  // elevating its priority to clear the throat section unlocks downstream lines for all faster trains.
  let unblockingBonus = 0;
  if ((train.type === 'FREIGHT_COAL' || train.type === 'FREIGHT_CONTAINER') && train.positionKm >= 12.0 && train.positionKm <= 16.0) {
    // Check if there are faster trains trailing behind
    const trailingFastTrains = allTrains.filter(
      (t) => t.direction === train.direction && t.id !== train.id && t.positionKm < train.positionKm && (t.type === 'VANDE_BHARAT' || t.type === 'RAJDHANI')
    );
    if (trailingFastTrains.length > 0) {
      unblockingBonus = 2.4; // Boost freight priority to get it through the junction immediately!
    }
  }

  // 4. Momentum & Energy Penalty (Heavy 4500t rakes take 12 mins to restart if stopped)
  let momentumWeight = 0;
  if (train.weightTons > 3000 && train.speedKmh > 50) {
    momentumWeight = 0.8; // Prevent unnecessary stoppage of heavy moving freight
  }

  const rawScore = baseScore + paxWeight + delayWeight + unblockingBonus + momentumWeight;
  return Number(Math.min(10.0, Math.max(1.0, rawScore)).toFixed(1));
}
