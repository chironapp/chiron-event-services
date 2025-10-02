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
