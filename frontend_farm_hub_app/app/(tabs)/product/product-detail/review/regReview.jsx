import { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { SERVER_URL } from '@/constants/appConst';
import { colors } from '@/constants/colorConstant';

const RegReview = ({ itemNum, isOpenRegReview, onClose }) => {
  // 로그인 정보
  const [memId, setMemId] = useState(null);

  // 리뷰 데이터
  const [reviewData, setReviewData] = useState({
    title: '',
    rating: 0,
    content: '',
  });

  // 에러 메시지
  const [errorMsg, setErrorMsg] = useState({
    title: '',
    rating: '',
    content: '',
  });

  // 리뷰 이미지들
  const [reviewImgs, setReviewImgs] = useState([]);

  // 등록 중 여부 (중복 클릭 방지)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 정보 가져오기
  useEffect(() => {
    const getLoginInfo = async () => {
      try {
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          setMemId(loginData.memId);
        }
      } catch (error) {
        console.error('로그인 정보 파싱 에러:', error);
      }
    };
    getLoginInfo();
  }, []);

  // 상태 초기화 함수
  const resetForm = () => {
    setReviewData({
      title: '',
      rating: 0,
      content: '',
    });
    setErrorMsg({
      title: '',
      rating: '',
      content: '',
    });
    setReviewImgs([]);
    setIsSubmitting(false);
  };

  // 이미지 선택
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setReviewImgs(result.assets);
      }
    } catch (error) {
      console.error('이미지 선택 에러:', error);
      Alert.alert('오류', '이미지 선택에 실패했습니다.');
    }
  };
  // 리뷰 등록 (이미지 있음)
  const regNewReview = async () => {
    if (isSubmitting) return;

    if (!reviewData.title) {
      Alert.alert('알림', '리뷰 제목은 비워둘 수 없습니다');
      return;
    }
    if (!reviewData.rating) {
      Alert.alert('알림', '별점은 비워둘 수 없습니다');
      return;
    }
    if (!reviewData.content) {
      Alert.alert('알림', '리뷰 내용은 비워둘 수 없습니다');
      return;
    }

    const formData = new FormData();

    // 이미지 추가
    reviewImgs.forEach((img, index) => {
      const uriParts = img.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('reviewImgs', {
        uri: Platform.OS === 'ios' ? img.uri.replace('file://', '') : img.uri,
        name: `review_${index}.${fileType}`,
        type: `image/${fileType}`,
      });
    });

    formData.append('title', reviewData.title);
    formData.append('rating', reviewData.rating);
    formData.append('content', reviewData.content);
    formData.append('memId', memId);
    formData.append('itemNum', itemNum);

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${SERVER_URL}/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('✅ 서버 응답:', response.data);

      if (response.data.success) {
        Alert.alert('성공', response.data.message);
        resetForm();
        onClose(true); 
      } else {
        Alert.alert('실패', response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ 에러 발생:', error);

      if (error.response) {
        Alert.alert('오류', error.response.data.message || '리뷰 등록에 실패했습니다.');
      } else if (error.request) {
        Alert.alert('오류', '서버와 통신할 수 없습니다.');
      } else {
        Alert.alert('오류', '요청 처리 중 오류가 발생했습니다.');
      }

      setIsSubmitting(false);
    }
  };

  // 리뷰 등록 (이미지 없음)
  const regNewReviewNoImg = async () => {
    if (isSubmitting) return;

    if (!reviewData.title) {
      Alert.alert('알림', '리뷰 제목은 비워둘 수 없습니다');
      return;
    }
    if (!reviewData.rating) {
      Alert.alert('알림', '별점은 비워둘 수 없습니다');
      return;
    }
    if (!reviewData.content) {
      Alert.alert('알림', '리뷰 내용은 비워둘 수 없습니다');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${SERVER_URL}/reviews/noimg`,
        {
          ...reviewData,
          memId: memId,
          itemNum: itemNum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('✅ 서버 응답:', response.data);

      if (response.data.success) {
        Alert.alert('성공', response.data.message);
        resetForm();
        onClose(true);
      } else {
        Alert.alert('실패', response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ 에러 발생:', error);

      if (error.response) {
        Alert.alert('오류', error.response.data.message || '리뷰 등록에 실패했습니다.');
      } else if (error.request) {
        Alert.alert('오류', '서버와 통신할 수 없습니다.');
      } else {
        Alert.alert('오류', '요청 처리 중 오류가 발생했습니다.');
      }

      setIsSubmitting(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose(false); 
  };

  return (
    <Modal visible={isOpenRegReview} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 모달 헤더 */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>이용 후기 작성</Text>
            <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* 제목 입력 */}
            <View style={styles.inputGroup}>
              <Input
                label="제목"
                value={reviewData.title}
                onChangeText={(text) =>
                  setReviewData({ ...reviewData, title: text })
                }
                placeholder="제목을 입력하세요"
                editable={!isSubmitting}
              />
              {errorMsg.title ? (
                <Text style={styles.errorMsg}>{errorMsg.title}</Text>
              ) : null}
            </View>

            {/* 별점 선택 */}
            <View style={styles.inputGroup}>
              <View style={styles.starWrapper}>
                <Text style={styles.starLabel}>별점</Text>
                <View style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                      disabled={isSubmitting}
                    >
                      <Text style={styles.star}>
                        {star <= reviewData.rating ? '★' : '☆'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {errorMsg.rating ? (
                <Text style={styles.errorMsg}>{errorMsg.rating}</Text>
              ) : null}
            </View>

            {/* 내용 입력 */}
            <View style={styles.inputGroup}>
              <Textarea
                label="내용"
                value={reviewData.content}
                onChangeText={(text) =>
                  setReviewData({ ...reviewData, content: text })
                }
                placeholder="리뷰 내용을 입력하세요"
                numberOfLines={6}
                editable={!isSubmitting}
                showCounter={true}
                maxLength={500}
              />
              {errorMsg.content ? (
                <Text style={styles.errorMsg}>{errorMsg.content}</Text>
              ) : null}
            </View>

            {/* 이미지 추가 */}
            <View style={styles.inputGroup}>
              <Text style={styles.imageLabel}>이미지 추가 (여러장 가능)</Text>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={pickImage}
                disabled={isSubmitting}
              >
                <Text style={styles.imageButtonText}>
                  이미지 선택 ({reviewImgs.length}장)
                </Text>
              </TouchableOpacity>
              <Text style={styles.infoMsg}>이미지는 선택 사항입니다</Text>
            </View>
          </ScrollView>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <Button
              title={isSubmitting ? '등록 중...' : '리뷰 등록'}
              onPress={() => {
                if (!isSubmitting) {
                  reviewImgs.length > 0 ? regNewReview() : regNewReviewNoImg();
                }
              }}
              bgColor={colors.BROWN}
              style={styles.submitButton}
            />
            <Button
              title="취소"
              onPress={handleClose}
              bgColor={colors.GRAY_500}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RegReview;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#aaaaaa',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 28,
    color: '#999',
  },
  scrollView: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  starWrapper: {
    marginBottom: 8,
  },
  starLabel: {
    marginBottom: 6,
    fontSize: 16,
    color: colors.GRAY_700,
    fontWeight: '600',
  },
  starContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  star: {
    fontSize: 30,
    color: colors.BROWN,
  },
  imageLabel: {
    marginBottom: 6,
    fontSize: 16,
    color: colors.GRAY_700,
    fontWeight: '600',
  },
  imageButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 4,
  },
  imageButtonText: {
    fontSize: 14,
    color: '#333',
  },
  errorMsg: {
    color: 'crimson',
    fontSize: 12,
    marginTop: 4,
  },
  infoMsg: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    height: 45,
  },
  cancelButton: {
    flex: 1,
    height: 45,
  },
});