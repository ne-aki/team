// app/(tabs)/product/index.jsx
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList, Text, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../../constants/appConst'
import { router, useFocusEffect } from 'expo-router'
import PageTitle from '@/components/common/PageTitle'

const ProductScreen = () => {
  const [newProductList, setNewProductList] = useState([])
  const [popularProductList, setPopularProductList] = useState([])
  const [discountProductList, setDiscountProductList] = useState([])
  const [giftSetList, setGiftSetList] = useState([])

  useFocusEffect(
    useCallback(() => {
      axios.get(`${SERVER_URL}/items`)
        .then(res => {
          const allData = res.data
          const regularProducts = allData.filter(item => !item.isGiftSet)

          const sortedByDate = [...regularProducts].sort(
            (a, b) => new Date(b.regDate) - new Date(a.regDate)
          )
          setNewProductList(sortedByDate.slice(0, 8))

          const sortedProducts = [...regularProducts].sort((a, b) => {
            const avgA = a.reviewAvg || 0
            const avgB = b.reviewAvg || 0
            const cntA = a.reviewCnt || 0
            const cntB = b.reviewCnt || 0

            if (avgB !== avgA) return avgB - avgA
            if (cntB !== cntA) return cntB - cntA
            return a.price - b.price
          })
          setPopularProductList(sortedProducts.slice(0, 8))

          const giftSets = allData.filter(item => item.isGiftSet)
          setGiftSetList(giftSets.slice(0, 8))

          axios.get(`${SERVER_URL}/items/on-sale`)
            .then(saleRes => {
              setDiscountProductList(saleRes.data.slice(0, 8))
            })
            .catch(e => {
              console.log('할인 상품 조회 오류:', e)
              setDiscountProductList([])
            })
        })
        .catch(e => console.log(e))
    }, [])
  )

  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100))
  }

  const renderProductCard = (product) => {
    const imageUrl = product.imgList?.[0]?.attachedImgName
      ? `${SERVER_URL}/upload/${product.imgList[0].attachedImgName}`
      : null

    const discountedPrice = calculateDiscountedPrice(
      product.price, 
      product.discountRate || 0
    )

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/product-detail?itemNum=${product.itemNum}`)}
      >
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
            />
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Text style={{ color: '#999' }}>이미지 없음</Text>
            </View>
          )}
          {product.isOnSale && product.discountRate > 0 && (
            <View style={styles.discountBadgeImage}>
              <Text style={styles.discountBadgeText}>
                {product.discountRate}% 할인
              </Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.itemName}
          </Text>
          <View style={styles.priceContainer}>
            {product.isOnSale && product.discountRate > 0 ? (
              <>
                <Text style={styles.originalPrice}>
                  {product.price?.toLocaleString()}원
                </Text>
                <Text style={styles.productPrice}>
                  {discountedPrice.toLocaleString()}원
                </Text>
              </>
            ) : (
              <Text style={styles.productPrice}>
                {product.price?.toLocaleString()}원
              </Text>
            )}
          </View>
          {product.reviewAvg > 0 && (
            <Text style={styles.rating}>
              ⭐ {product.reviewAvg.toFixed(1)} ({product.reviewCnt || 0})
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderSection = (title, productList, type) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <PageTitle title={title} />
        <TouchableOpacity onPress={() => router.push(`/product/${type}`)}>
          <Text style={styles.seeMoreText}>더보기</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={productList}
        renderItem={({item}) => renderProductCard(item)}
        keyExtractor={item => item.itemNum.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productListContainer}
      />
    </View>
  )

  return (
    // SafeAreaView 제거
    // Menu 제거
    <ScrollView style={styles.scrollView}>
      {renderSection('신상품', newProductList, 'new-product')}
      {renderSection('인기상품', popularProductList, 'popular-product')}
      {renderSection('할인상품', discountProductList, 'discount-product')}
      {renderSection('선물세트', giftSetList, 'gift-set')}
    </ScrollView>
    // 하단 이미지 섹션 제거
  )
}

export default ProductScreen

const styles = StyleSheet.create({
  // container 제거
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#666',
  },
  productListContainer: {
    paddingHorizontal: 20,
  },
  productCard: {
    width: 160,
    backgroundColor: 'rgb(255, 240, 220)',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadgeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    height: 40,
  },
  priceContainer: {
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'brown',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // imageSection, image 제거
})