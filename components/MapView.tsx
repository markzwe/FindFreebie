import { View, StyleSheet, Image } from "react-native";
import { AppleMaps, useLocationPermissions } from "expo-maps";
import React from "react";
import * as Location from 'expo-location';
import { CoordinatesType } from "@/type";
import { useImage } from "expo-image";

export default function MapView({location, setLocation, viewOnly}: {location: CoordinatesType | null, setLocation?: (location: CoordinatesType) => void, viewOnly?: boolean}) {
  console.log('MapView location:', location);
  console.log('MapView coordinates:', location?.coordinates);

  const markerImage = require("../assets/images/Map_pin_icon_green.png");

  
  const handleCameraMove = (event: any) => {
    try {
      // Get the new coordinates from the event
      const newCoords = event.coordinates
  
      // Ensure we have valid coordinates
      if (newCoords && typeof newCoords.latitude === 'number' && typeof newCoords.longitude === 'number') {
        const newLocation: CoordinatesType = {
          coordinates: {
            latitude: newCoords.latitude,
            longitude: newCoords.longitude,
          }
        };
        setLocation?.(newLocation);
      }
    } catch (error) {
      console.error('Error handling camera move:', error);
    }
  };

  // Default coordinates (San Francisco) if no location provided
  const defaultCoordinates = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  // Use provided coordinates or fall back to default
  const mapCoordinates = location?.coordinates ? {
    latitude: location.coordinates.latitude,
    longitude: location.coordinates.longitude,
  } : defaultCoordinates;

  console.log('Final map coordinates:', mapCoordinates);

  return (
    <View style={styles.container}>
      <AppleMaps.View 
        style={styles.map}
        cameraPosition={{
          coordinates: mapCoordinates,
          zoom: 17.5
        }}
        {...(viewOnly && {
          markers: [
            {
              coordinates: mapCoordinates,
            },
          ],
        })}
        onCameraMove={viewOnly ? undefined : handleCameraMove}
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