import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface Building {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

interface CampusMapProps {
  onBuildingSelect?: (building: Building) => void;
}

export default function CampusMap({ onBuildingSelect }: CampusMapProps) {
  // For web platform, show a placeholder instead of native map
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <MapPin size={48} color="#666" />
        <Text style={styles.webTitle}>Campus Map</Text>
        <Text style={styles.webSubtitle}>
          Interactive map is available on mobile devices
        </Text>
      </View>
    );
  }

  // For native platforms, you would import and use react-native-maps here
  // For now, showing a placeholder for all platforms
  return (
    <View style={styles.container}>
      <MapPin size={48} color="#666" />
      <Text style={styles.title}>Campus Map</Text>
      <Text style={styles.subtitle}>
        Map functionality coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  webTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  webSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});