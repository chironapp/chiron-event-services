import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PublicRaceEventSeries } from "@/types/race";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SeriesInfoProps {
  /**
   * The series data to display
   */
  series: PublicRaceEventSeries;
}

/**
 * Component for displaying series information including title, website, and description
 *
 * @example
 * ```tsx
 * <SeriesInfo series={seriesData} />
 * ```
 */
export default function SeriesInfo({ series }: SeriesInfoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const handleWebsitePress = () => {
    if (series.series_url) {
      Linking.openURL(series.series_url);
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <Text style={[styles.seriesTitle, { color: colors.text }]}>
        {series.title}
      </Text>

      {series.series_url && (
        <TouchableOpacity
          onPress={handleWebsitePress}
          style={styles.websiteContainer}
        >
          <Text style={[styles.websiteLink, { color: colors.link }]}>
            {series.series_url}
          </Text>
        </TouchableOpacity>
      )}

      {series.description && (
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {series.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  seriesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  websiteContainer: {
    marginBottom: 12,
  },
  websiteLink: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
