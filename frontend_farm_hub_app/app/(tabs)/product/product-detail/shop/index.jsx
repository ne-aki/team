import PageTitle from "@/components/common/PageTitle";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_URL } from "@/constants/appConst";

const CartScreen = () => {
  const router = useRouter();
  const [cartList, setCartList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(0);

  useEffect(() => {
    const getCartData = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync("loginInfo");

        if (loginInfo) {
          const parsedUserInfo = JSON.parse(loginInfo);
          setUserInfo(parsedUserInfo);
          
          const response = await axios.get(
            `${SERVER_URL}/carts/${parsedUserInfo.memId}`
          );
          setCartList(response.data);
        } else {
          Alert.alert(
            "로그인 필요",
            "장바구니를 이용하려면 로그인이 필요합니다.",
            [
              {
                text: "로그인하기",
                onPress: () => router.push("/auth/login"),
              },
              {
                text: "취소",
                onPress: () => router.back(),
                style: "cancel",
              },
            ]
          );
        }
      } catch (error) {
        if (error.response?.status === 401) {
          Alert.alert(
            "인증 만료",
            "로그인이 만료되었습니다. 다시 로그인해주세요.",
            [
              {
                text: "로그인하기",
                onPress: () => {
                  SecureStore.deleteItemAsync("loginInfo");
                  router.push("/auth/login");
                },
              },
            ]
          );
        } else {
          Alert.alert("오류", "장바구니 데이터를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    getCartData();
  }, [reloading]);

  const handleCntChange = (i, value) => {
    const updatedCartList = [...cartList];
    const numValue = parseInt(value);
    updatedCartList[i].cartCnt = isNaN(numValue) || numValue < 1 ? 1 : numValue;
    setCartList(updatedCartList);
  };

  const updateCartCnt = (cart) => {
    if (!cart.cartCnt || isNaN(cart.cartCnt) || cart.cartCnt < 1) {
      Alert.alert("알림", "유효한 수량을 입력해주세요.");
      return;
    }

    axios
      .put(`${SERVER_URL}/carts/${cart.cartNum}`, {
        cartCnt: Number(cart.cartCnt),
        memId: userInfo.memId,
        itemNum: cart.itemNum,
      })
      .then(() => {
        Alert.alert("성공", "수량이 변경되었습니다.");
        setReloading(reloading + 1);
      })
      .catch((e) => {
        Alert.alert("오류", e.response?.data || "수량 변경에 실패했습니다.");
      });
  };

  const getTotalPrice = () => {
    return cartList
      .filter((cart) => selectedItems.includes(cart.cartNum))
      .reduce((sum, cart) => sum + cart.totalPrice, 0);
  };

  const handleCheckbox = (cartNum) => {
    setSelectedItems(prev =>
      prev.includes(cartNum)
        ? prev.filter((num) => num !== cartNum)
        : [...prev, cartNum]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === cartList.length && cartList.length > 0
        ? []
        : cartList.map((cart) => cart.cartNum)
    );
  };

  const deleteCartItem = (cartNum) => {
    Alert.alert("확인", "해당 상품을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          axios
            .delete(`${SERVER_URL}/carts/${cartNum}`)
            .then(() => {
              Alert.alert("성공", "상품이 삭제되었습니다.");
              setCartList(cartList.filter((cart) => cart.cartNum !== cartNum));
              setSelectedItems(selectedItems.filter((num) => num !== cartNum));
            })
            .catch(() => {
              Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
            });
        },
      },
    ]);
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert("알림", "삭제할 상품을 선택해주세요.");
      return;
    }

    Alert.alert(
      "확인",
      `선택한 ${selectedItems.length}개 상품을 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            Promise.all(
              selectedItems.map((cartNum) =>
                axios.delete(`${SERVER_URL}/carts/${cartNum}`)
              )
            )
              .then(() => {
                Alert.alert("성공", "선택한 상품이 삭제되었습니다.");
                setCartList(
                  cartList.filter(
                    (cart) => !selectedItems.includes(cart.cartNum)
                  )
                );
                setSelectedItems([]);
              })
              .catch(() => {
                Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
              });
          },
        },
      ]
    );
  };

  const buyItem = (cart) => {
    router.push({
      pathname: "/mypage/payment",
      params: { cartItems: JSON.stringify([cart]) },
    });
  };

  const buySelectedItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert("알림", "구매할 상품을 선택해주세요.");
      return;
    }

    const selectedCartItems = cartList.filter((cart) =>
      selectedItems.includes(cart.cartNum)
    );

    router.push({
      pathname: "/mypage/payment",
      params: { cartItems: JSON.stringify(selectedCartItems) },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageTitle title="장바구니" />
      
      {/* 테이블 헤더 */}
      <View style={styles.tableHeader}>
        <TouchableOpacity style={styles.headerCell} onPress={handleSelectAll}>
          <Text style={styles.checkboxText}>
            {selectedItems.length === cartList.length && cartList.length > 0 ? "☑" : "☐"}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCellSmall}>
          <Text style={styles.headerText}>상품번호</Text>
        </View>
        <View style={[styles.headerCell, styles.flex2]}>
          <Text style={styles.headerText}>상품명</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>가격</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>수량</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>총가격</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={styles.headerText}>구매</Text>
        </View>
      </View>

      {/* 테이블 바디 */}
      <ScrollView style={styles.scrollView}>
        {cartList.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>장바구니에 담긴 상품이 없습니다.</Text>
          </View>
        ) : (
          cartList.map((cart, i) => (
            <View key={i} style={styles.cartItem}>
              <View style={styles.itemRow}>
                <TouchableOpacity
                  style={styles.headerCell}
                  onPress={() => handleCheckbox(cart.cartNum)}
                >
                  <Text style={styles.checkboxText}>
                    {selectedItems.includes(cart.cartNum) ? "☑" : "☐"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.headerCellSmall}>
                  <Text style={styles.itemText}>{cart.itemNum}</Text>
                </View>

                <View style={[styles.headerCell, styles.flex2]}>
                  <Text style={styles.itemName}>
                    {cart.itemDTO?.itemName || cart.itemName}
                  </Text>
                </View>

                <View style={styles.headerCell}>
                  <Text style={styles.itemText}>
                    {(cart.itemDTO?.price || cart.price)?.toLocaleString()}원
                  </Text>
                </View>

                <View style={styles.headerCell}>
                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={styles.quantityInput}
                      value={String(cart.cartCnt)}
                      onChangeText={(value) => handleCntChange(i, value)}
                      keyboardType="number-pad"
                    />
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => updateCartCnt(cart)}
                    >
                      <Text style={styles.updateButtonText}>변경</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.headerCell}>
                  <Text style={styles.itemText}>
                    {cart.totalPrice?.toLocaleString()}원
                  </Text>
                </View>

                <View style={styles.headerCell}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.buyButton]}
                    onPress={() => buyItem(cart)}
                  >
                    <Text style={styles.buyButtonText}>구매</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteCartItem(cart.cartNum)}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 총 금액 - 고정 */}
      {cartList.length > 0 && (
        <View style={styles.totalPriceContainer}>
          <View style={styles.totalPriceBox}>
            <Text style={styles.totalLabel}>총 구매 가격</Text>
            <Text style={styles.totalAmount}>
              {getTotalPrice().toLocaleString()}원
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.bottomButton, styles.deleteSelectedButton]}
              onPress={deleteSelectedItems}
            >
              <Text style={styles.bottomButtonText}>선택 삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButton, styles.buySelectedButton]}
              onPress={buySelectedItems}
            >
              <Text style={[styles.bottomButtonText, styles.buySelectedText]}>
                선택 상품 구매
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    alignItems: "center",
    marginTop: 20,
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  headerCellSmall: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  flex2: {
    flex: 2,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  checkboxText: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  itemText: {
    fontSize: 10,
    textAlign: "center",
  },
  itemName: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  quantityContainer: {
    alignItems: "center",
    gap: 4,
  },
  quantityInput: {
    width: 40,
    height: 35,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 10,
    paddingVertical: 2,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginVertical: 1,
    minWidth: 40,
  },
  buyButton: {
    backgroundColor: "#4CAF50",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#999",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyCart: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  totalPriceContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  totalPriceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteSelectedButton: {
    backgroundColor: "#999",
  },
  buySelectedButton: {
    backgroundColor: "#4CAF50",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buySelectedText: {
    fontSize: 15,
  },
});