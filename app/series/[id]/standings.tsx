import {
  fetchPublicRaceEventSeries,
  fetchSeriesStandings,
  type SeriesStandingsResult,
} from "@/api/raceSeriesPublic";
import { SearchBar } from "@/components/events";
import Footer from "@/components/Footer";
import SeriesTopNav from "@/components/SeriesTopNav";
import CategoryFilter from "@/components/ui/CategoryFilter";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import NoResultsFound from "@/components/ui/NoResultsFound";
import SectionHeading from "@/components/ui/SectionHeading";
import { Head } from "@/components/utils/Head";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PublicRaceEventSeries } from "@/types/race";
import { capitalizeFirst } from "@/utils/nameUtils";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

/**
 * Format points for display, handling null values
 */
function formatPoints(points: number | null): string {
  if (points === null || points === undefined) return "-";
  return points.toFixed(1);
}

/**
 * Series standings page component showing full standings for a series
 *
 * @returns {JSX.Element} The series standings page
 */
export default function SeriesStandingsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("overall");
  const [series, setSeries] = useState<PublicRaceEventSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [standings, setStandings] = useState<SeriesStandingsResult[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsPage, setStandingsPage] = useState(0);
  const [standingsCount, setStandingsCount] = useState(0);
  const [hasMoreStandings, setHasMoreStandings] = useState(false);

  // Fetch series on component mount
  useEffect(() => {
    async function loadSeries() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const seriesData = await fetchPublicRaceEventSeries(id);

        if (!seriesData) {
          setError("Series not found");
          return;
        }

        setSeries(seriesData);
      } catch (err) {
        console.error("Error loading series data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadSeries();
  }, [id]);

  // Fetch standings when series is loaded or filters change
  useEffect(() => {
    async function loadStandings() {
      if (!id || !series) return;

      try {
        setStandingsLoading(true);

        const sexCategoryId =
          selectedCategory === "female"
            ? 1
            : selectedCategory === "male"
            ? 2
            : selectedCategory === "other"
            ? 3
            : undefined;

        const standingsData = await fetchSeriesStandings(
          id,
          standingsPage,
          50,
          searchQuery,
          sexCategoryId,
          "rank",
          "asc"
        );

        setStandings(standingsData.data);
        setStandingsCount(standingsData.count);
        setHasMoreStandings(standingsData.hasMore);
      } catch (err) {
        console.error("Error loading standings:", err);
        setStandings([]);
        setStandingsCount(0);
      } finally {
        setStandingsLoading(false);
      }
    }

    loadStandings();
  }, [id, series, searchQuery, standingsPage, selectedCategory]);

  // Show loading state while fetching series
  if (loading && !series) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Loading...",
          }}
        />
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
            <Text style={[styles.loadingText, { color: colors.subText }]}>
              Loading series...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if series not found or error occurred
  if (error || !series) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Error",
          }}
        />
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error || "Series not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setStandingsPage(0); // Reset to first page when category changes
  };

  // Calculate responsive widths
  const containerMaxWidth = Math.min(width - 32, 1000);
  const showCategory = containerMaxWidth > 600;

  // Column widths
  const rankWidth = 90;
  const pointsWidth = 100;
  const categoryWidth = showCategory ? 100 : 0;
  const fixedWidths = rankWidth + pointsWidth + categoryWidth;
  const nameWidth = containerMaxWidth - fixedWidths;

  const borderColor = colors.border;
  const headerBg = colors.tableHeader;
  const textColor = colors.text;
  const subTextColor = colors.subText;

  return (
    <>
      <Head
        title={`${series.title} Standings – Chiron Event Services`}
        description={`View standings for ${series.title}`}
        ogTitle={`${series.title} Standings`}
        ogDescription={`View standings for ${series.title}`}
        twitterTitle={`${series.title} Standings`}
        twitterDescription={`View standings for ${series.title}`}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: `${series.title} Standings`,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SeriesTopNav seriesName={series.title ?? ""} seriesId={id} />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <SectionHeading>Series Standings</SectionHeading>

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by athlete name"
            />

            <CategoryFilter
              selectedValue={selectedCategory}
              onSelectionChange={handleCategoryChange}
            />

            {standingsLoading ? (
              <View style={styles.standingsLoadingContainer}>
                <ActivityIndicator size="small" color={colors.text} />
                <Text
                  style={[
                    styles.standingsLoadingText,
                    { color: colors.subText },
                  ]}
                >
                  Loading standings...
                </Text>
              </View>
            ) : standingsCount > 0 ? (
              <>
                <Text
                  style={[styles.standingsCount, { color: colors.subText }]}
                >
                  {standingsCount} {standingsCount === 1 ? "entry" : "entries"}
                </Text>

                <View
                  style={[
                    styles.tableContainer,
                    { maxWidth: containerMaxWidth },
                  ]}
                >
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.table}>
                      {/* Table Header */}
                      <View
                        style={[
                          styles.headerRow,
                          { backgroundColor: headerBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.headerCell,
                            { color: textColor, borderColor, width: rankWidth },
                          ]}
                        >
                          Rank
                        </Text>
                        <Text
                          style={[
                            styles.headerCell,
                            { color: textColor, borderColor, width: nameWidth },
                          ]}
                        >
                          Name
                        </Text>
                        <Text
                          style={[
                            styles.headerCell,
                            {
                              color: textColor,
                              borderColor,
                              width: pointsWidth,
                            },
                          ]}
                        >
                          Points
                        </Text>
                        {showCategory && (
                          <Text
                            style={[
                              styles.headerCell,
                              {
                                color: textColor,
                                borderColor,
                                width: categoryWidth,
                              },
                            ]}
                          >
                            Category
                          </Text>
                        )}
                      </View>

                      {/* Table Body */}
                      {standings.map((standing, index) => (
                        <View
                          key={standing.id}
                          style={[
                            styles.row,
                            index % 2 === 1 && {
                              backgroundColor: colors.tableRowAlt,
                            },
                          ]}
                        >
                          {/* Rank */}
                          <View
                            style={[
                              styles.cell,
                              { borderColor, width: rankWidth },
                            ]}
                          >
                            <Text
                              style={[styles.centerText, { color: textColor }]}
                            >
                              {standing.rank ?? "-"}
                            </Text>
                          </View>

                          {/* Name */}
                          <View
                            style={[
                              styles.cell,
                              { borderColor, width: nameWidth },
                            ]}
                          >
                            <Link
                              href={`/series/${id}/standings/${standing.series_participant_id}`}
                              asChild
                            >
                              <Pressable>
                                <Text
                                  style={[
                                    styles.nameText,
                                    styles.linkText,
                                    { color: colors.link },
                                  ]}
                                >
                                  {standing.first_name} {standing.last_name}
                                </Text>
                              </Pressable>
                            </Link>
                          </View>

                          {/* Points */}
                          <View
                            style={[
                              styles.cell,
                              { borderColor, width: pointsWidth },
                            ]}
                          >
                            <Text
                              style={[styles.centerText, { color: textColor }]}
                            >
                              {formatPoints(standing.total_points)}
                            </Text>
                          </View>

                          {/* Category (when enabled) */}
                          {showCategory && (
                            <View
                              style={[
                                styles.cell,
                                { borderColor, width: categoryWidth },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.categoryText,
                                  { color: subTextColor },
                                ]}
                              >
                                {capitalizeFirst(
                                  standing.sex_category_name || ""
                                ) || "-"}
                              </Text>
                              {standing.age_category_name && (
                                <Text
                                  style={[
                                    styles.categoryText,
                                    { color: subTextColor },
                                  ]}
                                >
                                  {standing.age_category_name}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {hasMoreStandings && (
                  <TouchableOpacity
                    style={[
                      styles.loadMoreButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setStandingsPage(standingsPage + 1)}
                  >
                    <Text style={styles.loadMoreButtonText}>Load More</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <NoResultsFound
                title={
                  searchQuery
                    ? "No Standings Found"
                    : selectedCategory !== "overall"
                    ? "No Standings in This Category"
                    : "Standings Not Yet Available"
                }
                message={
                  searchQuery
                    ? `No entries match "${searchQuery}"`
                    : selectedCategory !== "overall"
                    ? `No standings found for the selected category. Try selecting "Overall" to see all standings.`
                    : "Standings will be available once events in this series are completed."
                }
              />
            )}

            <Footer />
          </MaxWidthContainer>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  standingsLoadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  standingsLoadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  standingsCount: {
    fontSize: 14,
    marginBottom: 8,
  },
  tableContainer: {
    marginVertical: 16,
    width: "100%",
    alignSelf: "center",
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
    minWidth: "100%",
  },
  headerRow: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  headerCell: {
    padding: 12,
    fontWeight: "600",
    fontSize: 14,
    borderBottomWidth: 2,
    borderRightWidth: 1,
  },
  cell: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  centerText: {
    textAlign: "center",
  },
  nameText: {
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 16,
  },
  loadMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  loadMoreButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
});
