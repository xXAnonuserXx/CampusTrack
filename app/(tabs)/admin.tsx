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
import { Shield, Users, MapPin, Settings, ChartBar as BarChart3, TriangleAlert as AlertTriangle, Clock, Database, Eye, Power, Upload, Download } from 'lucide-react-native';

// Mock admin data
const adminStats = {
  totalUsers: 156,
  activeProfessors: 23,
  optInRate: 78,
  dataRetentionHours: 72,
  campusesManaged: 3,
  buildingsActive: 12,
};

const auditLogs = [
  {
    id: '1',
    action: 'Location Access',
    user: 'Student #4521',
    target: 'Dr. Maria Santos',
    timestamp: '2 minutes ago',
    building: 'Science Hall'
  },
  {
    id: '2',
    action: 'Privacy Settings Changed',
    user: 'Prof. Juan Cruz',
    target: 'Self',
    timestamp: '15 minutes ago',
    building: 'Main Building'
  },
  {
    id: '3',
    action: 'Data Export',
    user: 'Dr. Ana Rodriguez',
    target: 'Self',
    timestamp: '1 hour ago',
    building: 'Science Hall'
  },
];

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [dataRetention, setDataRetention] = useState(72);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const styles = createStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System management and governance</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* System Status */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>System Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: systemEnabled ? '#059669' : '#dc2626' }]}>
              <Text style={styles.statusText}>{systemEnabled ? 'Active' : 'Paused'}</Text>
            </View>
          </View>
          
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Campus-wide Location Sharing</Text>
              <Text style={styles.controlDescription}>
                Emergency kill switch for all location sharing
              </Text>
            </View>
            <Switch
              value={systemEnabled}
              onValueChange={setSystemEnabled}
              trackColor={{ false: '#dc2626', true: '#059669' }}
              thumbColor="#ffffff"
            />
          </View>

          {!systemEnabled && (
            <View style={styles.warningBanner}>
              <AlertTriangle size={20} color="#dc2626" />
              <Text style={styles.warningText}>
                Location sharing is disabled campus-wide. Students cannot see professor locations.
              </Text>
            </View>
          )}
        </View>

        {/* Statistics Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Platform Metrics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Users size={24} color="#2563eb" />
              <Text style={styles.statNumber}>{adminStats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            
            <View style={styles.statCard}>
              <MapPin size={24} color="#059669" />
              <Text style={styles.statNumber}>{adminStats.activeProfessors}</Text>
              <Text style={styles.statLabel}>Active Professors</Text>
            </View>
            
            <View style={styles.statCard}>
              <BarChart3 size={24} color="#d97706" />
              <Text style={styles.statNumber}>{adminStats.optInRate}%</Text>
              <Text style={styles.statLabel}>Opt-in Rate</Text>
            </View>
            
            <View style={styles.statCard}>
              <Database size={24} color="#7c3aed" />
              <Text style={styles.statNumber}>{adminStats.buildingsActive}</Text>
              <Text style={styles.statLabel}>Buildings</Text>
            </View>
          </View>
        </View>

        {/* Campus Management */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campus & Building Management</Text>
          
          <TouchableOpacity style={styles.actionRow}>
            <Upload size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Upload Campus GeoJSON</Text>
              <Text style={styles.actionDescription}>Add or update campus boundaries</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <MapPin size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Manage Building Footprints</Text>
              <Text style={styles.actionDescription}>Edit building polygons and IDs</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <Settings size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Multi-Campus Settings</Text>
              <Text style={styles.actionDescription}>Configure {adminStats.campusesManaged} campus locations</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy & Policy Controls</Text>
          
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Quiet Hours Mode</Text>
              <Text style={styles.controlDescription}>
                Disable location sharing during specified hours
              </Text>
            </View>
            <Switch
              value={quietHours}
              onValueChange={setQuietHours}
              trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View style={styles.retentionControl}>
            <Text style={styles.controlLabel}>Data Retention Period</Text>
            <Text style={styles.controlDescription}>
              Current: {dataRetention} hours maximum
            </Text>
            <View style={styles.retentionOptions}>
              {[24, 48, 72].map((hours) => (
                <TouchableOpacity
                  key={hours}
                  style={[
                    styles.retentionOption,
                    dataRetention === hours && styles.selectedRetention
                  ]}
                  onPress={() => setDataRetention(hours)}
                >
                  <Text style={[
                    styles.retentionText,
                    dataRetention === hours && styles.selectedRetentionText
                  ]}>
                    {hours}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Audit & Monitoring */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Audit & Access Logs</Text>
          
          <View style={styles.controlRow}>
            <View style={styles.controlInfo}>
              <Text style={styles.controlLabel}>Real-time Monitoring</Text>
              <Text style={styles.controlDescription}>
                Get alerts for policy violations and anomalies
              </Text>
            </View>
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.auditLogs}>
            <Text style={styles.sectionSubtitle}>Recent Activity</Text>
            {auditLogs.map((log) => (
              <View key={log.id} style={styles.logEntry}>
                <View style={styles.logHeader}>
                  <Text style={styles.logAction}>{log.action}</Text>
                  <Text style={styles.logTime}>{log.timestamp}</Text>
                </View>
                <Text style={styles.logDetails}>
                  {log.user} → {log.target} • {log.building}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Eye size={16} color="#2563eb" />
            <Text style={styles.viewAllText}>View Full Audit Log</Text>
          </TouchableOpacity>
        </View>

        {/* User Management */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User & Directory Management</Text>
          
          <TouchableOpacity style={styles.actionRow}>
            <Users size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Manage User Roster</Text>
              <Text style={styles.actionDescription}>Import from SIS, manage permissions</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <Settings size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Course Mappings</Text>
              <Text style={styles.actionDescription}>Link professors to courses and departments</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <Shield size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Role-Based Access Control</Text>
              <Text style={styles.actionDescription}>Configure visibility by department/role</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionRow}>
            <Download size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Export Platform Data</Text>
              <Text style={styles.actionDescription}>Generate compliance reports</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionRow}>
            <Database size={20} color="#2563eb" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Data Purge Settings</Text>
              <Text style={styles.actionDescription}>Configure automatic cleanup policies</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionRow, styles.dangerAction]}>
            <AlertTriangle size={20} color="#dc2626" />
            <View style={styles.actionInfo}>
              <Text style={[styles.actionLabel, { color: '#dc2626' }]}>Emergency Data Purge</Text>
              <Text style={styles.actionDescription}>Immediately delete all location data</Text>
            </View>
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
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 16,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#ffffff',
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
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#dc262610',
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#dc2626',
    },
    warningText: {
      fontSize: 14,
      color: '#dc2626',
      marginLeft: 8,
      flex: 1,
      lineHeight: 18,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: isDark ? '#374151' : '#f9fafb',
    },
    dangerAction: {
      backgroundColor: '#dc262610',
    },
    actionInfo: {
      flex: 1,
      marginLeft: 12,
    },
    actionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 2,
    },
    actionDescription: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    retentionControl: {
      marginTop: 16,
    },
    retentionOptions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    retentionOption: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    selectedRetention: {
      backgroundColor: '#2563eb',
    },
    retentionText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#4b5563',
    },
    selectedRetentionText: {
      color: '#ffffff',
    },
    auditLogs: {
      marginTop: 16,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
      marginBottom: 12,
    },
    logEntry: {
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    logAction: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
    },
    logTime: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    logDetails: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      paddingVertical: 8,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2563eb',
      marginLeft: 4,
    },
  });
}