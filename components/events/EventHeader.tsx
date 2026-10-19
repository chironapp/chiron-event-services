import RaceStatusBadge from "@/components/ui/RaceStatusBadge";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatEventDate } from "@/utils/dateUtils";
import { getRegistrationTarget } from "@/utils/registrationUtils";
import { Link } from "expo-router";
import React from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EventHeaderProps {
  event: {
    id: string;
    title: string | null;
    race_start_date: string | null;
    race_status: string | null;
    location: string | null;
    description: string | null;
    registration_url: string | null;
    /** none | custom | chiron: where the "Register Now" button goes */
    registration_mode: string;
    public_race_event_series?: {
      id: string;
      title: string | null;
    } | null;
  };
}

/**
 * Reusable event header component displaying event title, date, location, description, and registration button.
 * The button only shows while registration is open and follows the event's registration option: the hosted
 * Chiron registration page, or the organiser's own link (http(s) only).
 */
export default function EventHeader({ event }: EventHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const registrationTarget = getRegistrationTarget(event);

  return (
    <>
      <Text style={[styles.heading, { color: colors.text }]}>
        {event.title}
      </Text>

      <View style={styles.dateLocationRow}>
        <Text style={[styles.dateLocationText, { color: colors.subText }]}>
          {formatEventDate(event.race_start_date)}
        </Text>
        <RaceStatusBadge raceStatus={event.race_status} />
      </View>

      {event.location && (
        <Text style={[styles.dateLocationText, { color: colors.subText }]}>
          {event.location}
        </Text>
      )}

      {event.public_race_event_series && (
        <View style={styles.seriesRow}>
          <Link href={`/series/${event.public_race_event_series.id}`} asChild>
            <Pressable>
              <Text style={[styles.seriesLink, { color: colors.link }]}>
                {event.public_race_event_series.title}
              </Text>
            </Pressable>
          </Link>
        </View>
      )}

      {event.description && (
        <Text style={[styles.description, { color: colors.secondaryText }]}>
          {event.description}
        </Text>
      )}

      {registrationTarget?.kind === "internal" && (
        <Link href={registrationTarget.href} asChild>
          <Pressable
            accessibilityRole="link"
            // A single flat style object: Link's asChild passes the style on to the
            // DOM element, which cannot take an array
            style={StyleSheet.flatten([
              styles.registrationButton,
              { backgroundColor: colors.success },
            ])}
          >
            <Text style={styles.registrationButtonText}>Register Now</Text>
          </Pressable>
        </Link>
      )}

      {registrationTarget?.kind === "external" && (
        <TouchableOpacity
          style={[
            styles.registrationButton,
            { backgroundColor: colors.success },
          ]}
          onPress={() => Linking.openURL(registrationTarget.url)}
        >
          <Text style={styles.registrationButtonText}>Register Now</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  dateLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dateLocationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  seriesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  seriesLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  seriesLink: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  registrationButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  registrationButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
