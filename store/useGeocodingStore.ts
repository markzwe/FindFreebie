// import { create } from 'zustand';
// import * as Location from 'expo-location';
// import { CoordinatesType, AddressType } from '@/type';

// interface GeocodingStore {
//   // Cache to store coordinates to address mappings
//   addressCache: Record<string, AddressType>;
//   // Function to get address from coordinates
//   getAddressFromCoordinates: (coordinates: CoordinatesType) => Promise<AddressType | null>;
//   // Clear the cache
//   clearCache: () => void;
// }

// export const useGeocodingStore = create<GeocodingStore>((set, get) => ({
//   addressCache: {},

//   getAddressFromCoordinates: async (coordinates: CoordinatesType) => {
//     const { latitude, longitude } = coordinates.coordinates;
    
//     // Create a cache key from the coordinates
//     const cacheKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
    
//     // Return cached address if available
//     if (get().addressCache[cacheKey]) {
//       return get().addressCache[cacheKey];
//     }

//     try {
//       // Get the address using expo-location
//       const result = await Location.reverseGeocodeAsync({
//         latitude,
//         longitude,
//       });

//       if (result && result.length > 0) {
//         const address: AddressType = {
//           name: [
//             result[0].name,
//             result[0].street,
//             result[0].city,
//             result[0].region,
//           ]
//             .filter(Boolean)
//             .join(', '),
//           postalCode: result[0].postalCode || '',
//         };

//         // Update the cache
//         set((state) => ({
//           addressCache: {
//             ...state.addressCache,
//             [cacheKey]: address,
//           },
//         }));

//         return address;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error in getAddressFromCoordinates:', error);
//       return null;
//     }
//   },

//   clearCache: () => set({ addressCache: {} }),
// }));

// // Utility function to use the store outside of React components
// export const getGeocodedAddress = async (coordinates: CoordinatesType): Promise<AddressType | null> => {
//   return useGeocodingStore.getState().getAddressFromCoordinates(coordinates);
// };
