import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Pressable, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '@/constants/colorConstant';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '@/app/contexts/AuthContext';

const MyPageScreen = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const { logout } = useAuth();

  // 로그인 정보를 가져오는 함수
  const getLoginInfo = async () => {
    try {
      const loginInfo = await SecureStore.getItemAsync('loginInfo');
      if (loginInfo) {
        const loginData = JSON.parse(loginInfo);
        setUserInfo(loginData);
      } else {
        setUserInfo(null);    
      }
    } catch (error) {
        setUserInfo(null);  
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLoginInfo();
    }, [])
  ); 


  // 로그아웃
  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            console.log('🔴 마이페이지 로그아웃 시작');
            
            await logout(); // ✅ Context의 logout 사용
            setUserInfo(null); // ✅ if 제거
            
            console.log('🔴 router.replace("/(tabs)/product") 호출');
            router.replace('/(tabs)/product'); // ✅ 직접 product로
          } catch (error) {
            console.error('로그아웃 에러:', error);
            Alert.alert('오류', '로그아웃에 실패했습니다.');
          }
        },
      },
    ]);
  };  

  // 메뉴 아이템 데이터
  const menuItems = [
    { id: 1, icon: <Ionicons name="receipt-outline" size={24} color="black" />, title: '주문목록', route: '/my-page/orders' },
    { id: 2, icon: <Ionicons name="cart-outline" size={24} color="black" />, title: '장바구니', route: '/product/product-detail/shop' },
    { id: 3, icon: <Ionicons name="heart-outline" size={24} color="black" />, title: '찜한상품', route: '/my-page/dibs' },
    { id: 4, icon: <AntDesign name="question-circle" size={24} color="black" />, title: '문의목록', route: '/my-page/qna' },
    { id: 5, icon: <Ionicons name="star-outline" size={24} color="black" />, title: '상품후기', route: '/my-page/reviews' },
    { id: 6, icon: <Ionicons name="person-outline" size={24} color="black" />, title: '회원정보 수정', route: '/my-page/profile-edit' },    
  ];

  // 메뉴 클릭 핸들러
  const handleMenuPress = (route) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.userHeader}>
          <View style={styles.userIconContainer}>
            <Ionicons name="person" size={44} color={colors.BROWN} />
          </View>
          <View style={styles.userInfoContainer}>
            {userInfo ? (
              <>
                <Text style={styles.userName}>{userInfo.memName || userInfo.memId}님</Text>
                <Text style={styles.userEmail}>{userInfo.memId}</Text>
              </>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>                
                <Pressable onPress={() => router.push('/auth/login')}>
                  {({pressed}) => (
                    <Text style={[
                      styles.userName, 
                      { textDecorationLine: 'underline' },
                      pressed && { opacity: 0.7 }
                    ]}>
                      로그인
                    </Text>
                  )}
                </Pressable>
                <Text style={styles.userName}>이 필요합니다</Text>
              </View>
            )}
          </View>
        </View>

        {/* 메뉴 그리드 (3x2) */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={({pressed}) => [
                styles.menuItem,
                pressed && styles.menuItemPressed
              ]}
              onPress={() => handleMenuPress(item.route)}
            >
              {({pressed}) => (
                <View style={styles.menuContent}>
                  <View style={styles.menuIcon}>
                    {React.cloneElement(item.icon, { 
                      color: pressed ? colors.BROWN : 'black' 
                    })}
                  </View>
                  <Text style={[
                    styles.menuTitle,
                    pressed && { color: colors.BROWN }
                  ]}>
                    {item.title}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* 로그아웃 버튼 */}
        {userInfo && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        )}

        <View style={styles.imageSection}>            
          <Image 
            source={require('@/assets/images/header0.png')} 
            style={styles.image}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    
  },
  scrollView: {
    flex: 1,
  },
  userHeader: {
    backgroundColor: colors.BROWN,
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  menuItem: {
    width: '50%',    
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingVertical: 20,    
  },
  menuContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  menuIcon: {
    marginBottom: 6,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logoutText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  imageSection: {
    paddingTop: 10,
    marginTop: 'auto'
  },
  image: {
    width: '100%',
    height: 50, 
    resizeMode: 'cover',
  },
  menuItemPressed: {
    backgroundColor: '#f0f0f0',
  },
});