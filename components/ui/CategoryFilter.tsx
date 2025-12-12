import { AGE_CATEGORIES } from "@/constants/raceTypes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CategoryFilterProps {
  /**
   * Currently selected category value
   */
  selectedValue: string;
  /**
   * Callback when selection changes
   */
  onSelectionChange: (value: string) => void;
}

// Build options list with Overall, sex categories, then age categories
const getCategoryOptions = () => {
  const options = [
    { value: "overall", label: "Overall" },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" },
  ];

  // Add age categories grouped by sex
  Object.entries(AGE_CATEGORIES).forEach(([sex, categories]) => {
    categories.forEach((category) => {
      options.push({
        value: `age_${category.id}`,
        label: category.name,
      });
    });
  });

  return options;
};

const CATEGORY_OPTIONS = getCategoryOptions();

/**
 * Category filter dropdown component for filtering results by category
 *
 * @example
 * ```tsx
 * <CategoryFilter
 *   selectedValue={selectedCategory}
 *   onSelectionChange={handleCategoryChange}
 * />
 * ```
 */
export default function CategoryFilter({
  selectedValue,
  onSelectionChange,
}: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <select
        value={selectedValue}
        onChange={(e) => onSelectionChange(e.target.value)}
        style={{
          ...styles.select,
          backgroundColor: isDark ? "#1a1a1a" : "#f8f8f8",
          borderColor: isDark ? "#333333" : "#e0e0e0",
          color: isDark ? "#ffffff" : "#000000",
        }}
      >
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  select: {
    width: "100%",
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: "400",
    outline: "none",
    cursor: "pointer",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
    // Keep dropdown arrow visible
    backgroundPosition: "right 12px center",
    backgroundSize: "12px",
  },
});
