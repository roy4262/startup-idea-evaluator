import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Idea, getIdeas } from "@/lib/storage";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function LeaderboardScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const load = async () => setIdeas(await getIdeas());
    const t = setInterval(load, 600);
    load();
    return () => clearInterval(t);
  }, []);

  const top5 = useMemo(() => {
    return [...ideas]
      .sort((a, b) => b.votes - a.votes || b.rating - a.rating)
      .slice(0, 5);
  }, [ideas]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }}>
        <ThemedText type="title">Leaderboard</ThemedText>
      </View>
      <FlatList
        data={top5}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item, index }) => (
          <LeaderboardCard idea={item} rank={index + 1} />
        )}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: "center", marginTop: 40 }}>
            No ideas yet.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

function LeaderboardCard({ idea, rank }: { idea: Idea; rank: number }) {
  const badge =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  const bg =
    rank === 1
      ? ["#fde68a", "#f59e0b"]
      : rank === 2
      ? ["#e5e7eb", "#9ca3af"]
      : rank === 3
      ? ["#fca5a5", "#ef4444"]
      : ["#e0e7ff", "#6366f1"];
  return (
    <ThemedView style={[styles.card, { borderColor: bg[1] }]}>
      <View style={styles.rowBetween}>
        <ThemedText type="subtitle">
          {badge} {idea.name}
        </ThemedText>
        <ThemedText type="mono" style={styles.dim}>
          {idea.votes} votes
        </ThemedText>
      </View>
      <ThemedText>{idea.tagline}</ThemedText>
      <View style={styles.rowBetween}>
        <ThemedText type="mono" style={styles.dim}>
          Rating: {idea.rating}/100
        </ThemedText>
        <ThemedText style={styles.dim}>
          {new Date(idea.createdAt).toLocaleDateString()}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dim: {},
});
