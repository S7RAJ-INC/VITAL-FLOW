import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getCheckIns, deleteCheckIn, CheckIn } from '../../utils/storage';

const palette = {
  primary: '#00b8ff',
  background: '#0b1220',
  card: '#0f1f35',
  cardAlt: '#122742',
  text: '#f5f7fb',
  muted: '#9bb6d1',
  accentRed: '#ff4d67',
};

export default function HistoryScreen() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCheckIns();
  }, []);

  const loadCheckIns = async () => {
    try {
      const data = await getCheckIns();
      setCheckIns(data);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCheckIn(id);
      setCheckIns(checkIns.filter(ci => ci.id !== id));
    } catch (error) {
      console.error('Error deleting check-in:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (checkIns.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptyText}>
            Start tracking your mood by creating your first check-in
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stats Summary */}
      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{checkIns.length}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {(checkIns.reduce((sum, ci) => sum + ci.mood, 0) / checkIns.length).toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Average Mood</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{Math.max(...checkIns.map(ci => ci.mood))}</Text>
          <Text style={styles.statLabel}>Best Mood</Text>
        </View>
      </View>

      {/* Mood Trend Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Trend</Text>
        <View style={styles.chartContainer}>
          {checkIns.slice(0, 7).reverse().map((checkIn, index) => {
            const height = (checkIn.mood / 10) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: getMoodColor(checkIn.mood),
                    },
                  ]}
                />
                <Text style={styles.barLabel}>
                  {formatDateShort(checkIn.date)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Check-in List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Entries</Text>
        {checkIns.map((checkIn) => (
          <View key={checkIn.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{formatFullDate(checkIn.date)}</Text>
              <TouchableOpacity onPress={() => handleDelete(checkIn.id)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.entryBody}>
              <View
                style={[
                  styles.moodBadge,
                  { backgroundColor: getMoodColor(checkIn.mood) },
                ]}
              >
                <Text style={styles.moodBadgeText}>{checkIn.mood}/10</Text>
              </View>

              <View style={styles.entryContent}>
                <Text style={styles.journalText} numberOfLines={3}>
                  {checkIn.journal}
                </Text>
              </View>
            </View>

            {checkIn.aiInsight && (
              <View style={styles.insightSection}>
                <Text style={styles.insightLabel}>AI Insight:</Text>
                <Text style={styles.insightText} numberOfLines={2}>
                  {checkIn.aiInsight}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function getMoodColor(mood: number): string {
  if (mood <= 3) return '#ff6b6b'; // Red
  if (mood <= 5) return '#ffd93d'; // Yellow
  if (mood <= 7) return '#6bcf7f'; // Light green
  return '#4ecdc4'; // Teal
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: palette.cardAlt,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  statValue: {
    fontSize: 22,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 160,
    backgroundColor: palette.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    color: palette.muted,
  },
  entryCard: {
    backgroundColor: palette.cardAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1b2e4a',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  deleteButton: {
    fontSize: 16,
  },
  entryBody: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  moodBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  entryContent: {
    flex: 1,
  },
  journalText: {
    fontSize: 13,
    color: palette.text,
    lineHeight: 18,
  },
  insightSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1b2e4a',
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
});
