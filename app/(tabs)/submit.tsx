import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Idea,
  generateFakeRating,
  getIdeas,
  saveIdeas,
  uuid,
} from "@/lib/storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SubmitScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    tagline.trim().length > 0 &&
    description.trim().length > 0 &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const rating = generateFakeRating();
      const newIdea: Idea = {
        id: uuid(),
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        rating,
        votes: 0,
        createdAt: Date.now(),
      };
      const existing = await getIdeas();
      await saveIdeas([newIdea, ...existing]);
      Toast.show({
        type: "success",
        text1: "Idea submitted!",
        text2: `AI rating: ${rating}/100`,
      });
      setName("");
      setTagline("");
      setDescription("");
      router.push("/(tabs)/ideas");
    } catch (e) {
      Toast.show({ type: "error", text1: "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  };

  // Theme-aware input colors
  const inputBg = useThemeColor(
    { light: "#ffffff", dark: "#111827" },
    "background"
  );
  const inputText = useThemeColor(
    { light: undefined, dark: undefined },
    "text"
  );
  const inputBorder = useThemeColor(
    { light: "#cbd5e1", dark: "#334155" },
    "icon"
  );
  const placeholder = useThemeColor(
    { light: "#64748b", dark: "#9ca3af" },
    "icon"
  );

  return (
    <ParallaxContainer title="Submit Idea">
      <ThemedView style={styles.formGroup}>
        <ThemedText type="subtitle">Startup Name</ThemedText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Acme AI"
          placeholderTextColor={placeholder}
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              color: inputText,
              borderColor: inputBorder,
            },
          ]}
        />
      </ThemedView>
      <ThemedView style={styles.formGroup}>
        <ThemedText type="subtitle">Tagline</ThemedText>
        <TextInput
          value={tagline}
          onChangeText={setTagline}
          placeholder="AI that rates ideas"
          placeholderTextColor={placeholder}
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              color: inputText,
              borderColor: inputBorder,
            },
          ]}
        />
      </ThemedView>
      <ThemedView style={styles.formGroup}>
        <ThemedText type="subtitle">Description</ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What does it do? Who is it for?"
          placeholderTextColor={placeholder}
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: inputBg,
              color: inputText,
              borderColor: inputBorder,
            },
          ]}
          multiline
        />
      </ThemedView>
      <ThemedView style={{ paddingHorizontal: 16 }}>
        <SubmitButton
          disabled={!canSubmit}
          onPress={handleSubmit}
          title={submitting ? "Submitting..." : "Submit"}
        />
      </ThemedView>
    </ParallaxContainer>
  );
}

// Simple container mimicking existing parallax visual
function ParallaxContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{title}</ThemedText>
      </ThemedView>
      <View style={{ gap: 12 }}>{children}</View>
    </ScrollView>
  );
}

function SubmitButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={[styles.button, disabled && { opacity: 0.5 }]}>
      <ThemedText
        onPress={!disabled ? onPress : undefined}
        style={styles.buttonText}
      >
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titleContainer: { marginBottom: 16 },
  formGroup: { gap: 6, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "600" },
});
