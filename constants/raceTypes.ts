import type { AgeCategory, Sex } from "@/types/race";

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

/**
 * Age category definitions based on race_athlete_categories table
 * Age is calculated as of 31st December in the year of competition
 */
export const AGE_CATEGORIES: Record<Sex, AgeCategory[]> = {
  female: [
    {
      id: 4,
      name: "F U18",
      description:
        "Female of 17 years or younger on 31st December in the year of the competition",
      sex: "female",
      minAge: 0,
      maxAge: 17,
    },
    {
      id: 5,
      name: "F U20",
      description:
        "Female of 18 or 19 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 18,
      maxAge: 19,
    },
    {
      id: 6,
      name: "F 20-24",
      description:
        "Female of 20 to 24 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 20,
      maxAge: 24,
    },
    {
      id: 7,
      name: "F 25-29",
      description:
        "Female of 25 to 29 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 25,
      maxAge: 29,
    },
    {
      id: 8,
      name: "F 30-34",
      description:
        "Female of 30 to 34 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 30,
      maxAge: 34,
    },
    {
      id: 9,
      name: "F 35-39",
      description:
        "Female of 35 to 39 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 35,
      maxAge: 39,
    },
    {
      id: 10,
      name: "F 40-44",
      description:
        "Female of 40 to 44 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 40,
      maxAge: 44,
    },
    {
      id: 11,
      name: "F 45-49",
      description:
        "Female of 45 to 49 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 45,
      maxAge: 49,
    },
    {
      id: 12,
      name: "F 50-54",
      description:
        "Female of 50 to 54 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 50,
      maxAge: 54,
    },
    {
      id: 13,
      name: "F 55-59",
      description:
        "Female of 55 to 59 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 55,
      maxAge: 59,
    },
    {
      id: 14,
      name: "F 60-64",
      description:
        "Female of 60 to 64 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 60,
      maxAge: 64,
    },
    {
      id: 15,
      name: "F 65-69",
      description:
        "Female of 65 to 69 years on 31st December in the year of the competition",
      sex: "female",
      minAge: 65,
      maxAge: 69,
    },
    {
      id: 16,
      name: "F 70+",
      description:
        "Female of 70 years or older on 31st December in the year of the competition",
      sex: "female",
      minAge: 70,
      maxAge: null,
    },
  ],
  male: [
    {
      id: 17,
      name: "M U18",
      description:
        "Male of 17 years or younger on 31st December in the year of the competition",
      sex: "male",
      minAge: 0,
      maxAge: 17,
    },
    {
      id: 18,
      name: "M U20",
      description:
        "Male of 18 or 19 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 18,
      maxAge: 19,
    },
    {
      id: 19,
      name: "M 20-24",
      description:
        "Male of 20 to 24 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 20,
      maxAge: 24,
    },
    {
      id: 20,
      name: "M 25-29",
      description:
        "Male of 25 to 29 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 25,
      maxAge: 29,
    },
    {
      id: 21,
      name: "M 30-34",
      description:
        "Male of 30 to 34 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 30,
      maxAge: 34,
    },
    {
      id: 22,
      name: "M 35-39",
      description:
        "Male of 35 to 39 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 35,
      maxAge: 39,
    },
    {
      id: 23,
      name: "M 40-44",
      description:
        "Male of 40 to 44 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 40,
      maxAge: 44,
    },
    {
      id: 24,
      name: "M 45-49",
      description:
        "Male of 45 to 49 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 45,
      maxAge: 49,
    },
    {
      id: 25,
      name: "M 50-54",
      description:
        "Male of 50 to 54 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 50,
      maxAge: 54,
    },
    {
      id: 26,
      name: "M 55-59",
      description:
        "Male of 55 to 59 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 55,
      maxAge: 59,
    },
    {
      id: 27,
      name: "M 60-64",
      description:
        "Male of 60 to 64 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 60,
      maxAge: 64,
    },
    {
      id: 28,
      name: "M 65-69",
      description:
        "Male of 65 to 69 years on 31st December in the year of the competition",
      sex: "male",
      minAge: 65,
      maxAge: 69,
    },
    {
      id: 29,
      name: "M 70+",
      description:
        "Male of 70 years or older on 31st December in the year of the competition",
      sex: "male",
      minAge: 70,
      maxAge: null,
    },
  ],
  other: [
    {
      id: 30,
      name: "Other",
      description: "Non-binary athlete of any age",
      sex: "other",
      minAge: 0,
      maxAge: null,
    },
  ],
};

/**
 * Flattened array of all age categories for easy lookup
 */
export const ALL_AGE_CATEGORIES = Object.values(AGE_CATEGORIES).flat();

/**
 * Map of category ID to category for quick lookups
 */
export const AGE_CATEGORY_MAP = ALL_AGE_CATEGORIES.reduce((map, category) => {
  map[category.id] = category;
  return map;
}, {} as Record<number, AgeCategory>);
