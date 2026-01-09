import { Head } from "@/components/utils/Head";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // Communicate iframe height to parent window for seamless embedding
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const sendHeight = () => {
        requestAnimationFrame(() => {
          const height = document.body.scrollHeight;
          window.parent.postMessage(
            {
              type: "chiron:iframe:resize",
              height,
              source: "chiron-events",
            },
            "*"
          );
        });
      };

      // Send height on route change (with staggered retries for async content)
      sendHeight();
      const timeout1 = setTimeout(sendHeight, 100);
      const timeout2 = setTimeout(sendHeight, 300);
      const timeout3 = setTimeout(sendHeight, 600);

      // Observe size and DOM changes for dynamic content updates
      const resizeObserver = new ResizeObserver(sendHeight);
      resizeObserver.observe(document.body);

      const mutationObserver = new MutationObserver(sendHeight);
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }
  }, [pathname]); // Re-run on route changes

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
