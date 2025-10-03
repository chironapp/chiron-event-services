import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinkActions } from "@/utils/linkUtils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const { width } = useWindowDimensions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use mobile layout when width is less than 768px
  const isMobile = width < 768;

  /**
   * Handles navigation to the About page
   */
  const handleAboutPress = () => {
    setMobileMenuOpen(false);
    router.navigate("/about");
  };

  /**
   * Handles opening the contact page
   */
  const handleContactPress = () => {
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
    router.navigate("/");
  };

  /**
   * Handles navigation to the organisers page
   */
  const handleOrganisersPress = () => {
    setMobileMenuOpen(false);
    router.navigate("/organisers");
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

        {/* Desktop Navigation - shown on wider screens */}
        {!isMobile && (
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
              onPress={handleOrganisersPress}
              accessibilityRole="button"
              accessibilityLabel="Navigate to Organisers page"
            >
              <Text
                style={[
                  styles.navText,
                  { color: isDark ? "#007AFF" : "#0066CC" },
                ]}
              >
                Organisers
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
        )}

        {/* Mobile Hamburger Menu Button */}
        {isMobile && (
          <TouchableOpacity
            onPress={() => setMobileMenuOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            style={styles.hamburgerButton}
          >
            <Ionicons
              name="menu"
              size={28}
              color={isDark ? "#ffffff" : "#000000"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        visible={mobileMenuOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMobileMenuOpen(false)}
        >
          <View
            style={[
              styles.mobileMenu,
              { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
            ]}
          >
            <View style={styles.mobileMenuHeader}>
              <TouchableOpacity
                onPress={() => setMobileMenuOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close navigation menu"
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={28}
                  color={isDark ? "#ffffff" : "#000000"}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.mobileNavItem}
              onPress={handleAboutPress}
              accessibilityRole="button"
              accessibilityLabel="Navigate to About page"
            >
              <Text
                style={[
                  styles.mobileNavText,
                  { color: isDark ? "#007AFF" : "#0066CC" },
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileNavItem}
              onPress={handleEventsPress}
              accessibilityRole="button"
              accessibilityLabel="Navigate to Events page"
            >
              <Text
                style={[
                  styles.mobileNavText,
                  { color: isDark ? "#007AFF" : "#0066CC" },
                ]}
              >
                Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileNavItem}
              onPress={handleOrganisersPress}
              accessibilityRole="button"
              accessibilityLabel="Navigate to Organisers page"
            >
              <Text
                style={[
                  styles.mobileNavText,
                  { color: isDark ? "#007AFF" : "#0066CC" },
                ]}
              >
                Organisers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mobileNavItem}
              onPress={handleContactPress}
              accessibilityRole="button"
              accessibilityLabel="Open contact page"
            >
              <Text
                style={[
                  styles.mobileNavText,
                  { color: isDark ? "#007AFF" : "#0066CC" },
                ]}
              >
                Contact
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
  hamburgerButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  mobileMenu: {
    width: "75%",
    height: "100%",
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mobileMenuHeader: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButton: {
    padding: 8,
  },
  mobileNavItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  mobileNavText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
