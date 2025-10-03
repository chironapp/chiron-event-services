/**
 * Race type constants for database enum values
 * Matches the smallint enum in the database where 1=individual, 2=relay
 */
export const RACE_TYPES = {
  INDIVIDUAL: 1,
  RELAY: 2,
} as const;

/**
 * Human-readable labels for race types
 * Used for UI display and user-facing text
 */
export const RACE_TYPE_LABELS = {
  [RACE_TYPES.INDIVIDUAL]: "Individual",
  [RACE_TYPES.RELAY]: "Relay",
} as const;

/**
 * Array of all race type options for dropdowns/selectors
 * @example
 * ```typescript
 * RACE_TYPE_OPTIONS.map(option => (
 *   <Picker.Item key={option.value} label={option.label} value={option.value} />
 * ))
 * ```
 */
export const RACE_TYPE_OPTIONS = [
  {
    value: RACE_TYPES.INDIVIDUAL,
    label: RACE_TYPE_LABELS[RACE_TYPES.INDIVIDUAL],
  },
  { value: RACE_TYPES.RELAY, label: RACE_TYPE_LABELS[RACE_TYPES.RELAY] },
] as const;

/**
 * Sport type constants for database enum values
 * Matches the ActivityTypeValue enum numbering for consistency
 */
export const SPORT_TYPES = {
  RUN: 1,
  SWIM: 2,
  RIDE: 3,
  STRENGTH: 4,
  WORKOUT: 5,
  WALK: 6,
  ELLIPTICAL: 7,
  DEEP_WATER_RUN: 8,
  YOGA: 9,
  RECOVERY: 10,
  TRIATHLON: 11,
  MULTISPORT: 11, // Same as TRIATHLON
  OTHER: 12,
} as const;

/**
 * Human-readable labels for sport types
 * Used for UI display and user-facing text
 */
export const SPORT_TYPE_LABELS = {
  [SPORT_TYPES.RUN]: "Running",
  [SPORT_TYPES.SWIM]: "Swimming",
  [SPORT_TYPES.RIDE]: "Cycling",
  [SPORT_TYPES.STRENGTH]: "Strength Training",
  [SPORT_TYPES.WORKOUT]: "Workout",
  [SPORT_TYPES.WALK]: "Walking",
  [SPORT_TYPES.ELLIPTICAL]: "Elliptical",
  [SPORT_TYPES.DEEP_WATER_RUN]: "Deep Water Running",
  [SPORT_TYPES.YOGA]: "Yoga",
  [SPORT_TYPES.RECOVERY]: "Recovery",
  [SPORT_TYPES.TRIATHLON]: "Triathlon",
  [SPORT_TYPES.OTHER]: "Other",
} as const;

/**
 * Array of all sport type options for dropdowns/selectors
 * @example
 * ```typescript
 * SPORT_TYPE_OPTIONS.map(option => (
 *   <Picker.Item key={option.value} label={option.label} value={option.value} />
 * ))
 * ```
 */
export const SPORT_TYPE_OPTIONS = [
  { value: SPORT_TYPES.RUN, label: SPORT_TYPE_LABELS[SPORT_TYPES.RUN] },
  { value: SPORT_TYPES.SWIM, label: SPORT_TYPE_LABELS[SPORT_TYPES.SWIM] },
  { value: SPORT_TYPES.RIDE, label: SPORT_TYPE_LABELS[SPORT_TYPES.RIDE] },
  {
    value: SPORT_TYPES.STRENGTH,
    label: SPORT_TYPE_LABELS[SPORT_TYPES.STRENGTH],
  },
  { value: SPORT_TYPES.WORKOUT, label: SPORT_TYPE_LABELS[SPORT_TYPES.WORKOUT] },
  { value: SPORT_TYPES.WALK, label: SPORT_TYPE_LABELS[SPORT_TYPES.WALK] },
  {
    value: SPORT_TYPES.ELLIPTICAL,
    label: SPORT_TYPE_LABELS[SPORT_TYPES.ELLIPTICAL],
  },
  {
    value: SPORT_TYPES.DEEP_WATER_RUN,
    label: SPORT_TYPE_LABELS[SPORT_TYPES.DEEP_WATER_RUN],
  },
  { value: SPORT_TYPES.YOGA, label: SPORT_TYPE_LABELS[SPORT_TYPES.YOGA] },
  {
    value: SPORT_TYPES.RECOVERY,
    label: SPORT_TYPE_LABELS[SPORT_TYPES.RECOVERY],
  },
  {
    value: SPORT_TYPES.TRIATHLON,
    label: SPORT_TYPE_LABELS[SPORT_TYPES.TRIATHLON],
  },
  { value: SPORT_TYPES.OTHER, label: SPORT_TYPE_LABELS[SPORT_TYPES.OTHER] },
] as const;

