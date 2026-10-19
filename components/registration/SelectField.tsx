import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SelectFieldProps {
  /** Visible label above the field */
  label: string;
  /** Selected value, or "" for none */
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  /** Shown as the unselected option */
  placeholder: string;
  /** Validation message shown under the field */
  error?: string;
}

/**
 * Labelled dropdown for the registration form (web only, like CategoryFilter,
 * using a native select so mobile browsers show their own picker).
 */
export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: SelectFieldProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <select
        aria-label={label}
        aria-invalid={!!error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...styles.select,
          backgroundColor: colors.background,
          borderColor: error ? colors.error : colors.border,
          color: colors.text,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {!!error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  select: {
    width: "100%",
    height: 48,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cursor: "pointer",
  },
  error: {
    fontSize: 13,
    marginTop: 4,
  },
});
