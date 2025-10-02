import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleSwitchProps {
  /**
   * Array of toggle options
   */
  options: ToggleOption[];
  /**
   * Currently selected value
   */
  selectedValue: string;
  /**
   * Callback when selection changes
   */
  onSelectionChange: (value: string) => void;
  /**
   * Additional styles for the container
   */
  containerStyle?: any;
}

/**
 * Reusable toggle switch component for selecting between options
 *
 * @example
 * ```tsx
 * <ToggleSwitch
 *   options={[
 *     { label: "Results", value: "results" },
 *     { label: "Upcoming", value: "upcoming" }
 *   ]}
 *   selectedValue={selectedTab}
 *   onSelectionChange={setSelectedTab}
 * />
 * ```
 */
export default function ToggleSwitch({
  options,
  selectedValue,
  onSelectionChange,
  containerStyle,
}: ToggleSwitchProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.toggleContainer,
          {
            backgroundColor: isDark
              ? Colors.dark.toggleBackground
              : Colors.light.toggleBackground,
            borderColor: isDark
              ? Colors.dark.toggleBorder
              : Colors.light.toggleBorder,
          },
        ]}
      >
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.toggleOption,
                {
                  backgroundColor: isSelected
                    ? isDark
                      ? Colors.dark.toggleSelected
                      : Colors.light.toggleSelected
                    : "transparent",
                },
                isFirst && styles.firstOption,
                isLast && styles.lastOption,
              ]}
              onPress={() => onSelectionChange(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${option.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: isSelected
                      ? isDark
                        ? Colors.dark.toggleSelectedText
                        : Colors.light.toggleSelectedText
                      : isDark
                      ? Colors.dark.toggleUnselectedText
                      : Colors.light.toggleUnselectedText,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  firstOption: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  lastOption: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
