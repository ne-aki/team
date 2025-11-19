import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import { Ionicons } from '@expo/vector-icons';
import PageTitle from '@/components/common/PageTitle';
import { SERVER_URL } from '@/constants/appConst';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colorConstant';

const QnaMyPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null); 
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  const itemsPerPage = 5;

  // 로그인 정보 가져오기
  useEffect(() => {
    const getLoginInfo = async () => {
      try {
        setAuthLoading(true);
        const loginInfo = await SecureStore.getItemAsync('loginInfo');
        if (loginInfo) {
          const loginData = JSON.parse(loginInfo);
          setUserInfo(loginData);
        } else {
          Alert.alert('알림', '로그인이 필요합니다.', [
            {
              text: '확인',
              onPress: () => router.push('/auth/login'),
            },
          ]);
        }
      } catch (error) {
        console.error('로그인 정보 파싱 에러:', error);
        Alert.alert('오류', '로그인 정보를 불러오는데 실패했습니다.');
      } finally {
        setAuthLoading(false);
      }
    };
    getLoginInfo();
  }, []);

  // 문의 목록 조회
  useEffect(() => {
    if (!userInfo?.memId) return;
    
    const fetchQnaList = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${SERVER_URL}/reply/user/${userInfo.memId}`);
        setQnaList(res.data);
      } catch (error) {
        console.error('문의 목록 조회 에러:', error);
        Alert.alert('오류', '문의 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchQnaList();
  }, [userInfo]);

  // 현재 페이지 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQnaList = qnaList.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 총 페이지 수
  const totalPages = Math.ceil(qnaList.length / itemsPerPage);

  // 페이지 번호 계산 (최대 5개만 표시)
  const getPageNumbers = () => {
    const maxButtons = 5;
    const pages = [];
    
    if (totalPages <= maxButtons) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      
      if (currentPage <= 2) {
        end = maxButtons - 1;
      }
      if (currentPage >= totalPages - 3) {
        start = totalPages - maxButtons;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // 인증 로딩 중
  if (authLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c757d" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topTitle}>
        <PageTitle title='문의 목록'/>
        </View>
        
        <ScrollView style={styles.scrollView}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6c757d" />
              <Text style={styles.loadingText}>로딩 중...</Text>
            </View>
          ) : qnaList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>등록된 문의가 없습니다.</Text>
            </View>
          ) : (
            <>
              {/* 문의 목록 */}
              <View style={styles.qnaDiv}>
                {currentQnaList.map((qna, i) => (
                  <View key={i} style={styles.qnaItem}>
                    {/* 문의 번호/회원ID/날짜 */}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemInfoLeft}>
                        {qna.qnaDTO.qnaNum} / {qna.qnaDTO.memId}
                      </Text>
                      <Text style={styles.itemInfoRight}>
                        {dayjs(qna.qnaDTO.qnaDate).format('YYYY/MM/DD HH:mm:ss')}
                      </Text>
                    </View>
                    
                    {/* 문의 내용 */}
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
                          <View style={styles.answerInfo}>
                            <Text style={styles.answerInfoLeft}>{qna.replyMemId}</Text>
                            <Text style={styles.answerInfoRight}>
                              {dayjs(qna.replyDate).format('YYYY/MM/DD HH:mm:ss')}
                            </Text>
                          </View>
                          <View style={styles.answer}>
                            <Text style={styles.aLabel}>A.</Text>
                            <Text style={styles.aContent}>{qna.replyContent}</Text>
                          </View>
                        </>
                      ) : (
                        <View style={styles.answerPending}>
                          <Text style={styles.aLabel}>A.</Text>
                          <Text style={styles.pendingText}>답변 준비중...</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* 페이지네이션 */}
              {qnaList.length > 0 && totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  {/* 이전 버튼 */}
                  <TouchableOpacity 
                    style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}
                    onPress={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <Ionicons 
                      name="chevron-back" 
                      size={20} 
                      color={currentPage === 0 ? '#999' : '#333'} 
                    />
                  </TouchableOpacity>

                  {/* 페이지 번호 */}
                  {getPageNumbers().map((pageNum) => (
                    <TouchableOpacity
                      key={pageNum}
                      style={[
                        styles.pageButton,
                        currentPage === pageNum && styles.activePageButton
                      ]}
                      onPress={() => handlePageChange(pageNum)}
                    >
                      <Text style={[
                        styles.pageButtonText,
                        currentPage === pageNum && styles.activePageText
                      ]}>
                        {pageNum + 1}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* 다음 버튼 */}
                  <TouchableOpacity 
                    style={[styles.pageButton, currentPage === totalPages - 1 && styles.disabledButton]}
                    onPress={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={currentPage === totalPages - 1 ? '#999' : '#333'} 
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default QnaMyPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  topTitle:{
    marginBottom: 8   
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 20,
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  qnaDiv: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  },
  qnaItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemInfoLeft: {
    fontSize: 16,
    color: '#374151',
    fontWeight: 'bold',
  },
  itemInfoRight: {
    fontSize: 11,
    color: '#6b7280',
  },
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
    flexShrink: 0,
  },
  qContent: {
    flex: 1,
    color: '#1f2937',
    lineHeight: 22,
    fontSize: 14,
  },
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
    flexShrink: 0,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  pageButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activePageButton: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  disabledButton: {
    opacity: 0.3,
  },
  pageButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activePageText: {
    color: '#fff',
    fontWeight: '700',
  },
});