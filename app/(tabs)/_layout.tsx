import { Tabs } from 'expo-router';
import { MapPin, Users, User, Settings } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const tabBarActiveTintColor = '#2563eb';
  const tabBarInactiveTintColor = colorScheme === 'dark' ? '#9ca3af' : '#6b7280';
  const tabBarStyle = {
    backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
    borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
    height: 85,
    paddingTop: 8,
    paddingBottom: 32,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'Directory',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}