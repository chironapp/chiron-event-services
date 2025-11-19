import { ToggleSwitch } from "@/components/input";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

interface ResultsToggleProps {
  /**
   * The currently selected tab value
   */
  selectedValue: string;
  /**
   * Callback when the selection changes
   */
  onSelectionChange: (value: string) => void;
  /**
   * Optional container style
   */
  containerStyle?: ViewStyle;
}

const toggleOptions = [
  { label: "Individuals", value: "individuals" },
  { label: "Teams", value: "teams" },
];

/**
 * Reusable toggle switch component for switching between individual and team results
 *
 * @example
 * ```tsx
 * <ResultsToggle
 *   selectedValue={selectedTab}
 *   onSelectionChange={setSelectedTab}
 * />
 * ```
 */
export default function ResultsToggle({
  selectedValue,
  onSelectionChange,
  containerStyle,
}: ResultsToggleProps) {
  return (
    <ToggleSwitch
      options={toggleOptions}
      selectedValue={selectedValue}
      onSelectionChange={onSelectionChange}
      containerStyle={[styles.toggleContainer, containerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    marginBottom: 24,
  },
});
