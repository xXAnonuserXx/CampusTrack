import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  useColorScheme 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Clock, Star, Filter, Heart } from 'lucide-react-native';

// Mock professors data
const professors = [
  {
    id: '1',
    name: 'Dr. Maria Santos',
    department: 'Computer Science',
    courses: ['CS 101', 'CS 301'],
    currentBuilding: 'Science Hall',
    status: 'Office Hours',
    lastSeen: '2 min ago',
    availability: 'available',
    isFavorite: true,
    officeHours: '2:00 PM - 4:00 PM',
  },
  {
    id: '2',
    name: 'Prof. Juan Cruz',
    department: 'Mathematics',
    courses: ['MATH 201', 'STAT 101'],
    currentBuilding: 'Main Building',
    status: 'In Class',
    lastSeen: '5 min ago',
    availability: 'busy',
    isFavorite: false,
    officeHours: '10:00 AM - 12:00 PM',
  },
  {
    id: '3',
    name: 'Dr. Ana Rodriguez',
    department: 'Physics',
    courses: ['PHYS 101', 'PHYS 202'],
    currentBuilding: 'Science Hall',
    status: 'Available',
    lastSeen: '1 min ago',
    availability: 'available',
    isFavorite: false,
    officeHours: '1:00 PM - 3:00 PM',
  },
  {
    id: '4',
    name: 'Prof. Roberto Dela Cruz',
    department: 'Engineering',
    courses: ['ENGR 301', 'MECH 101'],
    currentBuilding: 'Engineering Hall',
    status: 'Away',
    lastSeen: '15 min ago',
    availability: 'away',
    isFavorite: true,
    officeHours: '9:00 AM - 11:00 AM',
  },
  {
    id: '5',
    name: 'Dr. Lisa Gonzales',
    department: 'Chemistry',
    courses: ['CHEM 101', 'CHEM 301'],
    currentBuilding: 'Science Hall',
    status: 'Office Hours',
    lastSeen: '3 min ago',
    availability: 'available',
    isFavorite: false,
    officeHours: '3:00 PM - 5:00 PM',
  },
];

const filterOptions = ['All', 'Available', 'Office Hours', 'Favorites'];

export default function DirectoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [favorites, setFavorites] = useState(new Set(['1', '4']));

  const styles = createStyles(isDark);

  const toggleFavorite = (professorId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(professorId)) {
      newFavorites.delete(professorId);
    } else {
      newFavorites.add(professorId);
    }
    setFavorites(newFavorites);
  };

  const filteredProfessors = professors.filter((prof) => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.courses.some(course => course.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesFilter = true;
    switch (activeFilter) {
      case 'Available':
        matchesFilter = prof.availability === 'available';
        break;
      case 'Office Hours':
        matchesFilter = prof.status === 'Office Hours';
        break;
      case 'Favorites':
        matchesFilter = favorites.has(prof.id);
        break;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#059669';
      case 'busy': return '#d97706';
      case 'away': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Professor Directory</Text>
        <Text style={styles.subtitle}>{filteredProfessors.length} professors found</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, department, or course..."
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterTabText,
              activeFilter === filter && styles.activeFilterTabText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Professor List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredProfessors.map((professor) => (
          <View key={professor.id} style={styles.professorCard}>
            <View style={styles.cardHeader}>
              <View style={styles.professorInfo}>
                <Text style={styles.professorName}>{professor.name}</Text>
                <Text style={styles.department}>{professor.department}</Text>
                <Text style={styles.courses}>{professor.courses.join(' • ')}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(professor.id)}
              >
                <Heart 
                  size={20} 
                  color={favorites.has(professor.id) ? '#dc2626' : (isDark ? '#6b7280' : '#9ca3af')}
                  fill={favorites.has(professor.id) ? '#dc2626' : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.locationSection}>
              <View style={styles.locationInfo}>
                <MapPin size={16} color="#2563eb" />
                <Text style={styles.buildingText}>{professor.currentBuilding}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(professor.availability) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(professor.availability) }]}>
                    {professor.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.timeInfo}>
                <Clock size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={styles.lastSeenText}>{professor.lastSeen}</Text>
              </View>
            </View>

            <View style={styles.officeHours}>
              <Text style={styles.officeHoursLabel}>Office Hours:</Text>
              <Text style={styles.officeHoursTime}>{professor.officeHours}</Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredProfessors.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
            <Text style={styles.emptyStateTitle}>No professors found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
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
    searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#111827',
    },
    filterContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#e5e7eb',
    },
    filterContent: {
      paddingHorizontal: 20,
      gap: 8,
    },
    filterTab: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    activeFilterTab: {
      backgroundColor: '#2563eb',
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#4b5563',
    },
    activeFilterTabText: {
      color: '#ffffff',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    professorCard: {
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
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    professorInfo: {
      flex: 1,
    },
    professorName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 4,
    },
    department: {
      fontSize: 14,
      color: '#2563eb',
      fontWeight: '600',
      marginBottom: 4,
    },
    courses: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    favoriteButton: {
      padding: 8,
    },
    locationSection: {
      marginBottom: 12,
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    buildingText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
      marginLeft: 6,
      marginRight: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    timeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    lastSeenText: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginLeft: 4,
    },
    officeHours: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#e5e7eb',
    },
    officeHoursLabel: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginRight: 8,
    },
    officeHoursTime: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
    },
    cardActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: '#2563eb',
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#4b5563',
    },
    primaryButtonText: {
      color: '#ffffff',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
      lineHeight: 20,
    },
  });
}