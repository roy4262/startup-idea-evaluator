import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeController } from "@/hooks/useColorScheme";
import { Idea, getIdeas } from "@/lib/storage";

export default function HomeScreen() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const load = async () => setIdeas(await getIdeas());
    const t = setInterval(load, 800);
    load();
    return () => clearInterval(t);
  }, []);

  const top3 = useMemo(() => {
    return [...ideas]
      .sort((a, b) => b.votes - a.votes || b.rating - a.rating)
      .slice(0, 3);
  }, [ideas]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero */}
      <ThemedView lightColor="#E0F2FE" darkColor="#0b1220" style={styles.hero}>
        <View style={styles.heroTextRow}>
          <ThemedText type="display" style={styles.title}>
            Startup Idea Evaluator 🚀
          </ThemedText>
          <HelloWave />
          <ThemeToggle />
        </View>
        <ThemedText style={styles.subtitle}>
          Submit ideas, get a fun AI rating, upvote the best, and climb the
          leaderboard.
        </ThemedText>
        <View style={styles.ctaRow}>
          <PrimaryButton
            title="Submit Idea"
            onPress={() => router.push("/(tabs)/submit")}
          />
          <SecondaryButton
            title="Browse Ideas"
            onPress={() => router.push("/(tabs)/ideas")}
          />
        </View>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.heroImage}
        />
      </ThemedView>

      {/* Feature grid */}
      <View style={styles.features}>
        <FeatureCard
          emoji="📝"
          title="Submission"
          desc="Name, tagline & description"
        />
        <FeatureCard
          emoji="🤖"
          title="AI Rating"
          desc="Playful 0–100 feedback"
        />
        <FeatureCard emoji="👍" title="Voting" desc="One upvote per idea" />
        <FeatureCard emoji="🏆" title="Leaderboard" desc="Top 5 ideas shine" />
      </View>

      {/* Mini leaderboard preview */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle">Top ideas</ThemedText>
        <TouchableOpacity onPress={() => router.push("/(tabs)/leaderboard")}>
          <ThemedText type="link">See all</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={{ gap: 10 }}>
        {top3.length === 0 && (
          <ThemedText style={{ opacity: 0.7 }}>
            No ideas yet. Be the first to submit!
          </ThemedText>
        )}
        {top3.map((idea, idx) => (
          <LeaderboardRow key={idea.id} idea={idea} rank={idx + 1} />
        ))}
      </View>
    </ScrollView>
  );
}

function FeatureCard({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <ThemedView
      lightColor="#ffffff"
      darkColor="#111827"
      style={styles.featureCard}
    >
      <ThemedText style={{ fontSize: 22 }}>{emoji}</ThemedText>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDesc}>{desc}</ThemedText>
      </View>
    </ThemedView>
  );
}

function ThemeToggle() {
  const { preference, effective, toggle, setSystem } = useThemeController();
  const label =
    preference === "system" ? `System (${effective})` : `Theme: ${effective}`;
  return (
    <TouchableOpacity
      onPress={toggle}
      onLongPress={setSystem}
      style={styles.themeToggle}
    >
      <ThemedText style={styles.themeToggleText}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

function LeaderboardRow({ idea, rank }: { idea: Idea; rank: number }) {
  const badge = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
  return (
    <ThemedView lightColor="#ffffff" darkColor="#111827" style={styles.lbRow}>
      <ThemedText style={styles.lbLeft}>{badge}</ThemedText>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.lbName}>{idea.name}</ThemedText>
        <ThemedText style={styles.lbTag}>{idea.tagline}</ThemedText>
      </View>
      <ThemedText style={styles.lbRight}>{idea.votes} votes</ThemedText>
    </ThemedView>
  );
}

function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.primaryBtn}
    >
      <ThemedText style={styles.primaryBtnText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

function SecondaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.secondaryBtn}
    >
      <ThemedText style={styles.secondaryBtnText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 18 },
  hero: {
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  heroTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  title: { fontSize: 24 },
  subtitle: { opacity: 0.8 },
  ctaRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  heroImage: {
    width: 100,
    height: 60,
    position: "absolute",
    right: -10,
    bottom: -10,
    opacity: 0.15,
  },

  features: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  featureCard: {
    flexBasis: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  featureTitle: { fontWeight: "600" },
  featureDesc: { opacity: 0.7 },

  sectionHeader: {
    marginTop: 4,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lbRow: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  lbLeft: { fontSize: 18 },
  lbName: { fontWeight: "600" },
  lbTag: { opacity: 0.7 },
  lbRight: { fontWeight: "600" },

  themeToggle: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  themeToggleText: { fontWeight: "600" },

  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryBtnText: { color: "white", fontWeight: "700" },
  secondaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryBtnText: { fontWeight: "700" },
});
