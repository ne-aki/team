import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/colorConstant'

// title: 버튼 텍스트 (문자열)
// children: 버튼 내용 (JSX 요소 - title보다 우선)
// size: 버튼 크기 ('large' | 'normal')
// bgColor: 배경색 (기본값: colors.BROWN)
// textColor: 텍스트 색상 (기본값: 'white')
// onPress: 클릭 시 실행할 함수
const Button = ({
  title='버튼', 
  children,
  size='large', 
  bgColor, 
  textColor='white', 
  onPress, 
  disabled=false, 
  style, 
  ...props
}) => {
  return (
    <Pressable
      style={({pressed})=>[
        styles.buttonContainer, 
        styles[size], 
        { backgroundColor: bgColor || colors.BROWN }, 
        pressed && !disabled && styles.pressed,
        style,
        disabled && styles.disabled
      ]}
      onPress={disabled ? null : onPress}
      disabled={disabled}
      {...props}
    >
      {children ? (
        // children이 있으면 children 사용 (JSX 가능)
        typeof children === 'string' ? (
          <Text style={[
            styles.btnTitle,
            { color: textColor },
            disabled && styles.disabledText
          ]}>
            {children}
          </Text>
        ) : (
          children
        )
      ) : (
        // children이 없으면 기존처럼 title 사용
        <Text style={[
          styles.btnTitle,
          { color: textColor },
          disabled && styles.disabledText
        ]}>
          {title}
        </Text>
      )}
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.BROWN,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,    
    marginTop: 5,
    flexDirection: 'row',  // 아이콘과 텍스트를 가로로 배치
    gap: 6,  // 아이콘과 텍스트 사이 간격
  },
  btnTitle:{
    fontSize: 14.5,
    fontWeight: '600'
  },
  large:{
    width: '100%',
    height: 34
  },
  normal:{
    width: '70%',
    height: 30
  },
  pressed:{
    opacity: 0.8
  },
  disabled:{
    backgroundColor: '#cccccc',
    opacity: 0.6
  },
  disabledText:{
    color: '#666666'
  }
})