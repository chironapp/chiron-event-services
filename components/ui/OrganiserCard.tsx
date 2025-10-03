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
 * @remarks
 * This component is designed to work within a FlatList with numColumns={2}.
 * The wrapper View with flex: 0.48 ensures proper sizing in the grid layout,
 * as the Link component with asChild prop doesn't properly propagate flex
 * properties to the Pressable.
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
    <View style={styles.cardWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 0.48,
  },
  organiserCard: {
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
