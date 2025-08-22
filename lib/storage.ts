import AsyncStorage from "@react-native-async-storage/async-storage";

export type Idea = {
  id: string; // uuid
  name: string;
  tagline: string;
  description: string;
  rating: number; // 0-100
  votes: number; // total votes
  createdAt: number;
  symbol?: string; // optional emoji or tag to render in UI
};

const IDEAS_KEY = "ideas_v1";
const VOTES_KEY = "votes_v1"; // map of ideaId -> true (voted)

export async function getIdeas(): Promise<Idea[]> {
  const raw = await AsyncStorage.getItem(IDEAS_KEY);
  if (!raw) return [];
  try {
    const parsed: Idea[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveIdeas(ideas: Idea[]): Promise<void> {
  await AsyncStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

export async function getVotes(): Promise<Record<string, boolean>> {
  const raw = await AsyncStorage.getItem(VOTES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveVotes(votes: Record<string, boolean>): Promise<void> {
  await AsyncStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export async function markVoted(ideaId: string): Promise<void> {
  const votes = await getVotes();
  votes[ideaId] = true;
  await AsyncStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export function generateFakeRating(): number {
  // fun, slightly optimistic rating
  const base = Math.floor(Math.random() * 60) + 30; // 30-89
  const bonus = Math.random() < 0.2 ? Math.floor(Math.random() * 11) : 0; // sometimes add up to +10
  return Math.min(100, base + bonus);
}

export function uuid(): string {
  // lightweight UUID v4 generator
  // not crypto-strong, fine for local data
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Utilities to clear stored data
export async function clearIdeas(): Promise<void> {
  // Set to empty array to avoid stale caches on some platforms
  await AsyncStorage.setItem(IDEAS_KEY, JSON.stringify([]));
}

export async function clearVotes(): Promise<void> {
  await AsyncStorage.setItem(VOTES_KEY, JSON.stringify({}));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiSet([
    [IDEAS_KEY, JSON.stringify([])],
    [VOTES_KEY, JSON.stringify({})],
  ]);
}
