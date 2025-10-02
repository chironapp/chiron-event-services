import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import { Stack } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * About page component displaying information about Chiron Event Services
 *
 * @returns {JSX.Element} The About page with navigation and content
 */
export default function AboutPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "About",
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
              Chiron Event Services
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              Chiron Event Services is a platform for managing endurance events
              and races, timing and results.
            </Text>

            <Text
              style={[
                styles.subheading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Features
            </Text>

            <View style={styles.featureList}>
              <Text
                style={[
                  styles.feature,
                  { color: isDark ? "#e0e0e0" : "#333333" },
                ]}
              >
                • Create running, cycling, triathlon and multisport events and
                races
              </Text>
              <Text
                style={[
                  styles.feature,
                  { color: isDark ? "#e0e0e0" : "#333333" },
                ]}
              >
                • Manual and automated timing solutions
              </Text>
              <Text
                style={[
                  styles.feature,
                  { color: isDark ? "#e0e0e0" : "#333333" },
                ]}
              >
                • Live race tracking and results
              </Text>
            </View>

            <View style={styles.contactSection}>
              <Text
                style={[
                  styles.paragraph,
                  { color: isDark ? "#e0e0e0" : "#333333" },
                ]}
              >
                Interested in having us help organize your events and results?
              </Text>
              <TouchableOpacity
                onPress={LinkActions.openContact}
                style={styles.contactLink}
              >
                <Text
                  style={[
                    styles.linkText,
                    { color: isDark ? "#007AFF" : "#0066CC" },
                  ]}
                >
                  Contact us to learn more about our services
                </Text>
              </TouchableOpacity>
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
    marginBottom: 16,
    textAlign: "center",
  },
  subheading: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureList: {
    marginLeft: 8,
    marginBottom: 16,
  },
  feature: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  contactSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  contactLink: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
