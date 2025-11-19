import React, { useEffect, useState } from 'react'
import styles from './NewProducts.module.css'
import axios from 'axios';
import PageTitle from '../../common/PageTitle';
import { useLocation, useNavigate } from 'react-router';
import Pagination from '../../common/Pagination';

const GiftSets = () => {
  const nav = useNavigate();

  //url정보를 객체로 리턴하는 hook
  const urlInfo = useLocation();

  //선물세트 목록을 저장할 state 변수
  const [giftSets, setGiftSets] = useState([]);

  //선물세트 목록 조회 (isGiftSet가 1인 상품만)
  useEffect(() => {
    axios.get('/api/items')
    .then(res => {
      // isGiftSet가 1인 상품만 필터링
      const filteredGiftSets = res.data.filter(item => item.isGiftSet === 1);
      setGiftSets(filteredGiftSets);
    })
    .catch(e => console.log('선물세트 조회 에러:', e));
  }, []);

  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 8;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const viewGiftSets = giftSets.slice(startIndex, endIndex);

  // 페이지를 변경시켜줄 함수
  const handlePageChange = selectedPage => {
    setCurrentPage(selectedPage);
  };

  // 할인가 계산 함수
  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100));
  };

  return (
    <div>
      <PageTitle title='선물세트' />
      <div className={`${styles.grid_div}`}>
        {
          // Home컴포넌트에 있으면 상품목록을 8개까지 자르고, 그 외에는 모두 표시함
          (
            urlInfo.pathname === '/'
            ?
            giftSets.slice(0,8)
            :
            viewGiftSets
          ).map((giftSet, i) => {
            const discountedPrice = calculateDiscountedPrice(giftSet.price, giftSet.discountRate || 0);

            return (
              <div
                className={styles.grid_content}
                key={i}
                onClick={() => nav(`/product-detail/${giftSet.itemNum}/intro`)}
              >
                <div className={styles.grid_img}>
                  <img src={`http://localhost:8080/upload/${giftSet.imgList[0].attachedImgName}`} />
                  {/* 할인율 배지 */}
                  {giftSet.isOnSale && giftSet.discountRate > 0 && (
                    <div className={styles.discount_badge}>
                      {giftSet.discountRate}% 할인
                    </div>
                  )}
                </div>
                <div className={styles.grid_info}>
                  <h3>{giftSet.itemName}</h3>
                  {/* 할인가와 원가 표시 */}
                  <div className={styles.price_container}>
                    {giftSet.isOnSale && giftSet.discountRate > 0 ? (
                      <>
                        <p className={styles.original_price}>{giftSet.price.toLocaleString()}원</p>
                        <p className={styles.product_price}>{discountedPrice.toLocaleString()}원</p>
                      </>
                    ) : (
                      <p className={styles.product_price}>{giftSet.price.toLocaleString()}원</p>
                    )}
                  </div>
                  {/* 평점이 있을 때만 표시 */}
                  {
                    giftSet.reviewAvg
                    ?
                    (
                      <p className={styles.rating}>
                        ⭐ {giftSet.reviewAvg.toFixed(1)} ({giftSet.reviewCnt || 0})
                      </p>
                    )
                    :
                    <p>리뷰 없음</p>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      {
        giftSets.length === 0 && (
          <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: '#888'}}>
            현재 등록된 선물세트가 없습니다.
          </div>
        )
      }
      {
        urlInfo.pathname !== '/' && giftSets.length > 0
        &&
        <Pagination
          totalItems={giftSets.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          nextLabel={<i className="bi bi-arrow-right"></i>}
          previousLabel={<i className="bi bi-arrow-left"></i>}
          color='brown'
        />
      }
    </div>
  )
}

export default GiftSets
