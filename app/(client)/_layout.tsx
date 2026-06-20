import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/constants/theme';

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="select-service"
        options={{ href: null, headerShown: true, title: 'Select Service' }}
      />
      <Tabs.Screen
        name="post-job"
        options={{ href: null, headerShown: true, title: 'Post a Job' }}
      />
      <Tabs.Screen
        name="choose-provider"
        options={{ href: null, headerShown: true, title: 'Choose Provider' }}
      />
      <Tabs.Screen
        name="confirm-booking"
        options={{ href: null, headerShown: true, title: 'Confirm Booking' }}
      />
    </Tabs>
  );
}
