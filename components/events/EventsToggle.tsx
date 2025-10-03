import { ToggleSwitch } from "@/components/input";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

interface EventsToggleProps {
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
  { label: "Results", value: "results" },
  { label: "Upcoming", value: "upcoming" },
];

/**
 * Reusable toggle switch component for switching between upcoming and results events
 *
 * @example
 * ```tsx
 * <EventsToggle
 *   selectedValue={selectedTab}
 *   onSelectionChange={setSelectedTab}
 * />
 * ```
 */
export default function EventsToggle({
  selectedValue,
  onSelectionChange,
  containerStyle,
}: EventsToggleProps) {
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
