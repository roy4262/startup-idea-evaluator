import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeController } from "@/hooks/useColorScheme";
import {
  Idea,
  clearAll,
  getIdeas,
  getVotes,
  markVoted,
  saveIdeas,
} from "@/lib/storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function IdeasScreen() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "votes">("rating");
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      const [list, votes] = await Promise.all([getIdeas(), getVotes()]);
      setIdeas(list);
      setVoted(votes);
    };
    const unsubscribe = setInterval(load, 400); // lightweight refresh while tab is open
    load();
    return () => clearInterval(unsubscribe);
  }, []);

  const sorted = useMemo(() => {
    const copy = [...ideas];
    copy.sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating : b.votes - a.votes
    );
    return copy;
  }, [ideas, sortBy]);

  const onUpvote = async (id: string) => {
    if (voted[id]) {
      Toast.show({ type: "info", text1: "You already voted for this idea" });
      return;
    }
    const updated = ideas.map((i) =>
      i.id === id ? { ...i, votes: i.votes + 1 } : i
    );
    setIdeas(updated);
    await saveIdeas(updated);
    await markVoted(id);
    setVoted({ ...voted, [id]: true });
    Toast.show({ type: "success", text1: "Voted! 🔼" });
  };

  const renderItem = ({ item }: { item: Idea }) => (
    <IdeaCard
      idea={item}
      voted={!!voted[item.id]}
      onUpvote={() => onUpvote(item.id)}
    />
  );

  const onClear = () => {
    const confirmClear = async () => {
      try {
        await clearAll();
        // Force reload to ensure UI reflects cleared storage
        setIdeas([]);
        setVoted({});
        Toast.show({ type: "success", text1: "Cleared" });
      } catch (e) {
        Toast.show({ type: "error", text1: "Failed to clear" });
      }
    };

    if (Platform.OS === "web") {
      // web Alert is no-op; use window.confirm
      if (window.confirm("Clear all ideas and votes?")) {
        confirmClear();
      }
      return;
    }

    Alert.alert("Clear all ideas?", "This will remove all ideas and votes.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: confirmClear },
    ]);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.header}>
        <ThemedText type="title">Ideas</ThemedText>
        <ThemeToggle />
        <View style={styles.sortRow}>
          <SortPill
            active={sortBy === "rating"}
            label="Rating"
            onPress={() => setSortBy("rating")}
          />
          <SortPill
            active={sortBy === "votes"}
            label="Votes"
            onPress={() => setSortBy("votes")}
          />
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <ThemedText style={styles.clearText}>Clear</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: "center", marginTop: 40 }}>
            No ideas yet. Submit one!
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

function SortPill({
  label,
  onPress,
  active,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        active
          ? { backgroundColor: "#eef2ff", borderColor: "#a5b4fc" }
          : { borderColor: "#4b5563" },
      ]}
    >
      <ThemedText
        style={[
          styles.pillText,
          active ? { color: "#3730A3", fontWeight: "600" } : {},
        ]}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Lightweight theme toggle for mobile/web
function ThemeToggle() {
  const { preference, effective, setPreference, setSystem } =
    useThemeController();
  const cycle = () => {
    if (preference === "system") setPreference("light");
    else if (preference === "light") setPreference("dark");
    else setSystem();
  };
  const label =
    preference === "system"
      ? `Theme: ${effective} (sys)`
      : `Theme: ${preference}`;
  return (
    <TouchableOpacity onPress={cycle} style={styles.themeToggle}>
      <ThemedText style={styles.themeToggleText}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

function IdeaCard({
  idea,
  voted,
  onUpvote,
}: {
  idea: Idea;
  voted: boolean;
  onUpvote: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const onShare = async () => {
    try {
      await Share.share({
        title: idea.name,
        message: `${idea.name} — ${idea.tagline}\nRating: ${idea.rating}/100\nVotes: ${idea.votes}\n\n${idea.description}`,
      });
    } catch {}
  };
  return (
    <ThemedView lightColor="#ffffff" darkColor="#111827" style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          {idea.symbol ? (
            <View style={styles.symbolAvatar}>
              <ThemedText style={styles.symbolText}>{idea.symbol}</ThemedText>
            </View>
          ) : null}
          <ThemedText type="subtitle">{idea.name}</ThemedText>
        </View>
        <Badge value={`${idea.rating}/100`} color="#10B981" />
      </View>
      <ThemedText>{idea.tagline}</ThemedText>
      {expanded && (
        <ThemedText style={{ marginTop: 6 }}>{idea.description}</ThemedText>
      )}
      <View style={styles.rowBetween}>
        <TouchableOpacity onPress={() => setExpanded((e) => !e)}>
          <ThemedText type="link">
            {expanded ? "Read less" : "Read more"}
          </ThemedText>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity onPress={onShare} style={styles.shareButton}>
            <ThemedText style={styles.shareText}>Share</ThemedText>
          </TouchableOpacity>
          <Badge value={`${idea.votes} votes`} color="#6366F1" />
          <TouchableOpacity
            onPress={onUpvote}
            disabled={voted}
            style={[styles.voteButton, voted && { opacity: 0.5 }]}
          >
            <ThemedText style={styles.voteText}>
              {voted ? "Voted" : "Upvote"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

function Badge({ value, color }: { value: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <ThemedText type="mono" style={styles.badgeText}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  sortRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearText: { fontWeight: "600" },
  themeToggle: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#94a3b8",
    marginTop: 6,
  },
  themeToggleText: { fontSize: 12 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillActive: {},
  pillText: {},
  pillTextActive: { fontWeight: "600" },
  card: {
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  symbolAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    marginRight: 6,
  },
  symbolText: { fontSize: 16 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: "white", fontSize: 12 },
  voteButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  voteText: { color: "white", fontWeight: "600" },
  shareButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  shareText: { color: "#fff", fontWeight: "600" },
});
