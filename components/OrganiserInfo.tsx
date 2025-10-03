import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Organiser } from "@/lib/supabase";
import React from "react";
import { StyleSheet, Text, View, Linking, TouchableOpacity } from "react-native";

interface OrganiserInfoProps {
  /**
   * The organiser data to display
   */
  organiser: Organiser;
}

/**
 * Component for displaying organiser information including name, website, and description
 *
 * @example
 * ```tsx
 * <OrganiserInfo organiser={organiserData} />
 * ```
 */
export default function OrganiserInfo({ organiser }: OrganiserInfoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleWebsitePress = () => {
    if (organiser.website) {
      Linking.openURL(organiser.website);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.organiserName,
          { color: isDark ? "#ffffff" : "#000000" },
        ]}
      >
        {organiser.name}
      </Text>

      {organiser.website && (
        <TouchableOpacity onPress={handleWebsitePress} style={styles.websiteContainer}>
          <Text
            style={[
              styles.websiteLink,
              { color: isDark ? "#4dabf7" : "#0066CC" },
            ]}
          >
            {organiser.website}
          </Text>
        </TouchableOpacity>
      )}

      {organiser.description && (
        <Text
          style={[
            styles.description,
            { color: isDark ? "#e0e0e0" : "#333333" },
          ]}
        >
          {organiser.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  organiserName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  websiteContainer: {
    marginBottom: 12,
  },
  websiteLink: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});