/**
 * Race status constants for database enum values
 * Comprehensive race lifecycle states from planning to results
 */
export const RACE_STATUSES = {
  DRAFT: "draft",
  PAUSED: "paused",
  REGISTRATION_OPEN: "registration_open",
  REGISTRATION_CLOSED: "registration_closed",
  STARTED: "started",
  COMPLETED: "completed",
  PRELIMINARY_RESULTS: "preliminary_results",
  FINAL_RESULTS: "final_results",
  CANCELLED: "cancelled",
} as const;

/**
 * Human-readable labels for race statuses
 * Used for UI display and user-facing text
 */
export const RACE_STATUS_LABELS = {
  [RACE_STATUSES.DRAFT]: "Draft",
  [RACE_STATUSES.PAUSED]: "Paused",
  [RACE_STATUSES.REGISTRATION_OPEN]: "Registration Open",
  [RACE_STATUSES.REGISTRATION_CLOSED]: "Registration Closed",
  [RACE_STATUSES.STARTED]: "Started",
  [RACE_STATUSES.COMPLETED]: "Completed",
  [RACE_STATUSES.PRELIMINARY_RESULTS]: "Preliminary Results",
  [RACE_STATUSES.FINAL_RESULTS]: "Final Results",
  [RACE_STATUSES.CANCELLED]: "Cancelled",
} as const;

/**
 * Color mappings for race statuses
 * Used for UI display to indicate status visually
 */
export const RACE_STATUS_COLORS = {
  [RACE_STATUSES.DRAFT]: "#757575",
  [RACE_STATUSES.PAUSED]: "#9E9E9E",
  [RACE_STATUSES.REGISTRATION_OPEN]: "#4CAF50",
  [RACE_STATUSES.REGISTRATION_CLOSED]: "#FF9800",
  [RACE_STATUSES.STARTED]: "#2196F3",
  [RACE_STATUSES.COMPLETED]: "#9C27B0",
  [RACE_STATUSES.PRELIMINARY_RESULTS]: "#8E24AA",
  [RACE_STATUSES.FINAL_RESULTS]: "#7B1FA2",
  [RACE_STATUSES.CANCELLED]: "#F44336",
} as const;

/**
 * Array of all race status options for dropdowns/selectors
 * @example
 * ```typescript
 * RACE_STATUS_OPTIONS.map(option => (
 *   <Picker.Item key={option.value} label={option.label} value={option.value} />
 * ))
 * ```
 */
export const RACE_STATUS_OPTIONS = [
  {
    value: RACE_STATUSES.DRAFT,
    label: RACE_STATUS_LABELS[RACE_STATUSES.DRAFT],
  },
  {
    value: RACE_STATUSES.PAUSED,
    label: RACE_STATUS_LABELS[RACE_STATUSES.PAUSED],
  },
  {
    value: RACE_STATUSES.REGISTRATION_OPEN,
    label: RACE_STATUS_LABELS[RACE_STATUSES.REGISTRATION_OPEN],
  },
  {
    value: RACE_STATUSES.REGISTRATION_CLOSED,
    label: RACE_STATUS_LABELS[RACE_STATUSES.REGISTRATION_CLOSED],
  },
  {
    value: RACE_STATUSES.STARTED,
    label: RACE_STATUS_LABELS[RACE_STATUSES.STARTED],
  },
  {
    value: RACE_STATUSES.COMPLETED,
    label: RACE_STATUS_LABELS[RACE_STATUSES.COMPLETED],
  },
  {
    value: RACE_STATUSES.PRELIMINARY_RESULTS,
    label: RACE_STATUS_LABELS[RACE_STATUSES.PRELIMINARY_RESULTS],
  },
  {
    value: RACE_STATUSES.FINAL_RESULTS,
    label: RACE_STATUS_LABELS[RACE_STATUSES.FINAL_RESULTS],
  },
  {
    value: RACE_STATUSES.CANCELLED,
    label: RACE_STATUS_LABELS[RACE_STATUSES.CANCELLED],
  },
] as const;
