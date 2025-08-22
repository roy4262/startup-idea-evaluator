# 🚀 The Startup Idea Evaluator — AI + Voting App

[![Expo](https://img.shields.io/badge/Expo-49.0.0-000?logo=expo&logoColor=fff)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue?logo=react&logoColor=fff)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A small mobile app where users **submit startup ideas**, get a fun **AI rating**, **upvote others’ ideas**, and view a **leaderboard**.  
Built with **Expo + React Native**, using **local storage persistence**.

---

## 🎥 Demo Video

Watch the walkthrough here: [Loom Video Demo]([https://www.loom.com/share/your-demo-video-link](https://www.loom.com/share/572a5089a02a4d09aeda069f37fc5e48)


## ✨ Highlights

- 📌 Submit ideas with **Name**, **Tagline**, and **Description**
- 🤖 Auto-generate a playful **AI rating** (0–100)
- 👍 Upvote others’ ideas (one vote per idea/device)
- 📊 Sort list by **rating** or **votes**
- 🏆 Leaderboard for **top ideas**
- 🍞 Toast notifications on all key actions
- 🌙 **Dark mode** with in-app toggle

---

## 📱 Screens

### 1. Idea Submission
- Fields: Startup Name, Tagline, Description  
- On submit → Generates rating → Saves locally → Navigates to **Ideas**

### 2. Idea Listing
- Displays: Name, Tagline, Rating, Votes  
- Actions: Upvote (once), Expand description, Sort by Rating/Votes  
- Includes: **Dark mode toggle chip** in header

### 3. Leaderboard
- Shows: Top ideas (votes/rating)  
- UI: Special emphasis for top performers

---

## 🛠 Tech Stack

- **React Native + Expo**
- **expo-router** → File-based navigation
- **AsyncStorage** → Local persistence
- **react-native-toast-message** → Toasts
- **Custom themed components** → Light/Dark support

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (LTS)
- npm or yarn
- Expo CLI *(optional)* → `npm i -g expo`

### 2. Install dependencies
```bash
npm install
