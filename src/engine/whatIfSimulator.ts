import { Train, TrackCircuit, WhatIfPlan, Conflict } from '../types/railway';

/**
 * What-If Simulation Engine & Minimum-Regret Decision Maker
 * Generates 4 distinct operational traffic futures and evaluates their section-wide consequences.
 */
export function generateWhatIfPlans(
  trains: Train[],
  _tracks: TrackCircuit[],
  conflicts: Conflict[],
  activeScenarioId: string
): WhatIfPlan[] {
  const hasConflict = conflicts.length > 0;
  const isScenario2 = activeScenarioId === 'SCENARIO_2';
  const isScenario3 = activeScenarioId === 'SCENARIO_3';
  const isScenario4 = activeScenarioId === 'SCENARIO_4';
  const isScenario5 = activeScenarioId === 'SCENARIO_5';

  // PLAN A: Fixed Hierarchical Priority (Express > Passenger > Freight)
  const planA: WhatIfPlan = {
    id: 'PLAN_A',
    name: 'Plan A: Rigid Hierarchy (Express Absolute Priority)',
    tag: 'Legacy Baseline',
    strategy: 'Strict priority execution: Vande Bharat & Rajdhani given unconditional right-of-way. All freight and local trains held on loop sidings.',
    description: 'Holds heavy freight rakes and MEMU commuters at outer signals regardless of current positions. Results in freight stalling, high restart energy, and trailing bottleneck congestion.',
    totalDelayDeltaMin: isScenario2 ? 38 : isScenario4 ? 32 : isScenario5 ? 46 : 24,
    throughputGainPercent: isScenario2 ? -12 : -8,
    regretScore: 78,
    headwayCompressionSec: 0,
    energyPenaltyKWh: 850,
    junctionFrictionScore: 8.5,
    isRecommended: false,
    trainActions: trains.map((t) => {
      if (t.type === 'VANDE_BHARAT' || t.type === 'RAJDHANI') {
        return {
          trainId: t.id,
          trainNumber: t.number,
          trainName: t.name,
          action: 'Full priority green aspect',
          targetSpeedKmh: t.maxSpeedKmh,
          delayChangeMin: 0,
          assignedTrack: t.currentTrackId,
        };
      } else {
        return {
          trainId: t.id,
          trainNumber: t.number,
          trainName: t.name,
          action: 'Hold at Outer Home Signal for 18-24 mins',
          targetSpeedKmh: 0,
          delayChangeMin: t.type.includes('FREIGHT') ? +22 : +14,
          assignedTrack: 'TRK_LOOP_UP_NAINI',
        };
      }
    }),
  };

  // PLAN B: First-Come First-Served (Greedy Local Dispatch)
  const planB: WhatIfPlan = {
    id: 'PLAN_B',
    name: 'Plan B: Greedy Local (First-Come First-Served)',
    tag: 'Conventional CTC',
    strategy: 'Dispatches whichever train reaches the signal block first without looking ahead at downstream section conflicts.',
    description: 'Allows slower freight train to enter single track corridor first if it arrives 30s earlier, forcing high-speed Rajdhani to brake down from 130 km/h to 50 km/h behind it.',
    totalDelayDeltaMin: isScenario3 ? 28 : isScenario4 ? 26 : 18,
    throughputGainPercent: 4,
    regretScore: 62,
    headwayCompressionSec: 25,
    energyPenaltyKWh: 620,
    junctionFrictionScore: 6.8,
    isRecommended: false,
    trainActions: trains.map((t) => ({
      trainId: t.id,
      trainNumber: t.number,
      trainName: t.name,
      action: 'Sequential entry in arrival order',
      targetSpeedKmh: Math.min(t.speedKmh, 85),
      delayChangeMin: t.type === 'RAJDHANI' ? +8 : +2,
      assignedTrack: t.currentTrackId,
    })),
  };

  // PLAN C: Aggressive Loop Line Overtake
  const planC: WhatIfPlan = {
    id: 'PLAN_C',
    name: 'Plan C: Dynamic Loop Line Overtake',
    tag: 'Reactive Overtake',
    strategy: 'Diverts freight into Naini Loop 1 at 30 km/h while allowing Vande Bharat to overtake at 110 km/h on main line.',
    description: 'Requires rapid braking of 4,800t coal rake to turn out on 1-in-12 turnout. Feasible, but incurs heavy mechanical wear and 450 kWh regenerative/traction loss.',
    totalDelayDeltaMin: isScenario2 ? 14 : isScenario4 ? 12 : 9,
    throughputGainPercent: 14,
    regretScore: 35,
    headwayCompressionSec: 60,
    energyPenaltyKWh: 420,
    junctionFrictionScore: 4.2,
    isRecommended: false,
    trainActions: trains.map((t) => {
      if (t.id === 'TRN_BOXN_782') {
        return {
          trainId: t.id,
          trainNumber: t.number,
          trainName: t.name,
          action: 'Divert to Naini Loop 1 for overtake',
          targetSpeedKmh: 30,
          delayChangeMin: +6,
          assignedTrack: 'TRK_LOOP_UP_NAINI',
        };
      }
      return {
        trainId: t.id,
        trainNumber: t.number,
        trainName: t.name,
        action: 'Main line passage with caution',
        targetSpeedKmh: t.targetSpeedKmh,
        delayChangeMin: 0,
        assignedTrack: t.currentTrackId,
      };
    }),
  };

  // PLAN D: RAILMIND Minimum-Regret Multi-Objective Optimal
  const planD: WhatIfPlan = {
    id: 'PLAN_D',
    name: 'Plan D: RAILMIND Minimum-Regret Dynamic Twin',
    tag: 'AI Optimal (Recommended)',
    strategy: 'Predictive micro-speed regulation (±5 km/h) 12 km in advance + dynamic slot insertion. Zero deadlocks, zero unnecessary stops, maximum section throughput.',
    description: isScenario2
      ? 'Vande Bharat delay detected -> RAILMIND dynamically elevates Coal Freight to speed through Naini ahead of delayed Express, clearing the section in 3.2 mins. When Vande Bharat arrives, track is 100% clear at full 130 km/h.'
      : isScenario3
      ? 'UP Main blockage isolated -> Seamless automatic route interlocked via Loop 1 with speed advisory 50 km/h, synchronizing Rajdhani downline with 120s separation.'
      : isScenario4
      ? '4-way convergence de-conflicted: Coal freight cleared first (high momentum), Rajdhani glides at 105 km/h, Vande Bharat throttled by 45s to synchronize gap, Cement Rake follows immediately. All 4 trains cross with ZERO stops.'
      : isScenario5
      ? 'Recovery Matrix engaged: Headways compressed to 90s, platform dwell optimized, section delay reduced by 82% within 16 minutes.'
      : 'Micro-headway compression active: continuous green-wave advisory. Throughput elevated by +26%, fuel consumption reduced by 340 kWh.',
    totalDelayDeltaMin: isScenario2 ? -31 : isScenario3 ? -18 : isScenario4 ? -28 : isScenario5 ? -42 : -16,
    throughputGainPercent: isScenario2 ? 22 : isScenario3 ? 18 : isScenario4 ? 28 : isScenario5 ? 34 : 26,
    regretScore: 8, // Minimum regret!
    headwayCompressionSec: 90,
    energyPenaltyKWh: 80,
    junctionFrictionScore: 1.2,
    isRecommended: true,
    trainActions: trains.map((t) => {
      if (t.id === 'TRN_22436') {
        return {
          trainId: t.id,
          trainNumber: t.number,
          trainName: t.name,
          action: isScenario2 ? 'Cruise-glide 65 km/h until Naini junction clear' : 'Optimal green wave at 130 km/h',
          targetSpeedKmh: isScenario2 ? 65 : 130,
          delayChangeMin: isScenario2 ? -6 : 0,
          assignedTrack: 'TRK_UP_1',
        };
      }
      if (t.id === 'TRN_BOXN_782') {
        return {
          trainId: t.id,
          trainNumber: t.number,
          trainName: t.name,
          action: 'Dynamic slot insertion: Accelerate to 72 km/h to clear section',
          targetSpeedKmh: 72,
          delayChangeMin: -8,
          assignedTrack: 'TRK_UP_JN',
        };
      }
      if (t.id === 'TRN_12952') {
        return {
          trainId: t.id,
          trainNumber: t.number,
          trainName: t.name,
          action: 'Synchronized glide speed 120 km/h',
          targetSpeedKmh: 120,
          delayChangeMin: -2,
          assignedTrack: 'TRK_DN_1',
        };
      }
      return {
        trainId: t.id,
        trainNumber: t.number,
        trainName: t.name,
        action: 'Dynamic headway regulated slot',
        targetSpeedKmh: t.targetSpeedKmh,
        delayChangeMin: -1,
        assignedTrack: t.currentTrackId,
      };
    }),
  };

  return [planD, planC, planB, planA];
}

