import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './contexts/AuthContext'; 
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { userRole, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    const init = async () => {
      console.log('index.jsx - 시작');
      await checkAuth();
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && userRole) {
      console.log('index.jsx - userRole:', userRole);
      
      if (userRole === 'ADMIN') {
        console.log('index.jsx - 관리자 홈으로 이동');
        router.replace('/(tabs)/(home)');
      } else {
        console.log('index.jsx - product로 이동');
        router.replace('/(tabs)/product');
      }
    }
  }, [isLoading, userRole, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8B4513" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});