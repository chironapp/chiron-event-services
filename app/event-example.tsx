import EventTopNav from "@/components/EventTopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Example page to demonstrate EventTopNav component
 */
export default function EventExamplePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Event Example",
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        <EventTopNav
          eventName="Boston Marathon"
          eventStartDate="2024-04-15"
        />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text
              style={[
                styles.heading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Event Details Page Example
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              This is an example page showing the EventTopNav component with
              the event name and start date displayed.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              Notice that the header matches the styling of the OrganiserTopNav
              but displays &ldquo;event name | event start date&rdquo; instead of just
              organiser name.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              The date is automatically formatted in a human-readable format
              (Month Day, Year).
            </Text>
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
    marginBottom: 16,
  },
});
