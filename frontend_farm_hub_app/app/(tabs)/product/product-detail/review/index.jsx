import { useEffect, useState , useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import Button from '@/components/common/Button';
import { SERVER_URL } from '@/constants/appConst';
import { colors } from '@/constants/colorConstant';
import RegReviewScreen from './regReview';

const Review = ({ itemDetail, onReviewUpdate }) => {
  // URL 파라미터에서 itemNum 가져오기
  const { itemNum } = useLocalSearchParams();

  // 로그인 정보
  const [memId, setMemId] = useState(null);

  // 리로드용 타임스탬프
  const [reload, setReload] = useState(Date.now());

  // 리뷰 목록
  const [reviewList, setReviewList] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 확장된 리뷰 (상세보기)
  const [expandedRowId, setExpandedRowId] = useState(null);

  //모달창 보이기 여부
  const [modalVisible, setModalVisible] = useState(false);

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

  // 리뷰 목록 조회
  useEffect(() => {
    if (!itemNum) {
      console.log('❌ itemNum이 없습니다');
      return;
    }

    console.log('📋 리뷰 조회 시작 - itemNum:', itemNum);
    console.log('🌐 API URL:', `${SERVER_URL}/reviews/getList/${itemNum}`);

    setLoading(true);
    axios
      .get(`${SERVER_URL}/reviews/getList/${itemNum}`)
      .then((res) => {
        console.log('✅ 리뷰 조회 성공:', res.data);
        setReviewList(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log('❌ 리뷰 조회 실패:', e.response?.status, e.response?.data);
        console.log('전체 에러:', e);
        setLoading(false);
      });
  }, [reload, itemNum]);

  // 별점 컴포넌트
  const StarRating = ({ rating }) => {
    return (
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, index) => (
          <Text key={index} style={styles.starIcon}>
            {index < rating ? '★' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  // 리뷰 행 클릭 핸들러
  const handleRowClick = (reviewNum) => {
    if (expandedRowId === reviewNum) {
      // 같은 행 클릭 시 닫기
      setExpandedRowId(null);
    } else {
      // 새 행 열기
      setExpandedRowId(reviewNum);
    }
  };

  // 후기 작성 버튼 핸들러
  const handleWriteReview = () => {
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.BROWN} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>이용후기 총 {reviewList.length}건</Text>
        {memId ? (
          <Button
            title="후기 작성"
            onPress={handleWriteReview}
            bgColor={colors.BROWN}
            style={styles.writeButton}
          />
        ) : (
          <Text style={styles.loginRequiredText}>
            리뷰를 쓰려면 먼저{' '} 
            <Text 
              style={[styles.loginRequiredText, { textDecorationLine: 'underline' }]}
              onPress={() => router.push('/auth/login')}
            >
              로그인
            </Text>
            해야 합니다
          </Text>
        )}
      </View>

      {/* 리뷰 리스트 */}
      <View style={styles.reviewList}>
        {/* 테이블 헤더 */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.noCell]}>No</Text>
          <Text style={[styles.headerCell, styles.titleCell]}>제목</Text>
          <Text style={[styles.headerCell, styles.ratingCell]}>평점</Text>
          <Text style={[styles.headerCell, styles.authorCell]}>작성자</Text>
          <Text style={[styles.headerCell, styles.dateCell]}>작성일</Text>
        </View>

        {/* 테이블 바디 */}
        {!reviewList.length ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>등록된 리뷰가 없습니다</Text>
          </View>
        ) : (
          reviewList.map((review, index) => (
            <View key={review.reviewNum}>
              {/* 리뷰 요약 행 */}
              <TouchableOpacity
                style={styles.tableRow}
                onPress={() => handleRowClick(review.reviewNum)}
              >
                <Text style={[styles.cell, styles.noCell]}>
                  {reviewList.length - index}
                </Text>
                <Text style={[styles.cell, styles.titleCell]} numberOfLines={1}>
                  {review.title}
                </Text>
                <View style={[styles.cell, styles.ratingCell]}>
                  <StarRating rating={review.rating} />
                </View>
                <Text style={[styles.cell, styles.authorCell]}>
                  {review.memId}
                </Text>
                <Text style={[styles.cell, styles.dateCell]}>
                  {dayjs(review.createDate).format('MM/DD')}
                </Text>
              </TouchableOpacity>

              {/* 리뷰 상세 행 (확장되었을 때) */}
              {expandedRowId === review.reviewNum && (
                <View style={styles.detailRow}>
                  {/* 리뷰 이미지 */}
                  {review.reviewImgList &&
                    review.reviewImgList.length > 0 &&
                    review.reviewImgList.map((img, idx) => (
                      <Image
                        key={idx}
                        source={{
                          uri: `${SERVER_URL}/reviewupload/${img.reviewAttachedImgName}?t=${reload}`,
                        }}
                        style={styles.reviewImage}
                        onError={() =>
                          console.log(
                            '이미지 로드 실패:',
                            img.reviewAttachedImgName
                          )
                        }
                      />
                    ))}
                  {/* 리뷰 내용 */}
                  <Text style={styles.reviewContent}>{review.content}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
      <RegReviewScreen
        itemNum={itemNum}
        isOpenRegReview={modalVisible}
        onClose={(isUpdated) => { 
          console.log('🔔 review.jsx onClose 호출됨, isUpdated:', isUpdated);
          setModalVisible(false);
          if (isUpdated) {
            console.log('✅ 리뷰 목록 갱신 시작');
            setReload(Date.now()); 
            console.log('✅ onReviewUpdate 호출 시도');
            onReviewUpdate?.(); 
            console.log('✅ onReviewUpdate 호출 완료');
          }
        }}
/>
    </ScrollView>
  );
};

export default Review;

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
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  writeButton: {
    marginTop: 10,
  },
  loginRequiredText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  // 리뷰 리스트
  reviewList: {
    padding: 20,
  },
  // 테이블 헤더
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderTopWidth: 2,
    borderTopColor: '#888888',
    borderBottomWidth: 1,
    borderBottomColor: '#bbbbbb',
    paddingVertical: 15,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  // 테이블 행
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bbbbbb',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  cell: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
  },
  // 열 너비 설정
  noCell: {
    width: '10%',
  },
  titleCell: {
    width: '30%',
    paddingHorizontal: 5,
  },
  ratingCell: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorCell: {
    width: '20%',
  },
  dateCell: {
    width: '15%',
  },
  // 빈 행
  emptyRow: {
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#bbbbbb',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  // 별점
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starIcon: {
    color: '#ffc107',
    fontSize: 16,
    marginRight: 2,
  },
  // 상세 행
  detailRow: {
    backgroundColor: '#fafafa',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bbbbbb',
    alignItems: 'center',
  },
  reviewImage: {
    width: '80%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  reviewContent: {
    width: '100%',
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    textAlign: 'left',
  },
});