/**
 * Centralized sex/gender category constants and utilities
 * Single source of truth for all sex-related logic in the application
 */

/**
 * Sex category ID constants used throughout the application
 * These IDs match the database schema and are used for:
 * - User profiles (users.sex)
 * - Race participants (race_start_list_results.sex_category_id)
 * - Age category classification
 */
export const SEX_CATEGORY_IDS = {
  FEMALE: 1,
  MALE: 2,
  OTHER: 3,
} as const;

/**
 * Type for sex category ID values
 */
export type SexCategoryId =
  (typeof SEX_CATEGORY_IDS)[keyof typeof SEX_CATEGORY_IDS];

/**
 * Human-readable labels for sex categories
 * Used for UI display, form labels, and user-facing text
 */
export const SEX_CATEGORY_LABELS = {
  [SEX_CATEGORY_IDS.FEMALE]: "Female",
  [SEX_CATEGORY_IDS.MALE]: "Male",
  [SEX_CATEGORY_IDS.OTHER]: "Other/prefer not to set",
} as const;

/**
 * Short labels for sex categories (used in compact displays)
 */
export const SEX_CATEGORY_SHORT_LABELS = {
  [SEX_CATEGORY_IDS.FEMALE]: "Female",
  [SEX_CATEGORY_IDS.MALE]: "Male",
  [SEX_CATEGORY_IDS.OTHER]: "Other",
} as const;

/**
 * Array of sex category options for pickers and dropdowns
 * @example
 * ```typescript
 * SEX_CATEGORY_OPTIONS.map(option => (
 *   <RadioButton.Item
 *     key={option.value}
 *     label={option.label}
 *     value={option.value.toString()}
 *   />
 * ))
 * ```
 */
export const SEX_CATEGORY_OPTIONS = [
  {
    value: SEX_CATEGORY_IDS.FEMALE,
    label: SEX_CATEGORY_LABELS[SEX_CATEGORY_IDS.FEMALE],
  },
  {
    value: SEX_CATEGORY_IDS.MALE,
    label: SEX_CATEGORY_LABELS[SEX_CATEGORY_IDS.MALE],
  },
  {
    value: SEX_CATEGORY_IDS.OTHER,
    label: SEX_CATEGORY_LABELS[SEX_CATEGORY_IDS.OTHER],
  },
] as const;

/**
 * Gets the human-readable label for a sex category ID
 *
 * @param sex - The sex category ID (1=Female, 2=Male, 3=Other)
 * @returns The human-readable label for the sex category
 *
 * @example
 * ```typescript
 * getSexLabel(1) // returns "Female"
 * getSexLabel(2) // returns "Male"
 * getSexLabel(3) // returns "Other/prefer not to set"
 * getSexLabel(99) // returns "Unknown"
 * getSexLabel(null) // returns "Unknown"
 * ```
 */
export const getSexLabel = (sex: number | null | undefined): string => {
  if (sex === null || sex === undefined) {
    return "Unknown";
  }

  switch (sex) {
    case SEX_CATEGORY_IDS.FEMALE:
      return SEX_CATEGORY_LABELS[SEX_CATEGORY_IDS.FEMALE];
    case SEX_CATEGORY_IDS.MALE:
      return SEX_CATEGORY_LABELS[SEX_CATEGORY_IDS.MALE];
    case SEX_CATEGORY_IDS.OTHER:
      return SEX_CATEGORY_LABELS[SEX_CATEGORY_IDS.OTHER];
    default:
      return "Unknown";
  }
};

/**
 * Gets the short label for a sex category ID (used in compact displays)
 *
 * @param sex - The sex category ID (1=Female, 2=Male, 3=Other)
 * @returns The short label for the sex category
 *
 * @example
 * ```typescript
 * getSexShortLabel(1) // returns "Female"
 * getSexShortLabel(2) // returns "Male"
 * getSexShortLabel(3) // returns "Other"
 * getSexShortLabel(99) // returns "Unknown"
 * ```
 */
export const getSexShortLabel = (sex: number | null | undefined): string => {
  if (sex === null || sex === undefined) {
    return "Unknown";
  }

  switch (sex) {
    case SEX_CATEGORY_IDS.FEMALE:
      return SEX_CATEGORY_SHORT_LABELS[SEX_CATEGORY_IDS.FEMALE];
    case SEX_CATEGORY_IDS.MALE:
      return SEX_CATEGORY_SHORT_LABELS[SEX_CATEGORY_IDS.MALE];
    case SEX_CATEGORY_IDS.OTHER:
      return SEX_CATEGORY_SHORT_LABELS[SEX_CATEGORY_IDS.OTHER];
    default:
      return "Unknown";
  }
};

/**
 * Type guard to check if a value is a valid sex category ID
 *
 * @param value - The value to check
 * @returns True if the value is a valid sex category ID
 *
 * @example
 * ```typescript
 * if (isValidSexCategoryId(userInput)) {
 *   // userInput is now typed as SexCategoryId
 *   console.log(getSexLabel(userInput));
 * }
 * ```
 */
export const isValidSexCategoryId = (value: any): value is SexCategoryId => {
  return Object.values(SEX_CATEGORY_IDS).includes(value);
};
