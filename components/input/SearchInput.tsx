import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface SearchInputProps extends Omit<TextInputProps, "style"> {
  /**
   * Label text to display above the input
   */
  label?: string;
  /**
   * Additional styles for the container
   */
  containerStyle?: any;
  /**
   * Additional styles for the input
   */
  inputStyle?: any;
}

/**
 * Reusable search text input component with theme support
 *
 * @example
 * ```tsx
 * <SearchInput
 *   label="Search Events"
 *   placeholder="Enter event name or location..."
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 * />
 * ```
 */
export default function SearchInput({
  label,
  containerStyle,
  inputStyle,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: isDark ? "#ffffff" : "#000000" }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#f8f8f8",
            borderColor: isDark ? "#333333" : "#e0e0e0",
            color: isDark ? "#ffffff" : "#000000",
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#888888" : "#666666"}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
