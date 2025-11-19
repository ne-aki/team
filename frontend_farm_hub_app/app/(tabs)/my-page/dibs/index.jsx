import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PageTitle from '@/components/common/PageTitle';
import { colors } from '@/constants/colorConstant';

const HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://192.168.0.50:8080';

axios.defaults.baseURL = HOST;
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

const DibsScreen = ({ navigation }) => {
  const [dibsList, setDibsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchDibsList();
  }, [isFocused]);

  const fetchDibsList = async () => {
    try {
      setLoading(true);
      
      const loginInfoStr = await SecureStore.getItemAsync('loginInfo');
      if (!loginInfoStr) {
        Alert.alert('알림', '로그인이 필요합니다.');
        setLoading(false);
        return;
      }
      
      const loginInfo = JSON.parse(loginInfoStr);
      const memId = loginInfo.memId;
      
      const res = await axios.get('/dibs', {
        params: { memId }
      });
      setDibsList(res.data);
    } catch (error) {
      console.error('찜 목록 불러오기 오류:', error?.response || error);
      Alert.alert('오류', '찜 목록을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckItem = (dibsNum) => {
    setCheckedItems((prev) =>
      prev.includes(dibsNum) ? prev.filter((n) => n !== dibsNum) : [...prev, dibsNum],
    );
  };

  const handleSelectAll = () => {
    if (checkedItems.length === dibsList.length && dibsList.length > 0) {
      setCheckedItems([]);
    } else {
      setCheckedItems(dibsList.map((item) => item.dibsNum));
    }
  };

  const handleDeleteSelected = async () => {
    if (checkedItems.length === 0) {
      Alert.alert('알림', '삭제할 항목을 선택하세요.');
      return;
    }
    
    Alert.alert(
      '삭제 확인',
      `선택한 ${checkedItems.length}개의 항목을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const params = new URLSearchParams();
              checkedItems.forEach((num) => params.append('dibsNumList', num));
              await axios.delete(`/dibs?${params.toString()}`);
              Alert.alert('성공', '선택한 항목이 삭제되었습니다.');
              await fetchDibsList();
              setCheckedItems([]);
            } catch (error) {
              console.error('선택삭제 오류:', error?.response || error);
              Alert.alert('오류', '선택한 항목 삭제 중 문제가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleMoveToCart = async (item) => {
    try {
      const loginInfoStr = await SecureStore.getItemAsync('loginInfo');
      const memId = JSON.parse(loginInfoStr).memId;
      
      await axios.post('/carts', { 
        itemNum: item.itemDTO.itemNum, 
        cartCnt: 1,
        memId 
      });
      Alert.alert('성공', '상품이 장바구니에 담겼습니다.');
    } catch (error) {
      console.error('장바구니 추가 오류:', error?.response || error);
      Alert.alert('오류', '장바구니 추가 중 문제가 발생했습니다.');
    }
  };

  const handleDeleteItem = async (dibsNum) => {
    Alert.alert(
      '삭제 확인',
      '이 상품을 찜 목록에서 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`/dibs/${dibsNum}`);
              Alert.alert('성공', '삭제되었습니다.');
              await fetchDibsList();
            } catch (error) {
              console.error('개별 삭제 오류:', error?.response || error);
              Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const imageUrl = item.itemDTO?.imgList?.[0]
      ? `${HOST}/upload/${item.itemDTO.imgList[0].attachedImgName}`
      : null;

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Checkbox
            value={checkedItems.includes(item.dibsNum)}
            onValueChange={() => handleCheckItem(item.dibsNum)}
            style={styles.checkbox}
            color={checkedItems.includes(item.dibsNum) ? colors.BROWN : undefined}
          />
          <TouchableOpacity 
            style={styles.deleteIconButton}
            onPress={() => handleDeleteItem(item.dibsNum)}
          >
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.itemContent}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={40} color="#ccc" />
            </View>
          )}
          
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.itemDTO.itemName}
            </Text>
            <Text style={styles.itemPrice}>
              {item.itemDTO.price.toLocaleString()}원
            </Text>
            <Text style={styles.itemDate}>
              {new Date(item.dibsDate).toLocaleDateString('ko-KR')}
            </Text>
          </View>
        </View>
        
        <View style={styles.itemButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cartButton]} 
            onPress={() => handleMoveToCart(item)}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>장바구니</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={80} color="#ddd" />
      <Text style={styles.emptyText}>찜한 상품이 없습니다</Text>
      <Text style={styles.emptySubText}>마음에 드는 상품을 찜해보세요!</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.BROWN} />
        </View>
      </SafeAreaView>
    );
  }

  return (
  <SafeAreaView style={styles.safeArea}>
    <PageTitle title="찜 목록" />
    
    {dibsList.length > 0 && (
      <View style={styles.headerContainer}>
        <View style={styles.selectAllContainer}>
          <Checkbox
            value={checkedItems.length === dibsList.length && dibsList.length > 0}
            onValueChange={handleSelectAll}
            color={checkedItems.length === dibsList.length ? colors.BROWN : undefined}
          />
          <Text style={styles.selectAllText}>전체 선택</Text>
        </View>
        <Text style={styles.countText}>총 {dibsList.length}개</Text>
      </View>
    )}
    
    <FlatList
      data={dibsList}
      keyExtractor={(item) => item.dibsNum.toString()}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={
        dibsList.length > 0 && checkedItems.length > 0 ? (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.deleteButtonLarge} 
              onPress={handleDeleteSelected}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>
                선택 삭제 ({checkedItems.length})
              </Text>
            </TouchableOpacity>
          </View>
        ) : null
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  </SafeAreaView>
);
};

export default DibsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
  },
  deleteIconButton: {
    padding: 5,
  },
  itemContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  noImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BROWN,
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 13,
    color: '#999',
  },
  itemButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  cartButton: {
    backgroundColor: colors.BROWN,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteButtonLarge: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
