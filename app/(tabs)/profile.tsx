import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  useColorScheme 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Clock, Settings, Shield, Eye, EyeOff, Pause, Play, Calendar, Building, TriangleAlert as AlertTriangle } from 'lucide-react-native';

// Mock user data
const userProfile = {
  name: 'Dr. Maria Santos',
  email: 'maria.santos@prmsu.edu.ph',
  department: 'Computer Science',
  courses: ['CS 101 - Intro to Programming', 'CS 301 - Data Structures'],
  officeHours: [
    { day: 'Monday', time: '2:00 PM - 4:00 PM' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM' },
    { day: 'Friday', time: '10:00 AM - 12:00 PM' },
  ],
  currentBuilding: 'Science Hall',
  currentStatus: 'Office Hours',
  role: 'professor'
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isLocationSharing, setIsLocationSharing] = useState(true);
  const [sharingGranularity, setSharingGranularity] = useState('building'); // 'building' or 'campus'
  const [autoShare, setAutoShare] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Office Hours');
  const [isPaused, setIsPaused] = useState(false);

  const styles = createStyles(isDark);

  const statusPresets = [
    'Office Hours',
    'In Class',
    'Available',
    'Away',
    'Busy - Do Not Disturb'
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile & Privacy</Text>
        <Text style={styles.subtitle}>Manage your location sharing preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <User size={32} color="#ffffff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
              <Text style={styles.userDepartment}>{userProfile.department}</Text>
            </View>
          </View>
          
          <View style={styles.coursesList}>
            <Text style={styles.sectionTitle}>Teaching:</Text>
            {userProfile.courses.map((course, index) => (
              <Text key={index} style={styles.courseItem}>• {course}</Text>
            ))}
          </View>
        </View>

        {/* Location Sharing Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Sharing</Text>
          
          {/* Main Toggle */}
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Share Location</Text>
              <Text style={styles.controlDescription}>
                Allow students to see your campus presence
              </Text>
            </View>
            <Switch
              value={isLocationSharing}
              onValueChange={setIsLocationSharing}
              trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Pause/Resume Button */}
          {isLocationSharing && (
            <TouchableOpacity 
              style={[styles.pauseButton, isPaused && styles.resumeButton]}
              onPress={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play size={20} color="#ffffff" /> : <Pause size={20} color="#ffffff" />}
              <Text style={styles.pauseButtonText}>
                {isPaused ? 'Resume Sharing' : 'Pause Sharing'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Granularity Settings */}
          {isLocationSharing && !isPaused && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionSubtitle}>Sharing Level</Text>
              
              <TouchableOpacity 
                style={[styles.optionRow, sharingGranularity === 'building' && styles.selectedOption]}
                onPress={() => setSharingGranularity('building')}
              >
                <Building size={20} color="#2563eb" />
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Building Level (Recommended)</Text>
                  <Text style={styles.optionDescription}>Share specific building location</Text>
                </View>
                <View style={[styles.radioButton, sharingGranularity === 'building' && styles.radioSelected]} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.optionRow, sharingGranularity === 'campus' && styles.selectedOption]}
                onPress={() => setSharingGranularity('campus')}
              >
                <MapPin size={20} color="#2563eb" />
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Campus Only</Text>
                  <Text style={styles.optionDescription}>Show as "On campus" without building</Text>
                </View>
                <View style={[styles.radioButton, sharingGranularity === 'campus' && styles.radioSelected]} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Current Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status</Text>
          
          <View style={styles.statusDisplay}>
            <MapPin size={16} color="#2563eb" />
            <Text style={styles.statusLocation}>{userProfile.currentBuilding}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          </View>

          <Text style={styles.sectionSubtitle}>Quick Status Presets</Text>
          <View style={styles.statusPresets}>
            {statusPresets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.presetButton,
                  statusMessage === preset && styles.activePreset
                ]}
                onPress={() => setStatusMessage(preset)}
              >
                <Text style={[
                  styles.presetText,
                  statusMessage === preset && styles.activePresetText
                ]}>
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Office Hours */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Office Hours</Text>
            <TouchableOpacity>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Auto-share during office hours</Text>
              <Text style={styles.controlDescription}>
                Automatically enable location sharing during scheduled office hours
              </Text>
            </View>
            <Switch
              value={autoShare}
              onValueChange={setAutoShare}
              trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.officeHoursList}>
            {userProfile.officeHours.map((schedule, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Calendar size={16} color="#2563eb" />
                <Text style={styles.scheduleDay}>{schedule.day}</Text>
                <Text style={styles.scheduleTime}>{schedule.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy & Data</Text>
          
          <TouchableOpacity style={styles.privacyRow}>
            <Eye size={20} color="#2563eb" />
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>View Access Log</Text>
              <Text style={styles.privacyDescription}>See who viewed your location</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.privacyRow}>
            <Shield size={20} color="#2563eb" />
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>Privacy Settings</Text>
              <Text style={styles.privacyDescription}>Manage data retention and visibility</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.privacyRow}>
            <AlertTriangle size={20} color="#dc2626" />
            <View style={styles.privacyInfo}>
              <Text style={[styles.privacyLabel, { color: '#dc2626' }]}>Revoke All Consent</Text>
              <Text style={styles.privacyDescription}>Stop all location sharing permanently</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Export */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Export My Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Delete All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    card: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 60,
      height: 60,
      backgroundColor: '#2563eb',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: 2,
    },
    userDepartment: {
      fontSize: 14,
      color: '#2563eb',
      fontWeight: '600',
    },
    coursesList: {
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#e5e7eb',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
      marginBottom: 8,
    },
    courseItem: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: 4,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 16,
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    controlInfo: {
      flex: 1,
      marginRight: 16,
    },
    controlLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 2,
    },
    controlDescription: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 18,
    },
    pauseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#dc2626',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    resumeButton: {
      backgroundColor: '#059669',
    },
    pauseButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      marginLeft: 8,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#374151' : '#e5e7eb',
      marginVertical: 16,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
      marginBottom: 12,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedOption: {
      backgroundColor: isDark ? '#1e3a8a20' : '#2563eb10',
    },
    optionInfo: {
      flex: 1,
      marginLeft: 12,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: isDark ? '#6b7280' : '#9ca3af',
    },
    radioSelected: {
      borderColor: '#2563eb',
      backgroundColor: '#2563eb',
    },
    statusDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    statusLocation: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
      marginLeft: 8,
      marginRight: 12,
    },
    statusBadge: {
      backgroundColor: '#059669',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    statusPresets: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    presetButton: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      marginBottom: 8,
    },
    activePreset: {
      backgroundColor: '#2563eb',
    },
    presetText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#4b5563',
    },
    activePresetText: {
      color: '#ffffff',
    },
    editLink: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2563eb',
    },
    officeHoursList: {
      marginTop: 12,
    },
    scheduleItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    scheduleDay: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginLeft: 8,
      minWidth: 80,
    },
    scheduleTime: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginLeft: 8,
    },
    privacyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    privacyInfo: {
      flex: 1,
      marginLeft: 12,
    },
    privacyLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 2,
    },
    privacyDescription: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    actionButton: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 8,
    },
    dangerButton: {
      backgroundColor: '#dc262620',
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#4b5563',
    },
    dangerButtonText: {
      color: '#dc2626',
    },
  });
}