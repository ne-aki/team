import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import axios from 'axios';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import PageTitle from '@/components/common/PageTitle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERVER_URL } from '@/constants/appConst';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/constants/colorConstant';
import Postcode from 'react-native-daum-postcode';
import handleErrorMsg from '@/validate/joinValidate'

const Join = () => {
  const router = useRouter();
  
  const [pwQ, setPwQ] = useState([])
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    memId: '',
    memPw: '',
    confirmPw: '',
    pwKey: '',
    pwAnswer: ''
  });

  const [newShopMember, setNewShopMember] = useState({
    'memId': '',
    'memPw': '',
    'confirmPw': '',
    'memName': '',
    'memTelArr': ['', '', ''],
    'firstEmail': '',
    'secondEmail': '',
    'memEmail': '',
    'memAddr': '',
    'addrDetail': '',
    'pwKey': '',
    'pwAnswer': ''
  });

  useEffect(() => {
    const fetchPwQuestions = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/members/pw-question`);
        setPwQ(res.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchPwQuestions();
  }, []);

  const handleFirstEmailChange = (text) => {
    setNewShopMember({
      ...newShopMember,
      firstEmail: text,
      memEmail: text + newShopMember.secondEmail
    });
  };

  const handleSecondEmailChange = (text) => {
    setNewShopMember({
      ...newShopMember,
      secondEmail: text,
      memEmail: newShopMember.firstEmail + text
    });
  };

  const handleInputChange = (name, value) => {
    setNewShopMember({
      ...newShopMember,
      [name]: value
    });
  };

  const checkId = async () => {
    if (!newShopMember.memId) {
      Alert.alert('알림', '아이디를 입력하세요');
      return;
    }
    try {
      const res = await axios.get(`${SERVER_URL}/members/${newShopMember.memId}`);
      if (res.data === true) {
        Alert.alert('확인', '사용 가능한 아이디입니다');
      } else {
        Alert.alert('확인', '이미 사용 중인 아이디입니다');
      }
    } catch (error) {
      console.error('ID 확인 에러:', error);
      Alert.alert('오류', 'ID 확인에 실패했습니다');
    }
  };

  // 폼 검증 useEffect 추가
  useEffect(() => {
    const isValid = 
      newShopMember.memId &&
      newShopMember.memPw &&
      newShopMember.memPw === newShopMember.confirmPw &&
      newShopMember.memName &&
      newShopMember.pwKey &&
      newShopMember.pwAnswer &&
      !errorMsg.memId &&
      !errorMsg.memPw &&
      !errorMsg.confirmPw &&
      !errorMsg.pwKey &&
      !errorMsg.pwAnswer;
    
    setIsDisabledBtn(!isValid);
  }, [newShopMember, errorMsg]);

  const getAddressBook = () => {
    setIsModalVisible(true);
  };

  const handleAddressComplete = (data) => {
    setNewShopMember({
      ...newShopMember,
      memAddr: data.address
    });
    setIsModalVisible(false);
  };

  const regNewShopMember = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/members`, newShopMember); 
      Alert.alert('회원가입 완료', '회원으로 등록되었습니다');        
        
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/product');
      
    } catch (error) {
      console.error('회원가입 에러:', error);
      console.error('에러 상세:', error.response?.data);
      if (error.response) {
        Alert.alert('회원가입 실패', error.response.data?.message || '회원가입에 실패했습니다');
      } else {
        Alert.alert('오류', '서버와의 연결에 실패했습니다');
      }
    }
  };   

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={styles.container}>
      <PageTitle title='회원가입' />      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}        
      >        
          <ScrollView 
            contentContainerStyle={{ paddingBottom: 0 }}  
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{marginTop: 17, marginBottom: 0}} 
          >

             <View style={[styles.addressContainer, { marginTop: 12 }]}>
              <View style={{ flex: 1 }}>
                <Input 
                  name="memId" 
                  value={newShopMember.memId}  
                  label='아이디'
                  placeholder="아이디를 입력하세요"
                  onChangeText={(text) => handleInputChange('memId', text)}
                  returnKeyType="next"
                  autoCapitalize="none"
                  autoCorrect={false}
                  />  
              </View>
              <Button 
                style={{ width: '30%', marginTop: 8 }}   
                title='중복확인' 
                onPress={checkId}
              />
              {errorMsg.memId && <Text style={styles.errorText}>{errorMsg.memId}</Text>}
            </View>

            <View style={{ marginBottom: 12 }}>
              <Input             
                name="memPw" 
                value={newShopMember.memPw} 
                label='비밀번호'
                isPw={true}
                placeholder="비밀번호를 입력하세요"
                onChangeText={(text) => {
                  setIsDisabledBtn(true);
                  handleInputChange('memPw', text);
                  setErrorMsg({
                    ...errorMsg, 
                    memPw: handleErrorMsg('memPw', text, newShopMember)
                  });
                }}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}  
              />
              {errorMsg.memPw && <Text style={styles.errorText}>{errorMsg.memPw}</Text>}
            </View>
            
            {/* 비밀번호 확인 */}
            <View style={{ marginBottom: 12 }}>
              <Input 
                name="confirmPw" 
                value={newShopMember.confirmPw} 
                label='비밀번호 확인'
                isPw={true}
                placeholder="비밀번호를 다시 입력하세요"
                onChangeText={(text) => {
                  handleInputChange('confirmPw', text);
                  setErrorMsg({
                    ...errorMsg, 
                    confirmPw: handleErrorMsg('confirmPw', text, newShopMember)
                  });
                }}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}  
              />
              {errorMsg.confirmPw && <Text style={styles.errorText}>{errorMsg.confirmPw}</Text>}
            </View>

            {/* 회원명 */}
            <View style={{ marginBottom: 12 }}>
              <Input 
                name="memName" 
                value={newShopMember.memName} 
                label='회원명'
                placeholder="이름을 입력하세요"
                onChangeText={(text) => handleInputChange('memName', text)}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
              /> 
            </View>
            
            {/* 연락처 */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>연락처</Text>
              <View style={styles.telContainer}>
                <View style={styles.telInput}>
                  <Input 
                    name='memTelArr'
                    label=''
                    value={newShopMember.memTelArr[0]}
                    onChangeText={(text) => {
                      setNewShopMember({
                        ...newShopMember,
                        memTelArr: [text, newShopMember.memTelArr[1], newShopMember.memTelArr[2]]
                      });
                    }}
                    placeholder="010"
                    keyboardType="phone-pad"
                    maxLength={3}              
                  />
                </View>
                <Text style={styles.telSeparator}>-</Text>
                <View style={styles.telInput}>
                  <Input 
                    name='memTelArr'
                    label=''
                    value={newShopMember.memTelArr[1]}
                    onChangeText={(text) => {
                      setNewShopMember({
                        ...newShopMember,
                        memTelArr: [newShopMember.memTelArr[0], text, newShopMember.memTelArr[2]]
                      });
                    }}
                    placeholder="1234"
                    keyboardType="phone-pad"
                    maxLength={4}
                  />
                </View>
                <Text style={styles.telSeparator}>-</Text>
                <View style={styles.telInput}>
                  <Input 
                    name='memTelArr'
                    label=''
                    value={newShopMember.memTelArr[2]}
                    onChangeText={(text) => {
                      setNewShopMember({
                        ...newShopMember,
                        memTelArr: [newShopMember.memTelArr[0], newShopMember.memTelArr[1], text]
                      });
                    }}
                    placeholder="5678"
                    keyboardType="phone-pad"
                    maxLength={4}
                  />
                </View>
              </View>
            </View>

            {/* 이메일 */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.telContainer}>
                <View style={styles.telInput}>
                  <Input 
                    name='firstEmail'
                    label=''
                    value={newShopMember.firstEmail}
                    onChangeText={(text) => handleFirstEmailChange(text)}
                    returnKeyType="next"
                    placeholder="이메일을 입력하세요"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}             
                  />
                </View>
                <Text style={styles.telSeparator}>@</Text>
                <View style={styles.emailPicker}>
                  <Picker
                    selectedValue={newShopMember.secondEmail}
                    onValueChange={(value) => handleSecondEmailChange(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="선택" value="" />
                    <Picker.Item label="gmail.com" value="@gmail.com" />
                    <Picker.Item label="naver.com" value="@naver.com" />
                    <Picker.Item label="hanmail.net" value="@hanmail.net" />
                  </Picker>
                </View>
              </View>          
            </View>    

            <View style={styles.addressContainer}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={getAddressBook}>
                  <Input
                    label="주소"
                    value={newShopMember.memAddr}
                    editable={false}
                    placeholder="주소를 검색하세요"
                    pointerEvents="none"
                  />
                </TouchableOpacity>
              </View>
              <Button 
                style={{ width: '30%', marginBottom: 5 }}   
                title='검색' 
                onPress={getAddressBook}
              />
            </View>

            {/* 상세 주소 */}
            <View style={{ marginBottom: 12 }}>
              <Input
                label="상세 주소"
                value={newShopMember.addrDetail}
                onChangeText={(text) => handleInputChange('addrDetail', text)}
                placeholder="상세 주소를 입력하세요"
              />
            </View>

            {/* 주소 검색 모달 */}
            <Modal
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>주소 검색</Text>
                  <TouchableOpacity 
                    onPress={() => setIsModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Postcode
                  style={styles.postcode}
                  jsOptions={{ animation: true }}
                  onSelected={handleAddressComplete}
                  onError={(error) => {
                    console.error('주소 검색 에러:', error);
                    Alert.alert('오류', '주소 검색에 실패했습니다');
                  }}
                />
              </View>
            </Modal>

            {/* 비밀번호 찾기 질문 */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>비밀번호 찾기 질문</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={newShopMember.pwKey}
                  onValueChange={(value) => {
                    handleInputChange('pwKey', value);
                    setIsDisabledBtn(true);
                    setErrorMsg({
                      ...errorMsg,
                      pwKey: handleErrorMsg('pwKey', value, newShopMember)
                    });
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="선택" value="" />
                  {pwQ.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item.pwQuestion} 
                      value={item.pwKey} 
                    />
                  ))}
                </Picker>
              </View>            
              {errorMsg.pwKey && <Text style={styles.errorText}>{errorMsg.pwKey}</Text>}
            </View>

            {/* 비밀번호 찾기 답변 */}
            <View style={{ marginBottom: 12 }}>
              <Input
                label="비밀번호 찾기 답변"
                value={newShopMember.pwAnswer}
                onChangeText={(text) => {
                  handleInputChange('pwAnswer', text);
                  setIsDisabledBtn(true);
                  setErrorMsg({
                    ...errorMsg,
                    pwAnswer: handleErrorMsg('pwAnswer', text, newShopMember)
                  });
                }}
                placeholder="답변을 입력하세요"
              />            
              {errorMsg.pwAnswer && <Text style={styles.errorText}>{errorMsg.pwAnswer}</Text>}
            </View>
          </ScrollView>
          
            <View style={{ marginTop: 0, marginBottom: 5 }}>
              <Button 
                disabled={isDisabledBtn} 
                onPress={regNewShopMember} 
                title='회원가입' 
              />
            </View>

            <Pressable 
              style={styles.loginLink} 
              onPress={() => {
                if (router.canDismiss()) {
                  router.dismissAll();
                }
                router.replace('/login');
              }}
            >
              <Text style={styles.loginText}>로그인</Text>
            </Pressable>

            <Pressable 
            style={[styles.loginLink, { marginBottom: 15 }]}        
              onPress={() => {
                if (router.canDismiss()) {
                  router.dismissAll();
                }
                router.replace('/product');
              }}
            >
              <Text style={styles.loginText}>메인화면</Text>
            </Pressable>      

          
      </KeyboardAvoidingView >
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff', 
    paddingRight: 15,
    paddingLeft: 15,
  },
  label: { 
    marginBottom: 4,
    fontSize: 16,
    color: colors.GRAY_700,
    fontWeight: '600'
  },
  emailPicker: {
    flex: 1,
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    borderRadius: 7,
    height: 42,
    justifyContent: 'center',
  },
  pickerWrapper: {
    borderColor: colors.BROWN_LIGHT,
    borderWidth: 1,
    borderRadius: 7,
    height: 42,
    justifyContent: 'center',
    marginBottom: 8,
  },
  telSeparator: {
    fontSize: 16,
    color: colors.GRAY_500,
    paddingBottom: 8,
  },
  telContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  telInput: {
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row', 
    gap: 10, 
    alignItems: 'flex-end', 
    marginBottom: 12
  },
  loginLink: {
    alignItems: 'flex-end',
    paddingVertical: 1,
  },
  loginText: {
    textDecorationLine: 'underline',
    color: colors.GRAY_700,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.BROWN_LIGHT,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: colors.GRAY_700,
  },
  postcode: {
    flex: 1,
  },
});

export default Join