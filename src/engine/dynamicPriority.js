/**
 * Dynamic Priority Scoring Engine
 * Computes real-time utility weights for each train rather than static rules.
 */
export function calculateDynamicPriority(train, allTrains, isPeakHour = true) {
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
      baseScore = isPeakHour ? 8.2 : 7.0;
      break;
    case 'FREIGHT_COAL':
      baseScore = 5.5;
      break;
    case 'FREIGHT_CONTAINER':
      baseScore = 5.0;
      break;
  }

  // Passenger Count Utility Factor
  const paxWeight = train.passengersCount > 0 ? Math.min(1.5, (train.passengersCount / 1500) * 1.5) : 0;

  // Delay Urgency Factor
  const delayWeight = Math.min(1.8, (train.delayMinutes / 15) * 1.8);

  // Network Unblocking Factor
  let unblockingBonus = 0;
  if ((train.type === 'FREIGHT_COAL' || train.type === 'FREIGHT_CONTAINER') && train.positionKm >= 12.0 && train.positionKm <= 16.0) {
    const trailingFastTrains = allTrains.filter(
      (t) => t.direction === train.direction && t.id !== train.id && t.positionKm < train.positionKm && (t.type === 'VANDE_BHARAT' || t.type === 'RAJDHANI')
    );
    if (trailingFastTrains.length > 0) {
      unblockingBonus = 2.4;
    }
  }

  // Momentum & Energy Penalty
  let momentumWeight = 0;
  if (train.weightTons > 3000 && train.speedKmh > 50) {
    momentumWeight = 0.8;
  }

  const rawScore = baseScore + paxWeight + delayWeight + unblockingBonus + momentumWeight;
  return Number(Math.min(10.0, Math.max(1.0, rawScore)).toFixed(1));
}
