import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Organiser } from "@/lib/supabase";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface OrganiserCardProps {
  /**
   * The organiser data to display
   */
  organiser: Organiser;
  /**
   * Fill the full row width (single-column layout) instead of half the row
   */
  fullWidth?: boolean;
}

/**
 * Reusable organiser card component for displaying organiser information
 *
 * @remarks
 * By default the card takes ~half the row for a two-column FlatList; pass
 * `fullWidth` for the single-column layout. Layout and card styles live on the
 * wrapper View and an inner View, as the Link component with asChild prop
 * doesn't reliably propagate styles to the Pressable.
 *
 * @example
 * ```tsx
 * <OrganiserCard organiser={organiserData} />
 * ```
 */
export default function OrganiserCard({
  organiser,
  fullWidth = false,
}: OrganiserCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View style={[styles.cardWrapper, fullWidth && styles.cardWrapperFull]}>
      <Link href={`/organisers/${organiser.id}`} asChild>
        <Pressable style={styles.pressable}>
          {({ pressed }) => (
            <View
              style={[
                styles.organiserCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={styles.organiserHeader}>
                <Text
                  style={[styles.organiserName, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {organiser.name}
                </Text>
              </View>

              {organiser.description && (
                <Text
                  style={[
                    styles.organiserDescription,
                    { color: colors.subText },
                  ]}
                  numberOfLines={3}
                >
                  {organiser.description}
                </Text>
              )}
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "48.5%",
    marginBottom: 20,
  },
  pressable: {
    flex: 1,
  },
  cardWrapperFull: {
    width: "100%",
  },
  organiserCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
