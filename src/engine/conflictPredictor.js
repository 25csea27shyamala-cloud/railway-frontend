/**
 * 15-Minute Lookahead Spatial-Temporal Conflict Predictor
 */
export function predictConflicts(trains, tracks) {
  const conflicts = [];

  // 1. Junction Convergence Conflict
  const junctionTrains = trains.filter((t) => {
    const distToJunction = t.direction === 'UP' ? 15.0 - t.positionKm : t.positionKm - 15.0;
    const timeToJunctionSec = t.speedKmh > 0 ? (distToJunction / (t.speedKmh / 3.6)) : 9999;
    return distToJunction >= -1.0 && distToJunction <= 6.0 && timeToJunctionSec > 0 && timeToJunctionSec < 600;
  });

  if (junctionTrains.length >= 2) {
    const arrivals = junctionTrains.map((t) => {
      const dist = t.direction === 'UP' ? 15.0 - t.positionKm : t.positionKm - 15.0;
      const timeSec = t.speedKmh > 5 ? (dist / (t.speedKmh / 3.6)) : 120;
      return { train: t, etaSec: Math.max(10, Math.round(timeSec)) };
    });

    arrivals.sort((a, b) => a.etaSec - b.etaSec);

    for (let i = 0; i < arrivals.length - 1; i++) {
      const t1 = arrivals[i];
      const t2 = arrivals[i + 1];
      const timeDelta = Math.abs(t1.etaSec - t2.etaSec);

      if (timeDelta < 110) {
        const isSevere = junctionTrains.length >= 3;
        conflicts.push({
          id: `CONF_JN_${t1.train.number}_${t2.train.number}`,
          severity: isSevere ? 'CRITICAL' : 'HIGH',
          trainIds: [t1.train.id, t2.train.id],
          trainNames: [t1.train.name, t2.train.name],
          location: 'Naini Diamond Junction (Km 15.0)',
          km: 15.0,
          timeToConflictSec: Math.min(t1.etaSec, t2.etaSec),
          probabilityPercent: Math.min(96, Math.max(65, Math.round(100 - timeDelta * 0.4))),
          recommendedPlanId: 'PLAN_D',
          description: `Simultaneous convergence predicted between ${t1.train.name} (#${t1.train.number}) and ${t2.train.name} (#${t2.train.number}) at Naini Junction throat within ${Math.round(t1.etaSec / 60)} minutes.`,
          impactIfIgnored: `Without intervention, trailing train will encounter RED signal S-07, forcing 4,800-ton brake application and incurring 18+ min cascading section delay.`
        });
      }
    }
  }

  // 2. Trailing Catch-up Headway Conflict
  const upTrains = trains.filter((t) => t.direction === 'UP').sort((a, b) => b.positionKm - a.positionKm);
  for (let i = 0; i < upTrains.length - 1; i++) {
    const leader = upTrains[i];
    const follower = upTrains[i + 1];
    const gapKm = leader.positionKm - follower.positionKm;

    if (follower.speedKmh > leader.speedKmh + 20 && gapKm < 5.0) {
      const closingSpeedKmh = follower.speedKmh - leader.speedKmh;
      const timeToClosingSec = Math.round((gapKm / (closingSpeedKmh / 3.6)));

      if (timeToClosingSec < 360) {
        conflicts.push({
          id: `CONF_HDW_${follower.number}_${leader.number}`,
          severity: 'HIGH',
          trainIds: [follower.id, leader.id],
          trainNames: [follower.name, leader.name],
          location: `Auto Block UP (Km ${follower.positionKm.toFixed(1)})`,
          km: follower.positionKm,
          timeToConflictSec: timeToClosingSec,
          probabilityPercent: 88,
          recommendedPlanId: 'PLAN_D',
          description: `${follower.name} (#${follower.number}) approaching leader ${leader.name} (#${leader.number}) at delta speed +${Math.round(closingSpeedKmh)} km/h. Headway closing in ${Math.round(timeToClosingSec / 60)} min.`,
          impactIfIgnored: `${follower.name} will encounter Double Yellow & Yellow signals, resulting in heavy deceleration and 9 min delay penalty.`
        });
      }
    }
  }

  // 3. Track Blockage Conflict
  tracks.filter((trk) => trk.isBlocked).forEach((blockedTrack) => {
    trains.filter((t) => t.currentTrackId === blockedTrack.id || (t.direction === 'UP' && t.positionKm < blockedTrack.startKm && blockedTrack.type.includes('UP'))).forEach((affectedTrain) => {
      conflicts.push({
        id: `CONF_BLK_${affectedTrain.number}_${blockedTrack.id}`,
        severity: 'CRITICAL',
        trainIds: [affectedTrain.id],
        trainNames: [affectedTrain.name],
        location: `${blockedTrack.name} (Km ${blockedTrack.startKm.toFixed(1)})`,
        km: blockedTrack.startKm,
        timeToConflictSec: 120,
        probabilityPercent: 100,
        recommendedPlanId: 'PLAN_D',
        description: `Track ${blockedTrack.name} is BLOCKED due to: ${blockedTrack.blockageReason || 'Emergency Maintenance'}. Direct routing impossible.`,
        impactIfIgnored: `Train ${affectedTrain.name} will be stranded at Home Signal S-07 indefinitely until clearance.`
      });
    });
  });

  return conflicts;
}
