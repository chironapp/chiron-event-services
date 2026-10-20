import { fetchEventById, type RaceEventWithOrganiser } from "@/api/events";
import EventTopNav from "@/components/EventTopNav";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";
import ContactOrganiserLink from "@/components/registration/ContactOrganiserLink";
import EventNotFound from "@/components/registration/EventNotFound";
import RegistrationForm from "@/components/registration/RegistrationForm";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { Head } from "@/components/utils/Head";
import {
  REGISTRATION_ACTION_BACKGROUND,
  REGISTRATION_ON_FILL,
} from "@/constants/registrationColors";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import {
  getRegistrationAvailability,
  isHttpUrl,
  REGISTRATION_ERROR_MESSAGES,
} from "@/utils/registrationUtils";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Public registration page for a race event, at /events/{id}/register.
 *
 * Shows the form only while the event's registration option is the Chiron page
 * and its status is registration open; otherwise a short explanation with the
 * organiser's contact link. The server makes the same decision again on submit.
 * On success it sends the visitor to the event's start list.
 *
 * @returns {JSX.Element} The registration page
 */
export default function EventRegistrationPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  const [event, setEvent] = useState<RaceEventWithOrganiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  // Bumped to load the event again, eg after the server says registration is no
  // longer possible so the page shows the event's current state
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        const eventData = await fetchEventById(id);
        if (!eventData) {
          setEvent(null);
          setNotFound(true);
          return;
        }
        setEvent(eventData);
      } catch (err) {
        console.error("Error loading event data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id, reloadKey]);

  // Every state of this page, including loading and errors, stays out of search
  const screenOptions = (
    <>
      <Head title="Register – Chiron Event Services" robots="noindex" />
      <Stack.Screen options={{ headerShown: false, title: "Register" }} />
    </>
  );

  if (loading && !event) {
    return (
      <>
        {screenOptions}
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.text} />
            <Text style={[styles.message, { color: colors.subText }]}>
              Loading event...
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (notFound || (!event && !error)) {
    return (
      <>
        {screenOptions}
        <EventNotFound />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        {screenOptions}
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <TopNav />
          <View style={styles.centered}>
            <Text style={[styles.title, { color: colors.text }]}>
              {error || "Something went wrong"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  const availability = getRegistrationAvailability(event);
  const contact = event.organisers?.public_contact ?? null;
  const title = event.title || "Event";

  const startListLink = (
    <Link href={`/events/${event.id}`} asChild>
      <Pressable accessibilityRole="link">
        <Text style={[styles.link, { color: colors.link }]}>View the start list</Text>
      </Pressable>
    </Link>
  );

  let body: React.ReactNode;
  if (availability === "open") {
    body = (
      <RegistrationForm
        event={event}
        contact={contact}
        siteKey={process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY}
        onRegistered={(eventId) => router.replace(`/events/${eventId}?registered=1`)}
        onUnavailable={() => setReloadKey((key) => key + 1)}
      />
    );
  } else if (availability === "closed") {
    body = (
      <>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Registration is closed
        </Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>
          {REGISTRATION_ERROR_MESSAGES.registration_closed}
        </Text>
        <View style={styles.actions}>
          <ContactOrganiserLink contact={contact} />
          {startListLink}
        </View>
      </>
    );
  } else if (availability === "elsewhere") {
    body = (
      <>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Registration is handled by the organiser
        </Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>
          This event takes registrations on the organiser&apos;s own website.
        </Text>
        <View style={styles.actions}>
          {isHttpUrl(event.registration_url) && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: REGISTRATION_ACTION_BACKGROUND }]}
              onPress={() =>
                LinkActions.openInNewTab(event.registration_url!.trim(), "Error opening registration link")
              }
              accessibilityRole="link"
            >
              <Text style={styles.buttonText}>Go to registration</Text>
            </TouchableOpacity>
          )}
          <ContactOrganiserLink contact={contact} />
          {startListLink}
        </View>
      </>
    );
  } else {
    body = (
      <>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Online registration isn&apos;t available
        </Text>
        <Text style={[styles.message, { color: colors.secondaryText }]}>
          {REGISTRATION_ERROR_MESSAGES.registration_not_available}
        </Text>
        <View style={styles.actions}>
          <ContactOrganiserLink contact={contact} />
          {startListLink}
        </View>
      </>
    );
  }

  return (
    <>
      <Head
        title={`Register – ${title} – Chiron Event Services`}
        description={`Register for ${title}`}
        ogTitle={`Register for ${title}`}
        ogDescription={`Register for ${title}`}
        twitterTitle={`Register for ${title}`}
        twitterDescription={`Register for ${title}`}
        robots="noindex"
      />
      <Stack.Screen options={{ headerShown: false, title: "Register" }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EventTopNav
          eventName={title}
          eventStartDate={event.race_start_date || ""}
          eventId={event.id}
        />
        <ScrollView style={styles.content}>
          <MaxWidthContainer maxWidth={560} style={styles.contentContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Register for {title}
            </Text>
            {body}
            <Footer />
          </MaxWidthContainer>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  contentContainer: { paddingVertical: 20, paddingBottom: 40, paddingHorizontal: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  message: { fontSize: 16, lineHeight: 24, marginTop: 8 },
  actions: { marginTop: 20, gap: 16, alignItems: "flex-start" },
  link: { fontSize: 16, textDecorationLine: "underline" },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: REGISTRATION_ON_FILL, fontSize: 16, fontWeight: "600" },
});
