import { Alert, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { Keyboard } from 'react-native';

const AlarmScreen = () => {
  const router = useRouter(); 
  const [userInfo, setUserInfo] = useState(null);

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

const handleLogout = async () => {
  Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
    { text: '취소', style: 'cancel' },
    {
      text: '확인',
      onPress: async () => {
        try {
          await SecureStore.deleteItemAsync('loginInfo');
          router.replace('/auth/login');
        } catch (error) {
          console.error('로그아웃 에러:', error);
          Alert.alert('오류', '로그아웃에 실패했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}> 
        <Text>AlarmScreen 입니다</Text>

        <Text>
          {userInfo ? `로그인: ${userInfo.memId}` : '로그인 안 함'}
        </Text>      

        <Pressable onPress={() => router.push('/auth/login')}>
          <Text>로그인 페이지로 이동</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/auth/join')}>
          <Text>회원가입 페이지로 이동</Text>
        </Pressable>  
        <Pressable onPress={() => router.push('/auth/forgotPw')}>
          <Text>비밀번호 찾기</Text>
        </Pressable>  
        <Pressable onPress={() => router.push('/auth/renewalPw')}>
          <Text>비밀번호 변경</Text>
        </Pressable>      
        <Pressable onPress={() => router.push('/product/product-detail/shop')}>
          <Text>장바구니</Text>
        </Pressable>    
        <Pressable onPress={handleLogout}>
          <Text>로그아웃</Text>
        </Pressable>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default AlarmScreen

const styles = StyleSheet.create({  
  container: {
    flex: 1,
  }
})