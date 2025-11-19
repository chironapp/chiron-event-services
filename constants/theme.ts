/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // Toggle Switch colors
    toggleBackground: "#f0f0f0",
    toggleBorder: "#e0e0e0",
    toggleSelected: "#6A1B9A",
    toggleSelectedText: "#ffffff",
    toggleUnselectedText: "#333333",
    link: "#2563eb",
    // Table colors
    border: "#e0e0e0",
    tableHeader: "#f5f5f5",
    tableRowAlt: "#fafafa",
    subText: "#666666",
    // Button colors
    success: "#4CAF50",
    primary: "#2196F3",
    // Status colors
    error: "#d32f2f",
    muted: "#e0e0e0",
    secondaryText: "#333333",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // Toggle Switch colors
    toggleBackground: "#1a1a1a",
    toggleBorder: "#333333",
    toggleSelected: "#6a1b9a",
    toggleSelectedText: "#ffffff",
    toggleUnselectedText: "#e0e0e0",
    link: "#60a5fa",
    // Table colors
    border: "#333333",
    tableHeader: "#1a1a1a",
    tableRowAlt: "#0a0a0a",
    subText: "#cccccc",
    // Button colors
    success: "#4CAF50",
    primary: "#2196F3",
    // Status colors
    error: "#ff6b6b",
    muted: "#e0e0e0",
    secondaryText: "#e0e0e0",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
