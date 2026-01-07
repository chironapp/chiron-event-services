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
  /**
   * Whether to show the Series option (default: false)
   */
  showSeries?: boolean;
}

/**
 * Reusable toggle switch component for switching between upcoming and results events
 *
 * @example
 * ```tsx
 * <EventsToggle
 *   selectedValue={selectedTab}
 *   onSelectionChange={setSelectedTab}
 *   showSeries={true}
 * />
 * ```
 */
export default function EventsToggle({
  selectedValue,
  onSelectionChange,
  containerStyle,
  showSeries = false,
}: EventsToggleProps) {
  const toggleOptions = React.useMemo(() => {
    const options = [
      { label: "Results", value: "results" },
      { label: "Upcoming", value: "upcoming" },
    ];

    if (showSeries) {
      options.push({ label: "Series", value: "series" });
    }

    return options;
  }, [showSeries]);

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
