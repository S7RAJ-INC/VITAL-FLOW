import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
  primary: '#00d4ff',
  secondary: '#ff3358',
  background: '#f0f8ff',
  card: '#ffffff',
  text: '#1a1a2e',
  muted: '#666688',
  border: '#e0e8f0',
};

const introSteps = [
  {
    emoji: '💙',
    title: 'Welcome to Vital Flow',
    description: 'Your AI-powered mental wellness companion.',
  },
  {
    emoji: '📝',
    title: 'Daily Check-ins',
    description: 'Log your mood and feelings each day.',
  },
  {
    emoji: '🤖',
    title: 'AI-Powered Insights',
    description: 'Get personalized wellness recommendations.',
  },
  {
    emoji: '📊',
    title: 'Track Your Progress',
    description: 'View mood history and identify patterns.',
  },
];

const goals = [
  'Reduce stress & anxiety',
  'Improve mood stability',
  'Build healthy habits',
  'Better sleep quality',
  'Increase self-awareness',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    goal: '',
  });

  const showForm = step >= introSteps.length;

  const handleNext = async () => {
    if (step < introSteps.length) {
      setStep(step + 1);
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (!formData.age.trim()) {
      Alert.alert('Required', 'Please enter your age');
      return;
    }
    if (!formData.goal) {
      Alert.alert('Required', 'Please select a wellness goal');
      return;
    }

    setIsLoading(true);
    try {
      const profile = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        goal: formData.goal,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.dots}>
          {[...introSteps, 'form'].map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
            />
          ))}
        </View>

        {!showForm ? (
          <View style={styles.introBox}>
            <Text style={styles.emoji}>{introSteps[step].emoji}</Text>
            <Text style={styles.title}>{introSteps[step].title}</Text>
            <Text style={styles.desc}>{introSteps[step].description}</Text>
          </View>
        ) : (
          <View style={styles.formBox}>
            <Text style={styles.formTitle}>Personalize Your Experience</Text>

            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(t) => setFormData({ ...formData, name: t })}
            />

            <Text style={styles.label}>Your Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={formData.age}
              onChangeText={(t) => setFormData({ ...formData, age: t })}
            />

            <Text style={styles.label}>Wellness Goal</Text>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.goalBtn, formData.goal === g && styles.goalBtnActive]}
                onPress={() => setFormData({ ...formData, goal: g })}
              >
                <Text style={[styles.goalTxt, formData.goal === g && styles.goalTxtActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.btnRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Text style={styles.backTxt}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, step === 0 && { flex: 1 }]}
            onPress={handleNext}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextTxt}>{showForm ? 'Get Started' : 'Next'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ddd' },
  dotActive: { backgroundColor: colors.primary, width: 24 },
  dotDone: { backgroundColor: colors.primary },
  introBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emoji: { fontSize: 72, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 16, color: colors.muted, textAlign: 'center', lineHeight: 24 },
  formBox: { flex: 1 },
  formTitle: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16 },
  goalBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginTop: 8 },
  goalBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalTxt: { textAlign: 'center', color: colors.text },
  goalTxtActive: { color: '#fff', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 32 },
  backBtn: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 16, alignItems: 'center' },
  backTxt: { fontSize: 16, fontWeight: '600', color: colors.text },
  nextBtn: { flex: 2, backgroundColor: colors.primary, borderRadius: 10, padding: 16, alignItems: 'center' },
  nextTxt: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
