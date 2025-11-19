import { router, useSegments } from 'expo-router'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '@/constants/colorConstant'

const Menu = ({ activeMenu  }) => {
  
  const currentMenu = activeMenu 

  const menuItems = [
    { id: 'new-product', title: '신상품', path: '/product/new-product' },
    { id: 'popular-product', title: '인기상품', path: '/product/popular-product' },
    { id: 'discount-product', title: '할인상품', path: '/product/discount-product' },
    { id: 'gift-set', title: '선물세트', path: '/product/gift-set' }, 
  ]

  return (
    <View style={styles.menuWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.menu}
        contentContainerStyle={styles.menuContent}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              currentMenu === item.id && styles.activeMenuItem
            ]}
            onPress={() => {
              router.replace(item.path)
            }}
          >
            <Text style={[
              styles.menuText,
              currentMenu === item.id && styles.activeMenuText
            ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({
  menuWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  menu: {
    flexGrow: 0,
  },
  menuContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  menuItem: {
    paddingHorizontal: 23,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMenuItem: {
    borderBottomColor: colors.BROWN,
  },
  menuText: {
    fontSize: 16,
    color: '#666',
  },
  activeMenuText: {
    fontWeight: 'bold',
    color: colors.BROWN,
  },
})