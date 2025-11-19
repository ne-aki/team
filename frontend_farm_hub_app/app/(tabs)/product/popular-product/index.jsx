import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { router } from 'expo-router'
import { SERVER_URL } from '@/constants/appConst'
import Menu from '@/components/Menu'
import { colors } from '@/constants/colorConstant'
import PageTitle from '@/components/common/PageTitle'
import { Ionicons } from '@expo/vector-icons'

const PopularProductList = () => {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8

  useEffect(() => {
    // 서버에서 상품 데이터 가져오기
    axios.get(`${SERVER_URL}/items`)
      .then(res => {
        // 세트상품 제외 (isGiftSet이 아닌 상품만)
        const regularProducts = res.data.filter(item => !item.isGiftSet)
        // reviewAvg 기준으로 정렬 (복합 조건)
        const sortedProducts = [...regularProducts].sort((a, b) => {
          const avgA = a.reviewAvg || 0
          const avgB = b.reviewAvg || 0
          const cntA = a.reviewCnt || 0
          const cntB = b.reviewCnt || 0

          // 1순위: 평점 높은 순
          if (avgB !== avgA) {
            return avgB - avgA
          }

          // 2순위: 리뷰 개수 많은 순
          if (cntB !== cntA) {
            return cntB - cntA
          }

          // 3순위: 가격 낮은 순
          return a.price - b.price
        })
        setProductList(sortedProducts)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }, [])

  // 할인가 계산 함수
  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100))
  }

  // 상품 카드 렌더링
  const renderProductCard = ({ item }) => {
    const imageUrl = item.imgList?.[0]?.attachedImgName
      ? `${SERVER_URL}/upload/${item.imgList[0].attachedImgName}`
      : null

    const discountedPrice = calculateDiscountedPrice(item.price, item.discountRate || 0)

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/product-detail?itemNum=${item.itemNum}`)}
      >
        {/* 상품 이미지 */}
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          ) : (
            <View style={styles.noImage}>
              <Text style={{ color: '#999' }}>이미지 없음</Text>
            </View>
          )}
          {/* 할인율 배지 */}
          {item.isOnSale && item.discountRate > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{item.discountRate}% 할인</Text>
            </View>
          )}
        </View>
        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.itemName}</Text>
          {/* 할인가와 원가 표시 */}
          <View style={styles.priceContainer}>
            {item.isOnSale && item.discountRate > 0 ? (
              <>
                <Text style={styles.originalPrice}>{item.price?.toLocaleString()}원</Text>
                <Text style={styles.productPrice}>{discountedPrice.toLocaleString()}원</Text>
              </>
            ) : (
              <Text style={styles.productPrice}>{item.price?.toLocaleString()}원</Text>
            )}
          </View>
          {/* 평점 표시 */}
          {item.reviewAvg > 0 ? (
            <Text style={styles.rating}>
              ⭐ {item.reviewAvg.toFixed(1)} ({item.reviewCnt || 0})
            </Text>
          ) : (
            <Text style={styles.noReview}>리뷰 없음</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 총 페이지 수
  const totalPages = Math.ceil(productList.length / itemsPerPage)

  // 페이지 번호 계산 (최대 5개만 표시)
  const getPageNumbers = () => {
    const maxButtons = 5
    const pages = []

    if (totalPages <= maxButtons) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      let start = Math.max(0, currentPage - 2)
      let end = Math.min(totalPages - 1, currentPage + 2)

      if (currentPage <= 2) {
        end = maxButtons - 1
      }
      if (currentPage >= totalPages - 3) {
        start = totalPages - maxButtons
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  // 현재 페이지 데이터 계산
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProductList = productList.slice(startIndex, endIndex)

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.BROWN} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <PageTitle title='인기상품' />
      </View>
      <FlatList
        data={currentProductList}
        renderItem={renderProductCard}
        keyExtractor={item => item.itemNum.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        ListFooterComponent={
          productList.length > 0 && totalPages > 1 ? (
            <View style={styles.paginationContainer}>
              {/* 이전 버튼 */}
              <TouchableOpacity
                style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}
                onPress={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={currentPage === 0 ? '#999' : '#333'}
                />
              </TouchableOpacity>

              {/* 페이지 번호 */}
              {getPageNumbers().map((pageNum) => (
                <TouchableOpacity
                  key={pageNum}
                  style={[
                    styles.pageButton,
                    currentPage === pageNum && styles.activePageButton
                  ]}
                  onPress={() => handlePageChange(pageNum)}
                >
                  <Text style={[
                    styles.pageButtonText,
                    currentPage === pageNum && styles.activePageText
                  ]}>
                    {pageNum + 1}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* 다음 버튼 */}
              <TouchableOpacity
                style={[styles.pageButton, currentPage === totalPages - 1 && styles.disabledButton]}
                onPress={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentPage === totalPages - 1 ? '#999' : '#333'}
                />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default PopularProductList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: 'rgb(255, 240, 220)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  noImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
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
  noReview: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activePageButton: {
    backgroundColor: colors.BROWN,
    borderColor: colors.BROWN,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activePageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})