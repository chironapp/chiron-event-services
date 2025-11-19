import {
  fetchParticipantById,
  type RaceStartListResultWithEvent,
} from "@/api/results";
import { getResultsCount } from "@/api/results";
import EventTopNav from "@/components/EventTopNav";
import Footer from "@/components/Footer";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatDateTime, formatTime } from "@/utils/dateUtils";
import { capitalizeFirst, getNameWithRaceNumber } from "@/utils/nameUtils";
import {
  formatPositionOfTotal,
  getParticipantStatus,
} from "@/utils/raceUtils";
import {
  isSpecialPosition,
  RACE_POSITION_SPECIAL_DESCRIPTIONS,
} from "@/constants/raceTypes";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Individual participant result screen showing detailed race information
 *
 * @returns {JSX.Element} The individual result page
 */
export default function IndividualResultPage() {
  const { participantId } = useLocalSearchParams<{ participantId: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [participant, setParticipant] =
    useState<RaceStartListResultWithEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number | null>(
    null
  );

  // Fetch participant data on component mount
  useEffect(() => {
    async function loadParticipant() {
      if (!participantId) return;

      try {
        setLoading(true);
        setError(null);

        const participantData = await fetchParticipantById(participantId);

        if (!participantData) {
          setError("Participant not found");
          return;
        }

        setParticipant(participantData);

        // Fetch total participant count for position display
        if (participantData.public_race_event_id) {
          try {
            const count = await getResultsCount(
              participantData.public_race_event_id
            );
            setTotalParticipants(count);
          } catch (err) {
            console.warn("Failed to fetch participant count:", err);
          }
        }
      } catch (err) {
        console.error("Error loading participant data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load participant"
        );
      } finally {
        setLoading(false);
      }
    }

    loadParticipant();
  }, [participantId]);

  // Show loading state while fetching participant
  if (loading && !participant) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Loading...",
          }}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#000000" : "#ffffff" },
          ]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={isDark ? "#ffffff" : "#000000"}
            />
            <Text
              style={[
                styles.loadingText,
                { color: isDark ? "#cccccc" : "#666666" },
              ]}
            >
              Loading participant...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if participant not found or error occurred
  if (error || !participant) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Error",
          }}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#000000" : "#ffffff" },
          ]}
        >
          <View style={styles.errorContainer}>
            <Text
              style={[
                styles.errorText,
                { color: isDark ? "#ff6b6b" : "#d32f2f" },
              ]}
            >
              {error || "Participant not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  const event = participant.public_race_event;
  const participantName = getNameWithRaceNumber(
    participant.first_name,
    participant.last_name,
    participant.race_number
  );
  const status = getParticipantStatus(
    participant,
    event?.race_status || null
  );

  // Determine the finish time to display (net_finish_time100 if available, otherwise finish_time100)
  const displayFinishTime =
    participant.net_finish_time100 || participant.finish_time100;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: participantName || "Participant",
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        {event && (
          <EventTopNav
            eventName={event.title || "Event"}
            eventStartDate={event.race_start_date || ""}
            eventId={participant.public_race_event_id || ""}
          />
        )}

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text
              style={[
                styles.heading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              {participantName}
            </Text>

            {/* Status Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionHeading,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Status
              </Text>
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoValue,
                    { color: isDark ? "#e0e0e0" : "#333333" },
                  ]}
                >
                  {status}
                </Text>
              </View>
              {isSpecialPosition(participant.position) && (
                <Text
                  style={[
                    styles.infoSubtext,
                    { color: isDark ? "#cccccc" : "#666666" },
                  ]}
                >
                  {
                    RACE_POSITION_SPECIAL_DESCRIPTIONS[
                      participant.position as keyof typeof RACE_POSITION_SPECIAL_DESCRIPTIONS
                    ]
                  }
                </Text>
              )}
            </View>

            {/* Category Section */}
            {(participant.sex_category || participant.age_category) && (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeading,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Category
                </Text>
                {participant.sex_category && (
                  <View style={styles.infoRow}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: isDark ? "#cccccc" : "#666666" },
                      ]}
                    >
                      Sex:
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: isDark ? "#e0e0e0" : "#333333" },
                      ]}
                    >
                      {capitalizeFirst(participant.sex_category.name)}
                    </Text>
                  </View>
                )}
                {participant.age_category && (
                  <View style={styles.infoRow}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: isDark ? "#cccccc" : "#666666" },
                      ]}
                    >
                      Age:
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: isDark ? "#e0e0e0" : "#333333" },
                      ]}
                    >
                      {participant.age_category.name}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Team Section */}
            {participant.team && (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeading,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Team
                </Text>
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: isDark ? "#e0e0e0" : "#333333" },
                    ]}
                  >
                    {participant.team.name}
                  </Text>
                </View>
              </View>
            )}

            {/* Position Section */}
            {participant.position &&
              participant.position > 0 &&
              !isSpecialPosition(participant.position) && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Position
                  </Text>
                  <View style={styles.infoRow}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: isDark ? "#cccccc" : "#666666" },
                      ]}
                    >
                      Overall:
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: isDark ? "#e0e0e0" : "#333333" },
                      ]}
                    >
                      {formatPositionOfTotal(
                        participant.position,
                        totalParticipants
                      )}
                    </Text>
                  </View>
                  {participant.sex_category_position && (
                    <View style={styles.infoRow}>
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: isDark ? "#cccccc" : "#666666" },
                        ]}
                      >
                        Sex Category:
                      </Text>
                      <Text
                        style={[
                          styles.infoValue,
                          { color: isDark ? "#e0e0e0" : "#333333" },
                        ]}
                      >
                        {formatPositionOfTotal(
                          participant.sex_category_position,
                          null
                        )}
                      </Text>
                    </View>
                  )}
                  {participant.age_category_position && (
                    <View style={styles.infoRow}>
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: isDark ? "#cccccc" : "#666666" },
                        ]}
                      >
                        Age Category:
                      </Text>
                      <Text
                        style={[
                          styles.infoValue,
                          { color: isDark ? "#e0e0e0" : "#333333" },
                        ]}
                      >
                        {formatPositionOfTotal(
                          participant.age_category_position,
                          null
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              )}

            {/* Times Section */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionHeading,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Times
              </Text>
              {displayFinishTime && (
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: isDark ? "#cccccc" : "#666666" },
                    ]}
                  >
                    Finish Time:
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: isDark ? "#e0e0e0" : "#333333" },
                    ]}
                  >
                    {formatTime(displayFinishTime)}
                  </Text>
                </View>
              )}
              {event?.race_started_at_local && (
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: isDark ? "#cccccc" : "#666666" },
                    ]}
                  >
                    Gun Started At:
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: isDark ? "#e0e0e0" : "#333333" },
                    ]}
                  >
                    {formatDateTime(event.race_started_at_local)}
                  </Text>
                </View>
              )}
              {participant.net_started_at_local && (
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: isDark ? "#cccccc" : "#666666" },
                    ]}
                  >
                    Net Started At:
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: isDark ? "#e0e0e0" : "#333333" },
                    ]}
                  >
                    {formatDateTime(participant.net_started_at_local)}
                  </Text>
                </View>
              )}
              {participant.finished_at_local && (
                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: isDark ? "#cccccc" : "#666666" },
                    ]}
                  >
                    Finished At:
                  </Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: isDark ? "#e0e0e0" : "#333333" },
                    ]}
                  >
                    {formatDateTime(participant.finished_at_local)}
                  </Text>
                </View>
              )}
            </View>

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
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    minWidth: 140,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  infoSubtext: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: "italic",
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
