import { AppleMaps } from "expo-maps";
import React from "react";
import { StyleSheet, View, TouchableOpacity, Alert, Platform, Text, Image } from 'react-native';

// Define the Coordinates type that matches expo-maps expectations
type Coordinates = {
  latitude?: number;
  longitude?: number;
}

interface MapViewProps {
  location?: {
    coordinates: Coordinates;
  } | null;
  setLocation?: (location: { coordinates: Coordinates }) => void;
  viewOnly?: boolean;
}
export default function MapView({ location, setLocation, viewOnly = false }: MapViewProps) {
  console.log('MapView coordinates:', location?.coordinates);

  // Use require with type assertion for the image
  const markerImage = require('../assets/images/Map_pin_icon_green.png') as number;
  const handleCameraMove = (event: { 
    coordinates: Coordinates; 
    zoom: number; 
    tilt: number; 
    bearing: number; 
  }) => {
    try {
      const { latitude, longitude } = event.coordinates;
      
      if (latitude !== undefined && longitude !== undefined) {
        const newLocation = {
          coordinates: {
            latitude,
            longitude
          }
        };
        setLocation?.(newLocation);
        console.log('MapView new location:', newLocation);
      }
    } catch (error) {
      console.error('Error handling camera move:', error);
    }
  };

  const handleMapClick = (event: { 
    coordinates: Coordinates 
  }) => {
    if (!viewOnly && setLocation) {
      const { latitude, longitude } = event.coordinates;
      if (latitude !== undefined && longitude !== undefined) {
        setLocation({
          coordinates: {
            latitude,
            longitude,
          }
        });
      }
    }
  };



  // Safely get coordinates with proper type checking
  const mapCoordinates = location?.coordinates && 
    typeof location.coordinates.latitude === 'number' && 
    typeof location.coordinates.longitude === 'number'
    ? {
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude
      }
    : null;

  // If no valid coordinates, don't render the map
  if (!mapCoordinates || (mapCoordinates.latitude === 0 && mapCoordinates.longitude === 0)) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No location available</Text>
      </View>
    );
  }

  // Only show markers when not in view-only mode
  const markers = !viewOnly && mapCoordinates ? [{
    coordinates: mapCoordinates,
  }] : undefined;

  // Add a small random offset to the center of the circle for view-only mode
  const getOffsetCoordinates = (coord: { latitude: number; longitude: number }) => {
    // Add a random offset between -0.001 and 0.001 degrees (about 100m at equator)
    const offset = () => (Math.random() * 0.002) - 0.001;
    return {
      latitude: coord.latitude + offset(),
      longitude: coord.longitude + offset()
    };
  };

  // In view-only mode, show a circle with a radius of 200 meters
  const circle = viewOnly && location?.coordinates ? {
    center: getOffsetCoordinates(mapCoordinates),
    radius: 1000, // 200 meters radius
    color: 'rgba(168, 0, 0, 0.2)',
    
  } : undefined;

  console.log(mapCoordinates);
  return (
    <View style={styles.container}>
      <AppleMaps.View 
        style={styles.map}
        cameraPosition={{
          coordinates: mapCoordinates,
          zoom: viewOnly ? 15.7 : 17.5
        }}
        circles={ viewOnly ? [{
          center: mapCoordinates,
          radius: 300, // 1km radius
          color: 'rgba(0, 4, 255, 0.4)',
          lineWidth: 2,
          lineColor: '#0000FF'
        }] : undefined}
        
        onCameraMove={viewOnly ? undefined : handleCameraMove}
        onMapClick={viewOnly ? undefined : handleMapClick}
        uiSettings={{
          myLocationButtonEnabled: viewOnly ? false : true,          
        }}
      />
      {!viewOnly && (
        <Image
          source={markerImage}
          style={styles.centeredMarker}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  centeredMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 33,
    height: 45,
    transform: [{ translateX: -22.5 }, { translateY: -36 }], 
  },
});