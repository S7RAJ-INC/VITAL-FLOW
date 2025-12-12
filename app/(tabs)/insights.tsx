import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getCheckIns, getUserProfile, clearAllData } from '../../utils/storage';
import { analyzeMoodPatterns } from '../../utils/aiService';

const palette = {
  primary: '#00b8ff',
  background: '#0b1220',
  card: '#0f1f35',
  cardAlt: '#122742',
  text: '#f5f7fb',
  muted: '#9bb6d1',
  accentRed: '#ff4d67',
};

export default function InsightsScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkInsCount, setCheckInsCount] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profile = await getUserProfile();
      setUserName(profile?.name || 'Friend');

      const checkIns = await getCheckIns();
      setCheckInsCount(checkIns.length);

      // Generate insights regardless of check-in count
      if (checkIns.length > 0) {
        await generateInsights(checkIns, profile?.name || 'Friend');
      } else {
        // Show default insights for new users
        setInsights("Welcome to your wellness journey! Start by completing your first daily check-in. Regular tracking helps identify patterns in your mood and provides personalized recommendations. Take a moment each day to reflect on how you're feeling.");
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const generateInsights = async (checkIns: any, name: string) => {
    setIsLoading(true);
    try {
      const response = await analyzeMoodPatterns(checkIns, name);

      if (response.success) {
        setInsights(response.text);
      } else {
        setInsights('Your wellness journey is unique. Keep tracking your mood to unlock personalized AI insights!');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Keep tracking your daily mood to get personalized recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    const checkIns = await getCheckIns();
    if (checkIns.length > 0) {
      await generateInsights(checkIns, userName);
    } else {
      setInsights("Start your wellness journey by completing your first check-in today!");
    }
  };

  // Add new user function
  const handleAddNewUser = () => {
    Alert.alert(
      'Add New User',
      'This will create a new user profile. The current user data will be cleared. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add New User',
          style: 'default',
          onPress: async () => {
            try {
              await clearAllData();
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to switch user. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Wellness Journey</Text>
          <Text style={styles.headerSubtitle}>
            {userName}, here's what your data tells us
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} disabled={isLoading}>
          <Text style={styles.refreshButton}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* AI Insights Card */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Analyzing your wellness patterns...</Text>
        </View>
      ) : (
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightTitle}>🤖 AI Analysis</Text>
          </View>
          <Text style={styles.insightContent}>{insights}</Text>
        </View>
      )}

      {/* Wellness Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness Tips</Text>
        {tipsData.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <Text style={styles.tipEmoji}>{tip.emoji}</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Facts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Facts</Text>
        <View style={styles.factsContainer}>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>💬</Text>
            <Text style={styles.factValue}>Journal</Text>
            <Text style={styles.factDesc}>Share regularly</Text>
          </View>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>📈</Text>
            <Text style={styles.factValue}>Track</Text>
            <Text style={styles.factDesc}>See patterns</Text>
          </View>
          <View style={styles.factBox}>
            <Text style={styles.factLabel}>🎯</Text>
            <Text style={styles.factValue}>Goals</Text>
            <Text style={styles.factDesc}>Stay focused</Text>
          </View>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use Vital Flow</Text>
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Daily Check-in</Text>
            <Text style={styles.stepDescription}>Rate your mood and share what's on your mind</Text>
          </View>
        </View>
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Get AI Insight</Text>
            <Text style={styles.stepDescription}>Receive personalized wellness recommendations</Text>
          </View>
        </View>
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review History</Text>
            <Text style={styles.stepDescription}>Track your mood trends and celebrate progress</Text>
          </View>
        </View>
      </View>

      {/* Add New User Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.addUserCard} onPress={handleAddNewUser}>
          <Text style={styles.addUserEmoji}>👤➕</Text>
          <View style={styles.addUserContent}>
            <Text style={styles.addUserTitle}>Add New User</Text>
            <Text style={styles.addUserDesc}>Register another person on this device</Text>
          </View>
          <Text style={styles.addUserArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const tipsData = [
  {
    emoji: '💧',
    title: 'Stay Hydrated',
    description: 'Drink plenty of water throughout the day. Dehydration can affect mood.',
  },
  {
    emoji: '😴',
    title: 'Prioritize Sleep',
    description: 'Aim for 7-9 hours of quality sleep each night for optimal mental health.',
  },
  {
    emoji: '🚶',
    title: 'Move Your Body',
    description: 'Exercise releases endorphins. Even a 10-minute walk can boost your mood.',
  },
  {
    emoji: '🧘',
    title: 'Practice Mindfulness',
    description: 'Spend 5 minutes daily on breathing exercises or meditation.',
  },
  {
    emoji: '👥',
    title: 'Connect with Others',
    description: 'Social connection is vital for mental wellbeing. Reach out to someone today.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: palette.muted,
  },
  refreshButton: {
    fontSize: 24,
  },
  loadingContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: palette.muted,
  },
  insightCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: palette.cardAlt,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
  },
  insightHeader: {
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.primary,
  },
  insightContent: {
    fontSize: 14,
    color: palette.text,
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 16,
  },
  factsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  factBox: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  factLabel: {
    fontSize: 24,
    marginBottom: 8,
  },
  factValue: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 2,
  },
  factDesc: {
    fontSize: 11,
    color: palette.muted,
    textAlign: 'center',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: palette.cardAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0b1220',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 16,
  },
  addUserCard: {
    flexDirection: 'row',
    backgroundColor: palette.accentRed,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  addUserEmoji: {
    fontSize: 24,
  },
  addUserContent: {
    flex: 1,
  },
  addUserTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  addUserDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  addUserArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
});
