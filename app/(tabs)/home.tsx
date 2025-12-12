import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { getUserProfile, getTodayCheckIn, getCheckIns, CheckIn, UserProfile } from '../../utils/storage';

const palette = {
  primary: '#00d4ff', // neon blue
  accentRed: '#ff3358',
  background: '#f9fbff',
  card: '#ffffff',
  cardAlt: '#f0f7ff',
  text: '#0a1020',
  muted: '#51607a',
  border: '#d7eaff',
};

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckIn | null>(null);
  const [allCheckIns, setAllCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);

      const todayEntry = await getTodayCheckIn();
      setTodayCheckIn(todayEntry);

      const checkIns = await getCheckIns();
      setAllCheckIns(checkIns);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  const averageMood = allCheckIns.length > 0
    ? (allCheckIns.reduce((sum, ci) => sum + ci.mood, 0) / allCheckIns.length).toFixed(1)
    : '0';

  const streak = calculateStreak(allCheckIns);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.greeting}>
          Hello, {profile?.name || 'Friend'}! ❤️
        </Text>
        <Text style={styles.goal}>
          Goal: {profile?.goal || 'Improve wellbeing'}
        </Text>
        <View style={styles.healthBadge}>
          <Text style={styles.healthBadgeText}>⛑️ Health-first</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak ⛑️</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{allCheckIns.length}</Text>
          <Text style={styles.statLabel}>Total Check-ins ❤️</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{averageMood}</Text>
          <Text style={styles.statLabel}>Avg Mood 💙</Text>
        </View>
      </View>

      {/* Today's Check-in Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Mood</Text>
          <Link href="/(tabs)/checkin" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Update</Text>
            </TouchableOpacity>
          </Link>
        </View>
        {todayCheckIn ? (
          <View style={styles.checkInCard}>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodValue}>{todayCheckIn.mood}</Text>
              <Text style={styles.moodLabel}>/10</Text>
            </View>
            <View style={styles.checkInContent}>
              <Text style={styles.journalPreview} numberOfLines={2}>
                {todayCheckIn.journal}
              </Text>
              {todayCheckIn.aiInsight && (
                <View style={styles.insightBox}>
                  <Text style={styles.insightLabel}>AI Insight:</Text>
                  <Text style={styles.insightText} numberOfLines={2}>
                    {todayCheckIn.aiInsight}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No check-in yet today</Text>
            <Text style={styles.emptyStateSubtext}>
              Take a moment to reflect on how you're feeling
            </Text>
          </View>
        )}
      </View>

      {/* Recent Entries */}
      {allCheckIns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <Link href="/(tabs)/history" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {allCheckIns.slice(0, 3).map(checkIn => (
            <View key={checkIn.id} style={styles.entryItem}>
              <View style={styles.entryDate}>
                <Text style={styles.entryDateText}>{formatDate(checkIn.date)}</Text>
              </View>
              <View style={styles.entryMood}>
                <Text style={styles.entryMoodValue}>{checkIn.mood}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <Link href="/(tabs)/insights" asChild>
        <TouchableOpacity style={styles.chatbotButton}>
          <Text style={styles.chatbotIcon}>🤖</Text>
          <Text style={styles.chatbotLabel}>Chatbot</Text>
        </TouchableOpacity>
      </Link>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function calculateStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const exists = checkIns.some(ci => ci.date === dateStr);

    if (exists) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (i === 0) {
      break;
    } else {
      break;
    }
  }

  return streak;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  welcomeCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    backgroundColor: palette.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#001d2d',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
  },
  goal: {
    fontSize: 14,
    color: palette.muted,
  },
  healthBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#ffe7ed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc7d4',
  },
  healthBadgeText: {
    color: palette.accentRed,
    fontWeight: '700',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: palette.muted,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  seeAll: {
    fontSize: 12,
    color: palette.primary,
    fontWeight: '700',
  },
  checkInCard: {
    flexDirection: 'row',
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  moodDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  moodValue: {
    fontSize: 36,
    fontWeight: '700',
    color: palette.accentRed,
  },
  moodLabel: {
    fontSize: 12,
    color: palette.muted,
  },
  checkInContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  journalPreview: {
    fontSize: 13,
    color: palette.text,
    lineHeight: 18,
  },
  insightBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: palette.muted,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: palette.primary,
    lineHeight: 16,
  },
  emptyState: {
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: palette.card,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  entryDate: {
    flex: 1,
  },
  entryDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.text,
  },
  entryMood: {
    backgroundColor: palette.cardAlt,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  entryMoodValue: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.primary,
  },
  chatbotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignSelf: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#b8f1ff',
    shadowColor: '#00a5d6',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  chatbotIcon: {
    fontSize: 18,
  },
  chatbotLabel: {
    color: '#0a1020',
    fontWeight: '700',
    fontSize: 14,
  },
});
