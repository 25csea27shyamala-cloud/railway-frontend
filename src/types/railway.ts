export type TrainType = 
  | 'VANDE_BHARAT' 
  | 'RAJDHANI' 
  | 'EXPRESS' 
  | 'MEMU' 
  | 'FREIGHT_COAL' 
  | 'FREIGHT_CONTAINER';

export type SignalAspect = 'GREEN' | 'DOUBLE_YELLOW' | 'YELLOW' | 'RED';

export type TrackType = 
  | 'MAIN_UP' 
  | 'MAIN_DOWN' 
  | 'LOOP_UP' 
  | 'LOOP_DOWN' 
  | 'BRANCH_LINE' 
  | 'CROSSOVER_1' 
  | 'CROSSOVER_2';

export interface Train {
  id: string;
  number: string;
  name: string;
  type: TrainType;
  basePriority: number; // 1 (highest) to 5
  dynamicPriority: number; // dynamically computed utility score
  direction: 'UP' | 'DOWN'; // UP = Station A to B, DOWN = Station B to A
  lengthMeters: number;
  weightTons: number;
  speedKmh: number;
  maxSpeedKmh: number;
  advisorySpeedKmh: number;
  targetSpeedKmh: number;
  currentTrackId: string;
  positionKm: number; // kilometer mark along section (0 to 35 km)
  originStation: string;
  destinationStation: string;
  scheduledArrival: string;
  actualArrival: string;
  delayMinutes: number;
  passengersCount: number;
  cargoTonnage: number;
  kavachStatus: 'ACTIVE' | 'STANDBY' | 'INTERVENING';
  powerType: '25kV_AC_ELECTRIC' | 'DIESEL_WDP4D';
  energyKWh: number;
  brakingDistanceM: number;
  status: 'CRUISING' | 'DECELERATING' | 'HELD_AT_SIGNAL' | 'ACCELERATING' | 'DIVERTED_TO_LOOP';
  conflictRiskPercent: number;
  driverAdvisory: string;
  color: string;
}

export interface TrackCircuit {
  id: string;
  name: string;
  type: TrackType;
  startKm: number;
  endKm: number;
  speedLimitKmh: number;
  isBlocked: boolean;
  blockageReason?: string;
  occupiedByTrainId: string | null;
  state: 'CLEAR' | 'OCCUPIED' | 'RESERVED_AI' | 'CONFLICT_WARNING';
  gradientPermille: number; // slope (e.g. +2 for uphill, -1 for downhill)
}

export interface Signal {
  id: string;
  name: string;
  trackId: string;
  direction: 'UP' | 'DOWN';
  positionKm: number;
  aspect: SignalAspect;
  mode: 'AUTO_AI' | 'MANUAL_OVERRIDE';
  nextSignalDistanceM: number;
}

export interface SwitchPoint {
  id: string;
  name: string;
  positionKm: number;
  state: 'NORMAL' | 'REVERSE';
  isLocked: boolean;
  normalRouteTrackId: string;
  reverseRouteTrackId: string;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  km: number;
  platforms: {
    number: number;
    trackId: string;
    occupiedByTrainId: string | null;
    lengthM: number;
  }[];
}

export interface Conflict {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  trainIds: string[];
  trainNames: string[];
  location: string;
  km: number;
  timeToConflictSec: number;
  probabilityPercent: number;
  recommendedPlanId: 'PLAN_A' | 'PLAN_B' | 'PLAN_C' | 'PLAN_D';
  description: string;
  impactIfIgnored: string;
}

export interface WhatIfPlan {
  id: 'PLAN_A' | 'PLAN_B' | 'PLAN_C' | 'PLAN_D';
  name: string;
  tag: string;
  strategy: string;
  description: string;
  totalDelayDeltaMin: number;
  throughputGainPercent: number;
  regretScore: number; // lower is better (0-100)
  headwayCompressionSec: number;
  energyPenaltyKWh: number;
  junctionFrictionScore: number; // 0-10
  isRecommended: boolean;
  trainActions: {
    trainId: string;
    trainNumber: string;
    trainName: string;
    action: string;
    targetSpeedKmh: number;
    delayChangeMin: number;
    assignedTrack: string;
  }[];
}

export interface SectionMetrics {
  lineCapacityUtilizationPercent: number; // e.g. 92%
  sectionThroughputTph: number; // Trains per hour
  averageSectionSpeedKmh: number;
  totalSectionDelayMin: number;
  headwayCompressionSec: number; // Headway margin compressed safely
  punctualityIndexPercent: number;
  tractionEnergySavedKWh: number;
  co2EmissionsOffsetKg: number;
  activeConflictsCount: number;
  traditionalBenchmark: {
    throughputTph: number;
    totalDelayMin: number;
    averageSpeedKmh: number;
    capacityUtilizationPercent: number;
  };
}

export interface ControllerLog {
  id: string;
  timestamp: string;
  type: 'AI_ADVISORY' | 'CONFLICT_PREDICTED' | 'ROUTE_INTERLOCKED' | 'KAVACH_HEARTBEAT' | 'SCENARIO_LOADED' | 'MANUAL_DISPATCH';
  title: string;
  details: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  difficulty: 'Normal' | 'High' | 'Severe' | 'Critical';
  expectedAIBehavior: string;
  initialTrains: Partial<Train>[];
  initialTracks?: Partial<TrackCircuit>[];
}

export type WeatherMode = 'CLEAR' | 'MONSOON' | 'FOG_NORTH_INDIAN' | 'NIGHT_STARRY';
