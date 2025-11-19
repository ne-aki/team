import React, { createContext, useState, useContext, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    console.log('🔵 AuthContext - checkAuth 실행');
    setIsLoading(true);
    try {
      const loginInfo = await SecureStore.getItemAsync('loginInfo');
      console.log('AuthContext - SecureStore:', loginInfo);
      
      if (loginInfo) {
        const loginData = JSON.parse(loginInfo);
        console.log('AuthContext - 역할:', loginData.memRole);
        setUserRole(loginData.memRole);
      } else {
        console.log('AuthContext - 로그인 안 함');
        setUserRole('USER');
      }
    } catch (error) {
      console.error('AuthContext - 에러:', error);
      setUserRole('USER');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('🔴 AuthContext - logout 실행');
    await SecureStore.deleteItemAsync('loginInfo');
    setUserRole('USER'); 
    console.log('🔴 AuthContext - userRole을 USER로 변경');
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, isLoading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};