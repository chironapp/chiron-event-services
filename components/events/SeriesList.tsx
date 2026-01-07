import NoResultsFound from "@/components/ui/NoResultsFound";
import SeriesCard from "@/components/ui/SeriesCard";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PublicRaceEventSeries } from "@/types/race";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface SeriesListProps {
  /**
   * Array of series to display
   */
  series: PublicRaceEventSeries[];
  /**
   * Whether the series are currently loading
   */
  loading: boolean;
  /**
   * Error message if loading failed
   */
  error: string | null;
  /**
   * Search query for empty state message
   */
  searchQuery?: string;
}

/**
 * Component for displaying a list of race series
 *
 * @example
 * ```tsx
 * <SeriesList
 *   series={seriesData}
 *   loading={false}
 *   error={null}
 *   searchQuery=""
 * />
 * ```
 */
export default function SeriesList({
  series,
  loading,
  error,
  searchQuery = "",
}: SeriesListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  // Show error state
  if (error) {
    return <NoResultsFound title="Error Loading Series" message={error} />;
  }

  // Show empty state
  if (series.length === 0) {
    return (
      <NoResultsFound
        title={searchQuery ? "No Series Found" : "No Series Available"}
        message={
          searchQuery
            ? `No series match "${searchQuery}"`
            : "This organiser doesn't have any series yet."
        }
      />
    );
  }

  // Render series list
  return (
    <View style={styles.container}>
      {series.map((seriesItem) => (
        <SeriesCard key={seriesItem.id} series={seriesItem} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
