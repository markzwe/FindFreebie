import { View, StyleSheet } from "react-native";
import { AppleMaps, useLocationPermissions } from "expo-maps";
import React from "react";

export default function MapView() {
  const [status, requestPermission] = useLocationPermissions();

  return (
    <View style={styles.container}>
      <AppleMaps.View 
        style={styles.map}
      
        
        markers={[
            {
                coordinates: {
                    latitude: 37.78825,
                    longitude: -122.4324,
                },
                title: "Marker 1",
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
