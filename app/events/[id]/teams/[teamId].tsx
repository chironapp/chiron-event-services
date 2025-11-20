import {
  fetchTeamById,
  fetchTeamMembers,
  getTeamsCount,
  type RaceStartListResultWithCategories,
  type RaceTeamWithEvent,
} from "@/api/results";
import EventTopNav from "@/components/EventTopNav";
import Footer from "@/components/Footer";
import { StartListResultsTable } from "@/components/results/StartListResultsTable";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatDateTime, formatTime } from "@/utils/dateUtils";
import { formatPositionOfTotal, getTeamStatus } from "@/utils/raceUtils";
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
 * Team result screen showing detailed team race information
 *
 * @returns {JSX.Element} The team result page
 */
export default function TeamResultPage() {
  const { teamId, id: eventId } = useLocalSearchParams<{
    teamId: string;
    id: string;
  }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const [team, setTeam] = useState<RaceTeamWithEvent | null>(null);
  const [teamMembers, setTeamMembers] = useState<
    RaceStartListResultWithCategories[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeams, setTotalTeams] = useState<number | null>(null);

  // Fetch team data on component mount
  useEffect(() => {
    async function loadTeam() {
      if (!teamId) return;

      try {
        setLoading(true);
        setError(null);

        const teamData = await fetchTeamById(teamId);

        if (!teamData) {
          setError("Team not found");
          return;
        }

        setTeam(teamData);

        // Fetch team members
        const members = await fetchTeamMembers(teamId);
        setTeamMembers(members);

        // Fetch total team count for position display
        if (teamData.public_race_event_id) {
          try {
            const count = await getTeamsCount(teamData.public_race_event_id);
            setTotalTeams(count);
          } catch (err) {
            console.warn("Failed to fetch team count:", err);
          }
        }
      } catch (err) {
        console.error("Error loading team data:", err);
        setError(err instanceof Error ? err.message : "Failed to load team");
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, [teamId]);

  // Show loading state while fetching team
  if (loading && !team) {
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
              Loading team...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if team not found or error occurred
  if (error || !team) {
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
              {error || "Team not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  const event = team.public_race_event;
  const status = getTeamStatus(team, teamMembers, event?.race_status || null);

  // Calculate started_at and finished_at based on team members
  const startedAt = teamMembers.find(
    (m) => m.finished_at_local
  )?.finished_at_local;
  const finishedAt =
    teamMembers.length > 0
      ? teamMembers
          .filter((m) => m.finished_at_local)
          .sort(
            (a, b) =>
              new Date(b.finished_at_local!).getTime() -
              new Date(a.finished_at_local!).getTime()
          )[0]?.finished_at_local
      : null;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: team.name || "Team",
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {event && (
          <EventTopNav
            eventName={event.title || "Event"}
            eventStartDate={event.race_start_date || ""}
            eventId={eventId}
          />
        )}

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text style={[styles.heading, { color: colors.text }]}>
              {team.name}
            </Text>

            {/* Status Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>
                Status
              </Text>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoValue, { color: colors.secondaryText }]}
                >
                  {status}
                </Text>
              </View>
            </View>

            {/* Position Section */}
            {team.position && team.position > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>
                  Position
                </Text>
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoValue, { color: colors.secondaryText }]}
                  >
                    {formatPositionOfTotal(team.position, totalTeams)}
                  </Text>
                </View>
              </View>
            )}

            {/* Times Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>
                Times
              </Text>
              {team.finish_time100 && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.subText }]}>
                    Finish Time:
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.secondaryText }]}
                  >
                    {formatTime(team.finish_time100)}
                  </Text>
                </View>
              )}
              {startedAt && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.subText }]}>
                    Started At:
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.secondaryText }]}
                  >
                    {formatDateTime(startedAt)}
                  </Text>
                </View>
              )}
              {finishedAt && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.subText }]}>
                    Finished At:
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.secondaryText }]}
                  >
                    {formatDateTime(finishedAt)}
                  </Text>
                </View>
              )}
            </View>

            {/* Team Members Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>
                Team Members
              </Text>
              <Text style={[styles.resultsCount, { color: colors.subText }]}>
                {teamMembers.length}{" "}
                {teamMembers.length === 1 ? "team member" : "team members"}
              </Text>
              {teamMembers.length > 0 && eventId && (
                <StartListResultsTable
                  eventId={eventId}
                  results={teamMembers}
                  isUpcoming={false}
                  isDark={isDark}
                  showTeamOrder={true}
                  isRelay={true}
                />
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
  resultsCount: {
    fontSize: 14,
    marginBottom: 8,
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
