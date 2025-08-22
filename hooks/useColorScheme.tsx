import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Simple theme controller that allows overriding system theme
// Persisted under this key
const STORAGE_KEY = "theme.preference"; // 'light' | 'dark' | 'system'

type Preference = "light" | "dark" | "system";

type Ctx = {
  preference: Preference;
  setPreference: (p: Preference) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const system = useSystemColorScheme() ?? "light";
  const [preference, setPreference] = useState<Preference>("system");

  // Load saved preference
  useEffect(() => {
    (async () => {
      try {
        const saved = (await AsyncStorage.getItem(
          STORAGE_KEY
        )) as Preference | null;
        if (saved) setPreference(saved);
      } catch {}
    })();
  }, []);

  // Persist changes
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, preference).catch(() => {});
  }, [preference]);

  const value = useMemo(() => ({ preference, setPreference }), [preference]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

// Public hook used across the app. Always returns the effective scheme.
export function useColorScheme(): "light" | "dark" {
  const ctx = useContext(ThemeCtx);
  const system = useSystemColorScheme() ?? "light";
  if (!ctx || ctx.preference === "system") return system;
  return ctx.preference;
}

// Extra controller hook for toggles in UI
export function useThemeController() {
  const ctx = useContext(ThemeCtx);
  const system = useSystemColorScheme() ?? "light";
  if (!ctx) {
    return {
      preference: "system" as Preference,
      effective: system as "light" | "dark",
      setPreference: (_: Preference) => {},
      toggle: () => {},
      setSystem: () => {},
    };
  }
  const effective = ctx.preference === "system" ? system : ctx.preference;
  return {
    preference: ctx.preference,
    effective,
    setPreference: ctx.setPreference,
    toggle: () => ctx.setPreference(effective === "light" ? "dark" : "light"),
    setSystem: () => ctx.setPreference("system"),
  };
}
