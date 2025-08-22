import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "display"
    | "mono";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  // Derive link/tint color per theme to avoid invisible text in dark mode
  const isLink = type === "link";
  const tint = useThemeColor(
    { light: Colors.light.tint, dark: Colors.dark.tint },
    "tint"
  );

  return (
    <Text
      style={[
        { color: isLink ? tint : color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "display" ? styles.display : undefined,
        type === "mono" ? styles.mono : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  display: {
    // Uses the custom SpaceMono as a display for stylistic effect
    fontFamily: "SpaceMono",
    fontSize: 34,
    lineHeight: 36,
  },
  mono: {
    fontFamily: "SpaceMono",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    // Color is set dynamically based on theme in the component
  },
});
