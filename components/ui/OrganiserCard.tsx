import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Organiser } from "@/lib/supabase";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

interface OrganiserCardProps {
  /**
   * The organiser data to display
   */
  organiser: Organiser;
}

/**
 * Reusable organiser card component for displaying organiser information
 *
 * @example
 * ```tsx
 * <OrganiserCard organiser={organiserData} />
 * ```
 */
export default function OrganiserCard({ organiser }: OrganiserCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Link href={`/organisers/${organiser.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.organiserCard,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            borderColor: isDark ? "#333333" : "#e0e0e0",
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={styles.organiserHeader}>
          <Text
            style={[
              styles.organiserName,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
            numberOfLines={2}
          >
            {organiser.name}
          </Text>
        </View>

        {organiser.description && (
          <Text
            style={[
              styles.organiserDescription,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
            numberOfLines={3}
          >
            {organiser.description}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  organiserCard: {
    flex: 0.48,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  organiserHeader: {
    marginBottom: 12,
  },
  organiserName: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22,
  },
  organiserDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});
