import OrganiserTopNav from "@/components/OrganiserTopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Example page to demonstrate OrganiserTopNav component
 */
export default function OrganiserExamplePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Organiser Example",
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        <OrganiserTopNav organiserName="Marathon Events Inc." />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text
              style={[
                styles.heading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Organiser Details Page Example
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              This is an example page showing the OrganiserTopNav component with
              the organiser name displayed instead of the Chiron logo.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              Notice that the header matches the styling of the regular TopNav
              but has no navigation links on the right side.
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
