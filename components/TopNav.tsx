import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Top navigation component with clickable logo and About/Events/Contact links
 *
 * @example
 * ```tsx
 * <TopNav />
 * ```
 */
export default function TopNav() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  /**
   * Handles navigation to the About page
   */
  const handleAboutPress = () => {
    router.navigate("/about");
  };

  /**
   * Handles opening the contact page
   */
  const handleContactPress = () => {
    LinkActions.openContact();
  };

  /**
   * Handles navigation to the home page
   */
  const handleLogoPress = () => {
    router.navigate("/");
  };

  /**
   * Handles navigation to the events page (index)
   */
  const handleEventsPress = () => {
    router.navigate("/");
  };

  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
      ]}
    >
      <View style={styles.content}>
        <TouchableOpacity
          onPress={handleLogoPress}
          accessibilityRole="button"
          accessibilityLabel="Navigate to home page"
        >
          <Image
            source={require("@/assets/images/chiron-wordmark-purple-115x40.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Chiron Event Services"
          />
        </TouchableOpacity>

        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={handleAboutPress}
            accessibilityRole="button"
            accessibilityLabel="Navigate to About page"
          >
            <Text
              style={[
                styles.navText,
                { color: isDark ? "#007AFF" : "#0066CC" },
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={handleEventsPress}
            accessibilityRole="button"
            accessibilityLabel="Navigate to Events page"
          >
            <Text
              style={[
                styles.navText,
                { color: isDark ? "#007AFF" : "#0066CC" },
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={handleContactPress}
            accessibilityRole="button"
            accessibilityLabel="Open contact page"
          >
            <Text
              style={[
                styles.navText,
                { color: isDark ? "#007AFF" : "#0066CC" },
              ]}
            >
              Contact
            </Text>
          </TouchableOpacity>
        </View>
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
  logo: {
    width: 115,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  nav: {
    flexDirection: "row",
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
