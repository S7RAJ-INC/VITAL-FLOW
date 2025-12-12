import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { saveCheckIn, getTodayCheckIn, getCheckIns, getUserProfile } from '../../utils/storage';
import { generateWellnessInsight } from '../../utils/aiService';

const palette = {
  primary: '#00b8ff',
  background: '#0b1220',
  card: '#0f1f35',
  cardAlt: '#122742',
  text: '#f5f7fb',
  muted: '#9bb6d1',
  accentRed: '#ff4d67',
};

export default function CheckinScreen() {
  const [mood, setMood] = useState(5);
  const [journal, setJournal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    checkTodayEntry();
  }, []);

  const checkTodayEntry = async () => {
    const todayEntry = await getTodayCheckIn();
    if (todayEntry) {
      setMood(todayEntry.mood);
      setJournal(todayEntry.journal);
      setAiInsight(todayEntry.aiInsight || '');
      setHasCheckedIn(true);
      setShowInsight(!!todayEntry.aiInsight);
    }
  };

  const generateInsight = async () => {
    if (!journal.trim()) {
      Alert.alert('Please write something in your journal entry first');
      return;
    }

    setIsLoading(true);
    try {
      const checkIns = await getCheckIns();
      const previousMoods = checkIns.slice(0, 7).map(ci => ci.mood);
      const profile = await getUserProfile();

      const response = await generateWellnessInsight(
        mood,
        journal,
        profile?.goal || 'Better wellbeing',
        previousMoods
      );

      if (response.success) {
        setAiInsight(response.text);
        setShowInsight(true);
      } else {
        Alert.alert('Failed to generate insight', response.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI insight');
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCheckInEntry = async () => {
    if (!journal.trim()) {
      Alert.alert('Please write something in your journal entry');
      return;
    }

    setIsLoading(true);
    try {
      const checkInData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        mood,
        journal,
        aiInsight,
        timestamp: Date.now(),
      };

      await saveCheckIn(checkInData);
      setHasCheckedIn(true);
      Alert.alert('Success', 'Your check-in has been saved! 🎉');
    } catch (error) {
      Alert.alert('Error', 'Failed to save check-in');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const moodEmojis = ['😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😃', '😁', '🤩'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status */}
      {hasCheckedIn && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ You've checked in today</Text>
        </View>
      )}

      {/* Mood Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>

        <View style={styles.moodContainer}>
          <View style={styles.moodDisplay}>
            <Text style={styles.moodEmoji}>{moodEmojis[mood - 1]}</Text>
            <Text style={styles.moodText}>{mood}/10</Text>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.sliderDot,
                value === mood && styles.sliderDotActive,
              ]}
              onPress={() => setMood(value)}
            >
              <Text style={styles.sliderLabel}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.moodLabels}>
          <Text style={styles.moodLabel}>Not well</Text>
          <Text style={styles.moodLabel}>Excellent</Text>
        </View>
      </View>

      {/* Journal Entry */}
      <View style={styles.section}>
        <View style={styles.journalHeader}>
          <Text style={styles.sectionTitle}>What's on your mind?</Text>
          <Text style={styles.helperText}>
            {journal.length}/500
          </Text>
        </View>

        <TextInput
          style={styles.journalInput}
          placeholder="Share your thoughts, what happened today, what you're grateful for..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          value={journal}
          onChangeText={setJournal}
          maxLength={500}
          editable={!hasCheckedIn}
        />
      </View>

      {/* AI Insight Section */}
      {showInsight && aiInsight && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 AI Wellness Insight</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>{aiInsight}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!showInsight && !hasCheckedIn && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={generateInsight}
            disabled={isLoading || !journal.trim()}
          >
            <Text style={styles.secondaryButtonText}>
              {isLoading ? '✨ Generating...' : '✨ Get AI Insight'}
            </Text>
          </TouchableOpacity>
        )}

        {!hasCheckedIn && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={saveCheckInEntry}
            disabled={isLoading || !journal.trim()}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Saving...' : 'Save Check-in'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: 16,
  },
  successBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#102a3d',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
  },
  successText: {
    color: palette.text,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 16,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  moodDisplay: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.primary,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1b2e4a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27436b',
  },
  sliderDotActive: {
    backgroundColor: palette.primary,
  },
  sliderLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.text,
  },
  moodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodLabel: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '500',
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    color: palette.muted,
  },
  journalInput: {
    backgroundColor: palette.cardAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1b2e4a',
    padding: 16,
    fontSize: 15,
    color: palette.text,
    textAlignVertical: 'top',
  },
  insightCard: {
    backgroundColor: '#122742',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
  },
  insightText: {
    fontSize: 14,
    color: palette.text,
    lineHeight: 20,
  },
  buttonContainer: {
    marginHorizontal: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: palette.primary,
  },
  secondaryButton: {
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  primaryButtonText: {
    color: '#0b1220',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
