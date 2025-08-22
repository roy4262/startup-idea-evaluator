# The Startup Idea Evaluator — AI + Voting App

A small mobile app where users submit startup ideas, get a fun AI-style rating, upvote others’ ideas, and see a leaderboard. Built with Expo + React Native and local persistence.

## Highlights

- Submit ideas with name, tagline, and description
- Auto-generate a playful “AI rating” (0–100)
- Upvote others’ ideas (one vote per idea/device)
- Sort list by rating or votes
- Leaderboard for top ideas
- Toast notifications on actions
- Dark mode with an in-app toggle

## Screens

1. Idea Submission

- **Fields**: Startup Name, Tagline, Description
- **On submit**: generates rating, saves locally, and navigates to Ideas

2. Idea Listing

- **Displays**: name, tagline, rating, votes
- **Actions**: Upvote once per idea, “Read more” to expand description
- **Sorting**: by rating or votes
- **Theme**: dark mode toggle chip in header

3. Leaderboard

- **Shows**: top ideas by votes or rating
- **UI**: emphasis for top performers

## Tech Stack

- **React Native + Expo**
- **expo-router** for navigation
- **AsyncStorage** (via a simple storage module) for persistence
- **react-native-toast-message** for toasts
- **Custom themed components** for light/dark support

## Getting Started

1. Prerequisites

- Node.js LTS
- npm or yarn
- Expo CLI (optional): `npm i -g expo`

2. Install

```powershell
npm install
```

3. Run (Expo)

```powershell
npx expo start
```

- Press `a` for Android, `i` for iOS (macOS), or scan the QR in Expo Go.

4. Clean cache if needed

```powershell
npx expo start -c
```

## Build (optional)

If you use EAS:

```powershell
npx expo login
npx expo prebuild
npx eas build --platform android
npx eas build --platform ios
```

## Project Structure (key files)

- `app/_layout.tsx` — App theme provider and navigation root
- `app/(tabs)/_layout.tsx` — Tabs configuration
- `app/(tabs)/submit.tsx` — Submit screen
- `app/(tabs)/ideas/index.tsx` — Idea list, upvote, sort, dark mode toggle
- `app/(tabs)/leaderboard.tsx` — Top ideas
- `components/` — UI components (ThemedText, ThemedView, etc.)
- `hooks/useColorScheme(.web).ts(x)` — Theme handling
- `lib/storage.ts` — Persistence, types, and helpers

## Data Model

Each Idea saved locally contains:

- `id: string`
- `name: string`
- `tagline: string`
- `description: string`
- `rating: number` (0–100)
- `votes: number`
- `createdAt: number` (timestamp)

Voting is tracked per device to prevent duplicate votes.

## Persistence

- Ideas are stored locally using AsyncStorage via `lib/storage.ts`.
- Upvote state is also persisted per device so each idea can only be upvoted once.

## Theming & Dark Mode

- App follows the system theme by default.
- A small “Theme: …” chip on the Ideas screen cycles system → light → dark.

## UX Niceties

- Toast messages on submission and key actions
- Clean cards and list layouts
- Expandable description sections

## How to Use

1. Go to Submit tab, add a new idea. On submit, you’ll get a rating and be redirected to Ideas.
2. In Ideas, upvote (once), expand descriptions, and sort by rating or votes.
3. Check Leaderboard for top ideas.
4. Toggle theme on the Ideas screen.

## Development Notes

- Uses `expo-router`; screens are file-based.
- The “Symbol (optional)” field was removed from Submit to simplify UI.
- Styles are theme-aware and cross-platform friendly.

## Future Improvements

- Backend API or cloud sync
- Auth to map ideas/votes to users
- Advanced search and filters
- Animations (e.g., gestures/swipes)
- Share to social/clipboard
- Unit/integration tests

## License

MIT
