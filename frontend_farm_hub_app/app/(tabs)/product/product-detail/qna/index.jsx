import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import Button from '../../../../../components/common/Button';
import { SERVER_URL } from '../../../../../constants/appConst';
import { colors } from '../../../../../constants/colorConstant';
import Textarea from '../../../../../components/common/Textarea'

const QnA = () => {
  // URL 파라미터에서 itemNum 가져오기
  const { itemNum } = useLocalSearchParams();

  // 로그인 정보
  const [memId, setMemId] = useState(null);

  // 글 등록 후 리렌더링 할 state 변수
  const [reload, setReload] = useState(0);

  // QnA 리스트
  const [qnaList, setQnaList] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 문의 모달창 보이기/숨기기
  const [isOpenQnA, setIsOpenQnA] = useState(false);

  // QNA 내용을 저장할 state 변수
  const [qnaContent, setQnaContent] = useState('');

  const router = useRouter();

  // 로그인 정보 가져오기 (SecureStore 사용)
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

  // QnA 목록 조회
  useEffect(() => {
    if (!itemNum) return;

    setLoading(true);
    axios
      .get(`${SERVER_URL}/qna/${itemNum}`)
      .then((res) => {
        setQnaList(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [reload, itemNum]);

  // QnA 등록 함수
  const regQnA = () => {
    if (!qnaContent.trim()) {
      Alert.alert('알림', '문의사항을 작성해주세요.');
      return;
    }

    const qnaData = {
      content: qnaContent,
      itemNum: itemNum,
      memId: memId,
    };

    axios
      .post(`${SERVER_URL}/qna`, qnaData)
      .then(() => {
        Alert.alert('알림', '상품 문의가 등록되었습니다.');
        setQnaContent('');
        setReload(reload + 1);
        setIsOpenQnA(false);
      })
      .catch((e) => {
        console.log(e);
        Alert.alert('오류', '문의 등록에 실패했습니다.');
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>상품 문의</Text>
        {memId ? (
          <Button
            title="문의하기"
            onPress={() => setIsOpenQnA(true)}
            bgColor={colors.BROWN}
            style={styles.askButton}
          />
        ) : (
          <Text style={styles.loginRequiredText}>
            상품문의는{' '} 
            <Text 
              style={[styles.loginRequiredText, { textDecorationLine: 'underline' }]}
              onPress={() => router.push('/auth/login')}
            >
              로그인
            </Text>
            {' '}후 이용가능합니다.
          </Text>
        )}
      </View>

      {/* QnA 리스트 */}
      <ScrollView style={styles.qnaList}>
        {qnaList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 문의가 없습니다.</Text>
          </View>
        ) : (
          qnaList.map((qna, index) => (
            <View key={index} style={styles.qnaItem}>
              {/* 문의 번호/작성자/날짜 */}
              <View style={styles.itemInfo}>
                <Text style={styles.infoLeft}>
                  {qna.qnaDTO.qnaNum} / {qna.qnaDTO.memId}
                </Text>
                <Text style={styles.infoRight}>
                  {dayjs(qna.qnaDTO.qnaDate).format('YYYY/MM/DD HH:mm:ss')}
                </Text>
              </View>

              {/* 질문 섹션 */}
              <View style={styles.questionSection}>
                <View style={styles.question}>
                  <Text style={styles.qLabel}>Q.</Text>
                  <Text style={styles.qContent}>{qna.qnaDTO.content}</Text>
                </View>
              </View>

              {/* 답변 섹션 */}
              <View style={styles.answerSection}>
                {qna.replyContent ? (
                  <>
                    {/* 답변 작성자/날짜 */}
                    <View style={styles.answerInfo}>
                      <Text style={styles.answerInfoLeft}>{qna.replyMemId}</Text>
                      <Text style={styles.answerInfoRight}>
                        {dayjs(qna.replyDate).format('YYYY/MM/DD HH:mm:ss')}
                      </Text>
                    </View>
                    {/* 답변 내용 */}
                    <View style={styles.answer}>
                      <Text style={styles.aLabel}>A.</Text>
                      <Text style={styles.aContent}>{qna.replyContent}</Text>
                    </View>
                  </>
                ) : (
                  // 답변 대기중
                  <View style={styles.answerPending}>
                    <Text style={styles.aLabel}>A.</Text>
                    <Text style={styles.pendingText}>답변 준비중...</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 문의 등록 모달 */}
      <Modal
        visible={isOpenQnA}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpenQnA(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>상품 문의</Text>
              <TouchableOpacity onPress={() => setIsOpenQnA(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 문의 입력 */}
            
            <Textarea
              // style={styles.textarea}
              placeholder="문의사항을 작성해주세요."
              value={qnaContent}
              onChangeText={setQnaContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* 등록 버튼 */}
            <Button
              title="등록하기"
              onPress={regQnA}
              bgColor={colors.BROWN}
              style={styles.submitButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QnA;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 헤더 영역
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  askButton: {
    width: 100,
    height: 36,
  },
  loginRequiredText: {
    fontSize: 12,
    color: '#999',
  },
  // QnA 리스트
  qnaList: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  // QnA 아이템
  qnaItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // 문의 정보 (번호/작성자/날짜)
  itemInfo: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLeft: {
    fontSize: 14,
    color: '#374151',
    fontWeight: 'bold',
  },
  infoRight: {
    fontSize: 11,
    color: '#6b7280',
  },
  // 질문 섹션
  questionSection: {
    padding: 16,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  qLabel: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 18,
  },
  qContent: {
    flex: 1,
    color: '#1f2937',
    lineHeight: 22,
    fontSize: 14,
  },
  // 답변 섹션
  answerSection: {
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  answerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  answerInfoLeft: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  answerInfoRight: {
    fontSize: 11,
    color: '#6b7280',
  },
  answer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  aLabel: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 18,
  },
  aContent: {
    flex: 1,
    color: '#1f2937',
    lineHeight: 22,
    fontSize: 14,
  },
  answerPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  pendingText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },
  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  // textarea: {
  //   //borderWidth: 1,
  //   //borderRadius: 8,
  //   //padding: 12,
  //   //fontSize: 14,
  //   //minHeight: 150,
  //   //marginBottom: 16,
  // },
  submitButton: {
    height: 45,
  },
});