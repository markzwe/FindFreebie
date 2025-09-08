import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { CreateItemData } from '@/type'
import { COLORS, SPACING } from '@/constants/theme';
import { Image } from 'expo-image';
import { TouchableOpacity } from 'react-native';
import ItemViewDetailModal from './ItemViewDetail';

export default function ItemCard({item}: {item: CreateItemData}) {

  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = React.useState(false);
  const handleViewDetail = () => {
    setIsViewDetailModalVisible(true);
  }
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress= {handleViewDetail}>
      <View style = {styles.imageContainer}>
        <Image source={item.image}
         style={styles.image}
         contentFit="contain"
         cachePolicy={"memory-disk"}
        />
      </View>
      <View style = {styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <ItemViewDetailModal item={item} isVisible={isViewDetailModalVisible} onClose={ () => setIsViewDetailModalVisible(false) } />
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  titleContainer: {
   paddingTop: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },    
})