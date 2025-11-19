import { StyleSheet, ActivityIndicator, View } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext'; 

const TabLayout = () => {
  const { userRole, isLoading, checkAuth } = useAuth(); 

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  const isAdmin = userRole === 'ADMIN';

  if (isAdmin) {
    return (
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen 
          name='(home)'
          options={{
            title: 'Home',
            tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
          }}
        />
        <Tabs.Screen 
          name='control'
          options={{
            title: 'Control',
            tabBarIcon: () => <FontAwesome name="gear" size={24} color="black" />
          }}
        />
        <Tabs.Screen 
          name='product'
          options={{
            title: 'Product',
            tabBarIcon: () => <FontAwesome name="shopping-cart" size={24} color="black" />
          }}
        />
        <Tabs.Screen
          name='my-page'
          options={{
            title: 'My Page',
            tabBarIcon: () => <FontAwesome name='user' size={24} color="black" />
          }}
        />
        <Tabs.Screen 
          name='alarm'
          options={{ href: null }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name='product'
        options={{
          title: 'Product',
          tabBarIcon: () => <FontAwesome name="shopping-cart" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name='my-page'
        options={{
          title: 'My Page',
          tabBarIcon: () => <FontAwesome name='user' size={24} color="black" />
        }}
      />
      <Tabs.Screen 
        name='(home)'
        options={{ href: null }}
      />
      <Tabs.Screen 
        name='control'
        options={{ href: null }}
      />
      <Tabs.Screen 
        name='alarm'
        options={{ href: null }}
      />
    </Tabs>
  );
}

export default TabLayout;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});