// app/(tabs)/product/_layout.jsx
import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import { Stack, useSegments } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Menu from '@/components/Menu'

const ProductLayout = () => {
  const segments = useSegments()
  
  const isProductDetail = segments.includes('product-detail')

  let activeMenu = null
  if (segments.includes('new-product')) {
    activeMenu = 'new-product'
  } else if (segments.includes('popular-product')) {
    activeMenu = 'popular-product'
  } else if (segments.includes('discount-product')) {
    activeMenu = 'discount-product'
  } else if (segments.includes('gift-set')) {
    activeMenu = 'gift-set'
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isProductDetail && <Menu activeMenu={activeMenu} />}
      
      <Stack
        screenOptions={{headerShown: false}}
      />
      
      {!isProductDetail && (
        <View style={styles.imageSection}>
          <Image 
            source={require('@/assets/images/header0.png')} 
            style={styles.image}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default ProductLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSection: {
    paddingTop: 5,
  },
  image: {
    width: '100%',
    height: 50,
    resizeMode: 'cover',
  },
})