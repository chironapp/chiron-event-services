import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface MaxWidthContainerProps extends ViewProps {
  /**
   * Maximum width for the container
   * @default 1200
   */
  maxWidth?: number;
  /**
   * Whether to center the container
   * @default true
   */
  center?: boolean;
  /**
   * Children to render inside the container
   */
  children: React.ReactNode;
}

/**
 * Container component that limits maximum width for better desktop viewing
 *
 * @example
 * ```tsx
 * <MaxWidthContainer maxWidth={1000}>
 *   <YourContent />
 * </MaxWidthContainer>
 * ```
 */
export default function MaxWidthContainer({
  maxWidth = 1200,
  center = true,
  children,
  style,
  ...props
}: MaxWidthContainerProps) {
  return (
    <View
      style={[
        styles.container,
        {
          maxWidth,
          alignSelf: center ? "center" : "auto",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
  },
});

// Add CSS for web responsiveness
const webStyles = `
  @media (max-width: 768px) {
    .max-width-container {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
  }
  
  @media (max-width: 480px) {
    .max-width-container {
      padding-left: 4px !important;
      padding-right: 4px !important;
    }
  }
`;

// Inject CSS for web
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = webStyles;
  document.head.appendChild(style);
}
