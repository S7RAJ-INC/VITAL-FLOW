import React from 'react';
import { Tabs, Link } from 'expo-router';
import { StyleSheet, Pressable, Text } from 'react-native';

const palette = {
  primary: '#00d4ff', // neon blue
  accentRed: '#ff3358', // health red
  background: '#ffffff',
  card: '#f5fbff',
  text: '#0a1020',
  muted: '#7b8ba5',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTintColor: palette.primary,
        headerTitleStyle: styles.headerTitle,
        headerRight: () => (
          <Link href="/(tabs)/insights" asChild>
            <Pressable style={styles.chatButton}>
              <Text style={styles.chatButtonText}>🤖</Text>
            </Pressable>
          </Link>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerTitle: 'Vital Flow',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />

      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check In',
          tabBarLabel: 'Check In',
          headerTitle: 'Daily Check-in',
          tabBarIcon: ({ color }) => <TabIcon icon="⛑️" color={color} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          headerTitle: 'Mood History',
          tabBarIcon: ({ color }) => <TabIcon icon="📈" color={color} />,
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarLabel: 'Chatbot',
          headerTitle: 'AI Chatbot',
          tabBarIcon: ({ color }) => <TabIcon icon="🤖" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return <Text style={{ color, fontSize: 18 }}>{icon}</Text>;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.card,
    borderTopColor: '#d0e8ff',
    borderTopWidth: 1,
    paddingBottom: 8,
    height: 60,
  },
  header: {
    backgroundColor: palette.background,
    borderBottomColor: '#d0e8ff',
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
  },
  chatButton: {
    backgroundColor: palette.accentRed,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
