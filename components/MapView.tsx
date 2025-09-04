import { View, StyleSheet } from "react-native";
import { AppleMaps, useLocationPermissions } from "expo-maps";
import React from "react";
import * as Location from 'expo-location';
import { LocationType } from "@/type";

export default function MapView({location}: {location: LocationType | null}) {

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
              zoom: 15
            }
        }
        markers={[
          {
            coordinates: {
              latitude: location?.coordinates.latitude || 37.78825,
              longitude: location?.coordinates.longitude || -122.4324,
            },
            title: "Your Location",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250, // 👈 give it a fixed height
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
  },
  map: {
    flex: 1,
  },
});
