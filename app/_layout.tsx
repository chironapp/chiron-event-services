import { Head } from "@/components/utils/Head";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize iframe-resizer for seamless embedding
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Monitor postMessage calls to verify iframe-resizer is working
      const originalPostMessage = window.parent.postMessage;
      window.parent.postMessage = ((
        message: any,
        options?: WindowPostMessageOptions
      ) => {
        console.log("📤 [iframe-resizer message]", message);
        // Call with proper signature
        return originalPostMessage.call(window.parent, message, options);
      }) as typeof originalPostMessage;

      // Dynamically import iframe-resizer child script
      import("@iframe-resizer/child").then(() => {
        console.log("✅ iframe-resizer initialized");
      });
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Head />
      <Stack>
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