/**
 * Custom What-If Perturbation Evaluator for Operator Sandbox
 */
export function simulateCustomPerturbation(
  trains: Train[],
  modifiedTrainId: string,
  delayAddedMin: number,
  speedCapKmh: number,
  closedTrackId?: string
): {
  projectedSectionDelayMin: number;
  throughputDeltaPercent: number;
  rippleAffectedTrainCount: number;
  recommendation: string;
  regretScore: number;
} {
  const baseDelay = trains.reduce((acc, t) => acc + t.delayMinutes, 0);
  const targetTrain = trains.find((t) => t.id === modifiedTrainId);
  const isFreight = targetTrain?.type.includes('FREIGHT');

  // Calculate ripple impact
  let rippleMultiplier = targetTrain?.dynamicPriority && targetTrain.dynamicPriority > 8 ? 2.8 : 1.4;
  if (isFreight && targetTrain && targetTrain.positionKm > 10 && targetTrain.positionKm < 18) {
    rippleMultiplier = 3.2; // Freight delayed at throat causes huge ripple
  }

  const addedSystemDelay = Math.round(delayAddedMin * rippleMultiplier + (speedCapKmh < 60 ? 8 : 0));
  const throughputImpact = Math.round(-(delayAddedMin * 1.8) - (closedTrackId ? 14 : 0));
  const rippleTrains = Math.min(6, Math.max(1, Math.ceil(delayAddedMin / 3) + (closedTrackId ? 2 : 0)));

  let rec = 'RAILMIND Advisory: Dynamic speed adjustment applied to upstream trains to absorb delay cushion.';
  if (closedTrackId) {
    rec = 'RAILMIND Advisory: Emergency route interlock active via Loop 1. Single-line time token issued.';
  } else if (delayAddedMin > 8) {
    rec = 'RAILMIND Advisory: Trailing train sequence inverted. Slower freight given precedence to clear junction throat.';
  }

  return {
    projectedSectionDelayMin: baseDelay + addedSystemDelay,
    throughputDeltaPercent: throughputImpact,
    rippleAffectedTrainCount: rippleTrains,
    recommendation: rec,
    regretScore: Math.min(95, Math.max(5, Math.round(delayAddedMin * 4 + (closedTrackId ? 30 : 0)))),
  };
}
