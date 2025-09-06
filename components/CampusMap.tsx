import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Users, Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// PRMSU - Iba Main Campus coordinates (Zambales, Philippines)
const CAMPUS_CENTER = {
  latitude: 15.3347,
  longitude: 119.9778,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

// Campus boundary polygon (approximate PRMSU - Iba Main)
const CAMPUS_BOUNDARY = [
  { latitude: 15.3380, longitude: 119.9750 },
  { latitude: 15.3380, longitude: 119.9810 },
  { latitude: 15.3310, longitude: 119.9810 },
  { latitude: 15.3310, longitude: 119.9750 },
];

// Building footprints with real coordinates
const BUILDINGS = [
  {
    id: 'main_building',
    name: 'Main Building',
    coordinates: [
      { latitude: 15.3350, longitude: 119.9770 },
      { latitude: 15.3355, longitude: 119.9770 },
      { latitude: 15.3355, longitude: 119.9780 },
      { latitude: 15.3350, longitude: 119.9780 },
    ],
    center: { latitude: 15.3352, longitude: 119.9775 },
    professors: [
      { id: '1', name: 'Dr. Maria Santos', status: 'Office Hours' },
      { id: '2', name: 'Prof. Juan Cruz', status: 'In Class' },
      { id: '3', name: 'Dr. Ana Rodriguez', status: 'Available' },
    ],
  },
  {
    id: 'science_hall',
    name: 'Science Hall',
    coordinates: [
      { latitude: 15.3360, longitude: 119.9785 },
      { latitude: 15.3365, longitude: 119.9785 },
      { latitude: 15.3365, longitude: 119.9795 },
      { latitude: 15.3360, longitude: 119.9795 },
    ],
    center: { latitude: 15.3362, longitude: 119.9790 },
    professors: [
      { id: '4', name: 'Dr. Lisa Gonzales', status: 'Office Hours' },
      { id: '5', name: 'Prof. Roberto Dela Cruz', status: 'Available' },
    ],
  },
  {
    id: 'library',
    name: 'Library',
    coordinates: [
      { latitude: 15.3340, longitude: 119.9785 },
      { latitude: 15.3345, longitude: 119.9785 },
      { latitude: 15.3345, longitude: 119.9795 },
      { latitude: 15.3340, longitude: 119.9795 },
    ],
    center: { latitude: 15.3342, longitude: 119.9790 },
    professors: [
      { id: '6', name: 'Prof. Carmen Reyes', status: 'Away' },
    ],
  },
  {
    id: 'admin_building',
    name: 'Admin Building',
    coordinates: [
      { latitude: 15.3335, longitude: 119.9760 },
      { latitude: 15.3340, longitude: 119.9760 },
      { latitude: 15.3340, longitude: 119.9770 },
      { latitude: 15.3335, longitude: 119.9770 },
    ],
    center: { latitude: 15.3337, longitude: 119.9765 },
    professors: [
      { id: '7', name: 'Dr. Miguel Torres', status: 'Busy' },
      { id: '8', name: 'Prof. Elena Valdez', status: 'Available' },
    ],
  },
  {
    id: 'engineering_hall',
    name: 'Engineering Hall',
    coordinates: [
      { latitude: 15.3365, longitude: 119.9760 },
      { latitude: 15.3370, longitude: 119.9760 },
      { latitude: 15.3370, longitude: 119.9770 },
      { latitude: 15.3365, longitude: 119.9770 },
    ],
    center: { latitude: 15.3367, longitude: 119.9765 },
    professors: [
      { id: '9', name: 'Engr. Carlos Mendoza', status: 'In Class' },
      { id: '10', name: 'Prof. Sofia Ramos', status: 'Office Hours' },
      { id: '11', name: 'Dr. Antonio Cruz', status: 'Available' },
    ],
  },
];

interface CampusMapProps {
  isDark: boolean;
  onBuildingSelect?: (building: any) => void;
  selectedBuilding?: any;
}

export default function CampusMap({ isDark, onBuildingSelect, selectedBuilding }: CampusMapProps) {
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapStyle = isDark ? [
    {
      elementType: 'geometry',
      stylers: [{ color: '#1f2937' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#1f2937' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca3af' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d1d5db' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca3af' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#374151' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#374151' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#4b5563' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca3af' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#4b5563' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#374151' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#111827' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b7280' }],
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Office Hours': return '#059669';
      case 'Available': return '#2563eb';
      case 'In Class': return '#d97706';
      case 'Away': return '#6b7280';
      case 'Busy': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getBuildingColor = (building: any) => {
    const availableProfessors = building.professors.filter(
      (prof: any) => prof.status === 'Available' || prof.status === 'Office Hours'
    );
    
    if (availableProfessors.length > 0) return '#2563eb';
    if (building.professors.length > 0) return '#d97706';
    return '#6b7280';
  };

  const handleBuildingPress = (building: any) => {
    onBuildingSelect?.(building);
    
    // Animate to building
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...building.center,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }, 1000);
    }
  };

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(CAMPUS_CENTER, 1000);
    }
    onBuildingSelect?.(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={CAMPUS_CENTER}
        customMapStyle={mapStyle}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        minZoomLevel={15}
        maxZoomLevel={19}
        onPress={resetMapView}
      >
        {/* Campus Boundary */}
        <Polygon
          coordinates={CAMPUS_BOUNDARY}
          strokeColor="#2563eb"
          strokeWidth={2}
          fillColor="rgba(37, 99, 235, 0.1)"
          lineDashPattern={[5, 5]}
        />

        {/* Building Polygons */}
        {BUILDINGS.map((building) => (
          <Polygon
            key={`polygon-${building.id}`}
            coordinates={building.coordinates}
            strokeColor={getBuildingColor(building)}
            strokeWidth={2}
            fillColor={`${getBuildingColor(building)}20`}
            tappable={true}
            onPress={() => handleBuildingPress(building)}
          />
        ))}

        {/* Building Markers */}
        {BUILDINGS.map((building) => (
          <Marker
            key={`marker-${building.id}`}
            coordinate={building.center}
            onPress={() => handleBuildingPress(building)}
          >
            <View style={[
              styles.buildingMarker,
              { backgroundColor: getBuildingColor(building) },
              selectedBuilding?.id === building.id && styles.selectedMarker
            ]}>
              <MapPin size={16} color="#ffffff" />
              {building.professors.length > 0 && (
                <View style={styles.professorBadge}>
                  <Text style={styles.badgeText}>{building.professors.length}</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}

        {/* Individual Professor Markers (when building is selected) */}
        {selectedBuilding && selectedBuilding.professors.map((professor: any, index: number) => {
          const offset = 0.0002;
          const angle = (index * 2 * Math.PI) / selectedBuilding.professors.length;
          const professorCoordinate = {
            latitude: selectedBuilding.center.latitude + offset * Math.cos(angle),
            longitude: selectedBuilding.center.longitude + offset * Math.sin(angle),
          };

          return (
            <Marker
              key={`prof-${professor.id}`}
              coordinate={professorCoordinate}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[
                styles.professorMarker,
                { backgroundColor: getStatusColor(professor.status) }
              ]}>
                <Text style={styles.professorInitial}>
                  {professor.name.split(' ').map((n: string) => n[0]).join('')}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}
          onPress={resetMapView}
        >
          <Text style={[styles.controlButtonText, { color: isDark ? '#ffffff' : '#111827' }]}>
            Reset View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campus Label */}
      <View style={[styles.campusLabel, { backgroundColor: isDark ? '#1f2937ee' : '#ffffffee' }]}>
        <Text style={[styles.campusLabelText, { color: isDark ? '#ffffff' : '#111827' }]}>
          PRMSU — Iba Main Campus
        </Text>
        <Text style={[styles.campusSubtext, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          Zambales, Philippines
        </Text>
      </View>

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: isDark ? '#1f2937ee' : '#ffffffee' }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
            Available
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#d97706' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
            Busy
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#6b7280' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
            Empty
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buildingMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  selectedMarker: {
    transform: [{ scale: 1.3 }],
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  professorBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  professorMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  professorInitial: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  campusLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  campusLabelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  campusSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
});