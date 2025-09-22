import { CoordinatesType } from "@/type";
import { AppleMaps } from "expo-maps";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
interface MapViewProps {
  location: CoordinatesType | null;
  setLocation?: (location: CoordinatesType) => void;
  viewOnly?: boolean;
}

export default function MapView({ location, setLocation, viewOnly = false }: MapViewProps) {
  console.log('MapView coordinates:', location?.coordinates);

  const markerImage = require("../assets/images/Map_pin_icon_green.png");
  const handleCameraMove = (event: { 
    coordinates: {
      latitude?: number;
      longitude?: number;
    }; 
    zoom: number; 
    tilt: number; 
    bearing: number; 
  }) => {
    try {
      const { latitude, longitude } = event.coordinates;
      
      if (latitude !== undefined && longitude !== undefined) {
        const newLocation: CoordinatesType = {
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
    coordinates: {
      latitude?: number;
      longitude?: number;
    } 
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

  // Default coordinates (San Francisco) if no location provided
  const defaultCoordinates = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  const mapCoordinates = location?.coordinates ? {
    latitude: location.coordinates.latitude,
    longitude: location.coordinates.longitude,
  } : defaultCoordinates;

  // Only show markers when not in view-only mode
  const markers = !viewOnly && location?.coordinates ? [{
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
    radius: 200, // 200 meters radius
    fillColor: 'rgba(0, 122, 255, 0.2)',
    strokeColor: 'rgba(49, 116, 187, 0.22))',
    strokeWidth: 2,
  } : undefined;

  return (
    <View style={styles.container}>
      <AppleMaps.View 
        style={styles.map}
        cameraPosition={{
          coordinates: mapCoordinates,
          zoom: 17.5
        }}
      
        circles={viewOnly && circle ? [circle] : undefined}
        markers={markers} 
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
    height: 230,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
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