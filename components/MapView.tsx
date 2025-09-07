import { View, StyleSheet, Image } from "react-native";
import { AppleMaps, useLocationPermissions } from "expo-maps";
import React from "react";
import * as Location from 'expo-location';
import { LocationType } from "@/type";
import { useImage } from "expo-image";

export default function MapView({location, setLocation}: {location: LocationType | null, setLocation: (location: LocationType) => void}) {

  const markerImage = require("../assets/images/Map_pin_icon_green.png");

  const handleCameraMove = (event: any) => {
    try {
      // Get the new coordinates from the event
      const newCoords = event.coordinates
  
      // Ensure we have valid coordinates
      if (newCoords && typeof newCoords.latitude === 'number' && typeof newCoords.longitude === 'number') {
        const newLocation: LocationType = {
          coordinates: {
            latitude: newCoords.latitude,
            longitude: newCoords.longitude,
          }
        };
        setLocation(newLocation);
      }
    } catch (error) {
      console.error('Error handling camera move:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppleMaps.View 
        style={styles.map}
        cameraPosition={
            {
              coordinates: {
                latitude: location?.coordinates.latitude || 37.78825,
                longitude: location?.coordinates.longitude || -122.4324,
              },
              zoom: 17.5
            }
        }
        // Remove the annotations prop
        onCameraMove={handleCameraMove}
      />
      <Image
        source={markerImage}
        style={styles.centeredMarker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    position: 'relative', // 👈 Required for absolute positioning of the marker
  },
  map: {
    flex: 1,
  },
  centeredMarker: {
    position: 'absolute', // 👈 Position the marker absolutely
    top: '50%',
    left: '50%',
    width: 33, // 👈 Adjust the size as needed
    height: 45, // 👈 Adjust the size as needed
    // The following two lines are to precisely center the marker.
    // The values should be half of the marker's width and height.
    transform: [{ translateX: -22.5 }, { translateY: -36 }], 
},
});