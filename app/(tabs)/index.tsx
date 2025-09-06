import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Users, Clock, Wifi } from 'lucide-react-native';
import CampusMap from '@/components/CampusMap';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>PRMSU — Iba Main</Text>
          <View style={styles.statusIndicator}>
            <Wifi size={16} color="#059669" />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Campus Map • 11 professors sharing location</Text>
      </View>

      {/* Interactive Campus Map */}
      <View style={styles.mapContainer}>
        <CampusMap 
          isDark={isDark}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={setSelectedBuilding}
        />
      </View>

      <ScrollView style={styles.bottomContent} showsVerticalScrollIndicator={false}>
        {/* Building Details */}
        {selectedBuilding && (
          <View style={styles.buildingDetails}>
            <Text style={styles.buildingName}>{selectedBuilding.name}</Text>
            <View style={styles.buildingStats}>
              <View style={styles.statItem}>
                <Users size={16} color="#2563eb" />
                <Text style={styles.statText}>
                  {selectedBuilding.professors.length} professor{selectedBuilding.professors.length !== 1 ? 's' : ''} present
                </Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.statText}>Updated 2 minutes ago</Text>
              </View>
            </View>
            
            {/* Professor List */}
            <View style={styles.professorList}>
              {selectedBuilding.professors.map((professor) => (
                <View key={professor.id} style={styles.professorItem}>
                  <Text style={styles.professorName}>{professor.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(professor.status) + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(professor.status) }]}>
                      {professor.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.buttonText}>View Professor List</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>11</Text>
              <Text style={styles.statLabel}>Professors Online</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Buildings Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Office Hours Now</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>Fresh</Text>
              <Text style={styles.statLabel}>Data Status</Text>
            </View>
          </View>
        </View>

        {/* Campus Info */}
        <View style={styles.campusInfo}>
          <Text style={styles.sectionTitle}>Campus Information</Text>
          <View style={styles.infoCard}>
            <MapPin size={20} color="#2563eb" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>PRMSU — Iba Main Campus</Text>
              <Text style={styles.infoDescription}>
                President Ramon Magsaysay State University
              </Text>
              <Text style={styles.infoAddress}>
                Iba, Zambales, Philippines
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Office Hours': return '#059669';
    case 'Available': return '#2563eb';
    case 'In Class': return '#d97706';
    case 'Away': return '#6b7280';
    case 'Busy': return '#dc2626';
    default: return '#6b7280';
  }
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#f9fafb',
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#e5e7eb',
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#064e3b' : '#dcfce7',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#059669',
      marginLeft: 4,
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    mapContainer: {
      flex: 1,
      margin: 16,
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    bottomContent: {
      flex: 1,
      maxHeight: 400,
    },
    buildingDetails: {
      margin: 20,
      marginTop: 0,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 16,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buildingName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 12,
    },
    buildingStats: {
      marginBottom: 16,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    statText: {
      fontSize: 14,
      color: isDark ? '#d1d5db' : '#4b5563',
      marginLeft: 8,
    },
    professorList: {
      marginBottom: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#e5e7eb',
    },
    professorItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    professorName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },
    viewDetailsButton: {
      backgroundColor: '#2563eb',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
    },
    quickStats: {
      margin: 20,
      marginTop: 0,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: 150,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: '700',
      color: '#2563eb',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
    },
    campusInfo: {
      margin: 20,
      marginTop: 0,
    },
    infoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    infoContent: {
      flex: 1,
      marginRight: 12,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 4,
    },
    infoDescription: {
      fontSize: 14,
      color: isDark ? '#d1d5db' : '#4b5563',
      marginBottom: 4,
    },
    infoAddress: {
      fontSize: 14,
      color: isDark ? '#d1d5db' : '#4b5563',
    },
  });
}