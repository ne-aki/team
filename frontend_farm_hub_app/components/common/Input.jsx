import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../constants/colorConstant';

const Input = ({label='', isPw=false, containerStyle, ...props}) => {  
  const [focus, setFocus] = useState(false);

  return (
    <View style={containerStyle}> 
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput 
        style={[styles.input, focus && styles.focused]} 
        onFocus={() => setFocus(true)}        
        onBlur={()=>setFocus(false)}
        secureTextEntry={isPw}
        {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  input: {
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    height: 42,
    borderRadius: 7,
    paddingHorizontal: 10
  },

  label: {
    marginBottom: 6,
    fontSize: 16,
    color: colors.GRAY_700,
    fontWeight: '600'
  },

  focused: {
    borderColor: colors.BROWN
  }
})