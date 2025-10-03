import Footer from "@/components/Footer";
import { SearchInput } from "@/components/input";
import TopNav from "@/components/TopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import OrganiserCard from "@/components/ui/OrganiserCard";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOrganisers } from "../hooks/useOrganisers";
import type { Organiser } from "../lib/supabase";

/**
 * Organisers page component for browsing race organisers
 *
 * @returns {JSX.Element} The organisers page with search and pagination
 */
export default function OrganisersPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: organisers,
    loading,
    error,
    pagination,
    params,
    refresh,
    nextPage,
    previousPage,
    setSearch,
    setSorting,
  } = useOrganisers({
    limit: 12, // Show 12 organisers per page
    sortBy: "name",
    sortOrder: "asc",
  });

  /**
   * Handle search submission
   */
  const handleSearchSubmit = () => {
    setSearch(searchQuery.trim());
  };

  /**
   * Handle search clear
   */
  const handleSearchClear = () => {
    setSearchQuery("");
    setSearch("");
  };

  /**
   * Toggle sort order
   */
  const handleSortToggle = () => {
    const newOrder = params.sortOrder === "asc" ? "desc" : "asc";
    setSorting("name", newOrder);
  };

  /**
   * Render individual organiser card
   */
  const renderOrganiserCard = ({ item }: { item: Organiser }) => (
    <OrganiserCard organiser={item} />
  );

  /**
   * Render pagination controls
   */
  const renderPaginationControls = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          !pagination.hasPreviousPage && styles.disabledButton,
          { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
        ]}
        onPress={previousPage}
        disabled={!pagination.hasPreviousPage}
      >
        <Text
          style={[
            styles.paginationButtonText,
            { color: isDark ? "#ffffff" : "#000000" },
            !pagination.hasPreviousPage && styles.disabledText,
          ]}
        >
          ← Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.paginationInfo}>
        <Text
          style={[
            styles.paginationText,
            { color: isDark ? "#cccccc" : "#666666" },
          ]}
        >
          Page {pagination.page} of {pagination.totalPages}
        </Text>
        <Text
          style={[
            styles.paginationText,
            { color: isDark ? "#cccccc" : "#666666" },
          ]}
        >
          {pagination.count} total organisers
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.paginationButton,
          !pagination.hasNextPage && styles.disabledButton,
          { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
        ]}
        onPress={nextPage}
        disabled={!pagination.hasNextPage}
      >
        <Text
          style={[
            styles.paginationButtonText,
            { color: isDark ? "#ffffff" : "#000000" },
            !pagination.hasNextPage && styles.disabledText,
          ]}
        >
          Next →
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={isDark ? "#007AFF" : "#0066CC"}
        />
      ) : (
        <>
          <Text
            style={[
              styles.emptyTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            {error ? "Unable to load organisers" : "No organisers found"}
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
          >
            {error
              ? "Please check your connection and try again"
              : params.search
              ? "Try adjusting your search terms"
              : "No race organisers are currently available"}
          </Text>
          {error && (
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Race Organisers",
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        <TopNav />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text
              style={[
                styles.heading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Race Organisers
            </Text>

            <SearchInput
              placeholder="Search organisers by name or description..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              containerStyle={styles.searchContainer}
            />

            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                ]}
                onPress={handleSortToggle}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Sort by Name {params.sortOrder === "asc" ? "↑" : "↓"}
                </Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.resultsText,
                  { color: isDark ? "#cccccc" : "#666666" },
                ]}
              >
                {loading
                  ? "Loading..."
                  : `${organisers.length} of ${pagination.count} results`}
              </Text>

              {params.search && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleSearchClear}
                >
                  <Text style={styles.clearButtonText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              Browse race organisers who create and manage endurance events
              through the Chiron platform. Find events from your favorite
              organisers or discover new race experiences.
            </Text>

            {organisers.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <FlatList
                  data={organisers}
                  renderItem={renderOrganiserCard}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  style={styles.grid}
                  scrollEnabled={false}
                  refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} />
                  }
                />

                {pagination.totalPages > 1 && renderPaginationControls()}
              </>
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
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  searchContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultsText: {
    fontSize: 14,
    flex: 1,
    textAlign: "center",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FF6B6B",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  grid: {
    marginBottom: 32,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationButtonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  disabledText: {
    color: "#999999",
  },
  paginationInfo: {
    alignItems: "center",
    flex: 1,
  },
  paginationText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
