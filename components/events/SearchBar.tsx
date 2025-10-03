import { SearchInput } from "@/components/input";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

interface SearchBarProps {
  /**
   * The current search query value
   */
  value: string;
  /**
   * Callback when the search query changes
   */
  onChangeText: (text: string) => void;
  /**
   * Optional placeholder text
   */
  placeholder?: string;
  /**
   * Optional container style
   */
  containerStyle?: ViewStyle;
}

/**
 * Reusable search bar component for filtering events
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search events..."
 * />
 * ```
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Enter event name, location, or type...",
  containerStyle,
}: SearchBarProps) {
  return (
    <SearchInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      containerStyle={[styles.searchContainer, containerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});
