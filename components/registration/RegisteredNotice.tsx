import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RegisteredNoticeProps {
  /** Called when the visitor dismisses the confirmation */
  onDismiss: () => void;
}

/**
 * Confirmation shown on the start list right after a successful registration
 * (the registration page redirects here with `?registered=1`).
 */
export default function RegisteredNotice({ onDismiss }: RegisteredNoticeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      accessibilityRole="alert"
      style={[styles.container, { borderColor: colors.success }]}
    >
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]}>You&apos;re registered</Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>
          You&apos;re now on the start list below.
        </Text>
      </View>
      <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss">
        <Text style={[styles.dismiss, { color: colors.link }]}>Dismiss</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  text: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  message: { fontSize: 14, marginTop: 2 },
  dismiss: { fontSize: 15, textDecorationLine: "underline" },
});
