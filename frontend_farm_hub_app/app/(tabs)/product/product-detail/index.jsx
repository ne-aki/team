import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import PageTitle from "@/components/common/PageTitle";
import { SERVER_URL } from "@/constants/appConst";
import { colors } from "@/constants/colorConstant";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Info from "./info";
import Qna from "./qna";
import Review from "./review";

const ProductDetail = () => {
  const { itemNum } = useLocalSearchParams();

  const [itemDetail, setItemDetail] = useState({});
  const [cnt, setCnt] = useState(1); // 숫자로 변경
  const [activeTab, setActiveTab] = useState("intro");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [isDibbed, setIsDibbed] = useState(false); // 찜 여부 상태

  // 할인가 계산 함수
  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100));
  };

  // 로그인 체크 공통 함수
  const checkLogin = async (message = "로그인이 필요한 서비스입니다.") => {
    try {
      const loginData = await SecureStore.getItemAsync("loginInfo");
      if (!loginData || JSON.parse(loginData) === null) {
        Alert.alert("알림", message, [
          {
            text: "확인",
            onPress: () => router.push("/auth/login"),
          },
        ]);
        return false;
      }
      return true;
    } catch (error) {
      console.error("로그인 체크 에러:", error);
      return false;
    }
  };

  // 장바구니 버튼 클릭
  const insertCart = async () => {
    if (!(await checkLogin("장바구니는 로그인이 필요한 서비스입니다."))) return;

    try {
      const loginData = await SecureStore.getItemAsync("loginInfo");
      const memId = JSON.parse(loginData).memId;

      const response = await axios.post(`${SERVER_URL}/carts`, {
        itemNum,
        cartCnt: cnt, // 이미 숫자
        memId,
      });

      console.log(response.data);
      Alert.alert(
        "장바구니",
        "장바구니에 상품을 담았습니다.\n장바구니 페이지로 이동할까요?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "확인",
            onPress: () => router.push("/product/product-detail/shop"),
          },
        ]
      );
    } catch (error) {
      console.error("장바구니 추가 에러:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "장바구니 추가에 실패했습니다";
      Alert.alert("오류", errorMsg);
    }
  };

  // 찜하기 토글 (추가/삭제)
  const toggleDibs = async () => {
    if (!(await checkLogin("찜하기는 로그인이 필요한 서비스입니다."))) return;

    try {
      const loginData = await SecureStore.getItemAsync("loginInfo");
      const memId = JSON.parse(loginData).memId;

      if (isDibbed) {
        // 이미 찜한 상품 -> 삭제
        await axios.delete(`${SERVER_URL}/dibs/item`, {
          params: { memId, itemNum },
        });
        setIsDibbed(false);
        Alert.alert("찜하기", "찜 목록에서 제거되었습니다.");
      } else {
        // 찜하지 않은 상품 -> 추가
        await axios.post(`${SERVER_URL}/dibs`, {
          itemNum,
          memId,
        });
        setIsDibbed(true);
        Alert.alert("찜하기", "찜 목록에 추가되었습니다!", [
          { text: "확인", style: "default" },
          {
            text: "찜 목록 보기",
            onPress: () => router.push("/my-page/dibs"),
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("오류", error.response?.data || "찜하기 실패");
    }
  };

  // 찜 여부 확인
  const checkDibsStatus = async () => {
    try {
      const loginData = await SecureStore.getItemAsync("loginInfo");
      if (!loginData) return;

      const memId = JSON.parse(loginData).memId;
      const response = await axios.get(`${SERVER_URL}/dibs/check`, {params: { memId, itemNum },});
      console.log('찜 상태 응답:', response.data);
      setIsDibbed(response.data.isDibbed);
    } catch (error) {
      console.log("찜 여부 확인 오류:", error);
      setIsDibbed(false);
    }
  };  

  // 구매 버튼 클릭
  const buyItem = async () => {
    if (!(await checkLogin("로그인해 주세요."))) return;

    Alert.alert("구매 확인", "상품을 구매하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          try {
            const loginData = await SecureStore.getItemAsync("loginInfo");
            const memId = JSON.parse(loginData).memId;

            await axios.post(`${SERVER_URL}/buy`, {
              itemNum,
              memId,
              buyCnt: cnt,
            });

            Alert.alert("구매 완료", "구매가 완료되었습니다.", [
              {
                text: "확인",
                onPress: () => router.push("/my-page/orders"),
              },
            ]);
          } catch (error) {
            console.error("구매 에러:", error);
            const errorMsg =
              error.response?.data?.message ||
              error.response?.data ||
              "구매에 실패했습니다";
            Alert.alert("오류", errorMsg);
          }
        },
      },
    ]);
  };

  // 상품 정보 가져오기
  const getItem = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/items/${itemNum}`);
      console.log(response.data);
      setItemDetail(response.data);
      setLoading(false);
    } catch (error) {
      console.error("상품 정보 조회 에러:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
    checkDibsStatus(); // 찜 여부 확인
  }, [itemNum, reload]);

  // 메인 이미지 찾기
  const getMainImage = () => {
    if (itemDetail.imgList) {
      const mainImg = itemDetail.imgList.find((img) => img.isMain === "Y");
      return mainImg ? `${SERVER_URL}/upload/${mainImg.attachedImgName}` : null;
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.itemInfo}>
          <View style={styles.titleDiv}>
            <PageTitle title="상품 상세정보" titleSize={180} />
          </View>

          <View style={styles.mainImgDiv}>
            {getMainImage() ? (
              <Image source={{ uri: getMainImage() }} style={styles.mainImg} />
            ) : (
              <View style={styles.noImage}>
                <Text>이미지 없음</Text>
              </View>
            )}
          </View>

          <View style={styles.itemIntro}>
            <Text style={styles.itemTitle}>{itemDetail.itemName}</Text>

            {/* 할인율 배지 */}
            {itemDetail.isOnSale && itemDetail.discountRate > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  {itemDetail.discountRate}% 할인
                </Text>
              </View>
            )}

            {/* 상품 정보 테이블 */}
            <View style={styles.infoTable}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>판매가</Text>
                <View style={styles.priceContainer}>
                  {itemDetail.isOnSale && itemDetail.discountRate > 0 ? (
                    <>
                      <Text style={styles.originalPrice}>
                        {itemDetail.price?.toLocaleString()}원
                      </Text>
                      <Text style={styles.discountedPrice}>
                        {calculateDiscountedPrice(
                          itemDetail.price,
                          itemDetail.discountRate
                        ).toLocaleString()}
                        원
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.infoValue}>
                      {itemDetail.price?.toLocaleString()}원
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>부위</Text>
                <Text style={styles.infoValue}>{itemDetail.part}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>원산지</Text>
                <Text style={styles.infoValue}>{itemDetail.origin}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>만족도 평균</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={18} color="#ffc107" />
                  <Text style={styles.infoValue}> {itemDetail.reviewAvg}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>판매자</Text>
                <Text style={styles.infoValue}>{itemDetail.seller}</Text>
              </View>
            </View>

            <View style={styles.cartCnt}>
              <Input
                keyboardType="number-pad"
                value={String(cnt)}
                onChangeText={(text) => setCnt(parseInt(text) || 1)}
              />
            </View>

            <View style={styles.btns}>
              {/* 찜한상품 버튼 - 찜 상태에 따라 색상 변경 */}
              <Button
                bgColor={isDibbed ? "#FF6B6B" : colors.GRAY_500}
                style={styles.button}
                onPress={toggleDibs}
              >
                <Ionicons
                  name={isDibbed ? "heart" : "heart-outline"}
                  size={18}
                  color="white"
                />
                <Text style={styles.buttonText}>
                  {isDibbed ? "찜 완료" : "찜하기"}
                </Text>
              </Button>
              {/* 장바구니 버튼 - 갈색 */}
              <Button
                title="장바구니"
                bgColor={colors.BROWN}
                onPress={insertCart}
                style={styles.button}
              />
              <Button
                title="구매하기"
                bgColor={colors.GREEN}
                onPress={buyItem}
                style={styles.button}
              />
            </View>
          </View>
        </View>

        <View style={styles.detailMenuDiv}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "intro" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("intro")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "intro" && styles.activeTabText,
              ]}
            >
              상품정보
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "review" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("review")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "review" && styles.activeTabText,
              ]}
            >
              이용후기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "qna" && styles.activeTab]}
            onPress={() => setActiveTab("qna")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "qna" && styles.activeTabText,
              ]}
            >
              상품문의
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          {activeTab === "intro" && (
            <View style={styles.detailContent}>
              <Info itemDetail={itemDetail} />
            </View>
          )}
          {activeTab === "review" && (
            <View style={styles.detailContent}>
              <Review
                itemDetail={itemDetail}
                onReviewUpdate={() => {
                  setReload(reload + 1);
                }}
              />
            </View>
          )}
          {activeTab === "qna" && (
            <View style={styles.detailContent}>
              <Qna />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    padding: 20,
  },
  mainImgDiv: {
    width: "100%",
    height: 350,
    marginBottom: 20,
  },
  mainImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  noImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  itemIntro: {
    width: "100%",
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  discountBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 15,
  },
  discountBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoTable: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 15,
  },
  infoLabel: {
    width: "30%",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoValue: {
    width: "70%",
    fontSize: 16,
    color: "#666",
  },
  priceContainer: {
    width: "70%",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF4444",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
  },
  cartCnt: {
    marginBottom: 20,
  },
  btns: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    height: 45,
  },
  detailMenuDiv: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#eeeeee",
    borderBottomWidth: 2,
    borderBottomColor: colors.BROWN,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopColor: colors.BROWN,
    borderLeftColor: colors.BROWN,
    borderRightColor: colors.BROWN,
    borderBottomWidth: 0,
  },
  tabText: {
    fontSize: 16,
    color: colors.BROWN,
  },
  activeTabText: {
    fontWeight: "bold",
  },
  details: {
    padding: 20,
    minHeight: 200,
  },
  detailContent: {
    paddingVertical: 20,
  },
  titleDiv: {
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 14.5,
    fontWeight: "600",
  },
});

export default ProductDetail;
