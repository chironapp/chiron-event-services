import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface OrganiserTopNavProps {
  /**
   * The name of the organiser to display
   */
  organiserName: string;
}

/**
 * Top navigation component for organiser details screen with organiser name
 *
 * @example
 * ```tsx
 * <OrganiserTopNav organiserName="Marathon Events Inc." />
 * ```
 */
export default function OrganiserTopNav({
  organiserName,
}: OrganiserTopNavProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.organiserName,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
          numberOfLines={1}
        >
          {organiserName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  organiserName: {
    fontSize: 18,
    fontWeight: "600",
  },
});
