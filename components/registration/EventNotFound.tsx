import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import {
  REGISTRATION_ACTION_BACKGROUND,
  REGISTRATION_ON_FILL,
} from "@/constants/registrationColors";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Shown when an event cannot be found (it does not exist, or is not public, eg
 * while paused). Uses the same top navigation as the home screen and offers a
 * way back to the list of events.
 *
 * @returns {JSX.Element} The not-found view
 */
export default function EventNotFound() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopNav />
      <ScrollView style={styles.content}>
        <MaxWidthContainer maxWidth={560} style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Whoops, event not found
          </Text>
          <Text style={[styles.message, { color: colors.text }]}>
            Contact the race organiser
          </Text>
          <Pressable
            onPress={() => router.navigate("/")}
            accessibilityRole="link"
            style={[styles.button, { backgroundColor: REGISTRATION_ACTION_BACKGROUND }]}
          >
            <Text style={styles.buttonText}>Search all events</Text>
          </Pressable>
          <Footer />
        </MaxWidthContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  message: { fontSize: 16, lineHeight: 24, marginBottom: 24, textAlign: "center" },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 40,
  },
  buttonText: { color: REGISTRATION_ON_FILL, fontSize: 16, fontWeight: "600" },
});
