import React, { useEffect, useState } from 'react'
import styles from './NewProducts.module.css'
import axios from 'axios';
import PageTitle from '../../common/PageTitle';
import { useLocation, useNavigate } from 'react-router';
import Pagination from '../../common/Pagination';

const DiscountProducts = () => {
  const nav = useNavigate();

  //url정보를 객체로 리턴하는 hook
  const urlInfo = useLocation();

  console.log(urlInfo.pathname);

  //할인 상품 목록을 저장할 state 변수
  const [discountProducts, setDiscountProducts] = useState([]);

  //할인 상품 목록 조회 (선물세트 제외)
  useEffect(() => {
    axios.get('/api/items/on-sale')
    .then(res => {
      console.log('할인 상품 API 응답:', res.data);
      console.log('응답 데이터 길이:', res.data.length);
      // isGiftSet가 1이 아닌 상품만 필터링 (선물세트 제외, null/undefined 포함)
      const filteredProducts = res.data.filter(item => item.isGiftSet !== 1);
      setDiscountProducts(filteredProducts);
    })
    .catch(e => {
      console.error('할인 상품 조회 오류:', e);
      console.error('오류 응답:', e.response);
    });
  }, []);
  console.log('discountProducts state:', discountProducts);

  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 8;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const viewDiscountProducts = discountProducts.slice(startIndex, endIndex);

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
      <PageTitle title='할인 상품' />
      <div className={`${styles.grid_div}`}>
        {
          // Home컴포넌트에 있으면 상품목록을 8개까지 자르고, 그 외에는 모두 표시함
          (
            urlInfo.pathname === '/'
            ?
            discountProducts.slice(0,8)
            :
            viewDiscountProducts
          ).map((product, i) => {
            const discountedPrice = calculateDiscountedPrice(product.price, product.discountRate);

            return (
              <div
                className={styles.grid_content}
                key={i}
                onClick={e => nav(`/product-detail/${product.itemNum}/intro`)}
              >
                <div className={styles.grid_img}>
                  <img src={`http://localhost:8080/upload/${product.imgList[0].attachedImgName}`} />
                  {/* 할인율 배지 */}
                  {product.discountRate > 0 && (
                    <div className={styles.discount_badge}>
                      {product.discountRate}% 할인
                    </div>
                  )}
                </div>
                <div className={styles.grid_info}>
                  <h3>{product.itemName}</h3>
                  {/* 할인가와 원가 표시 */}
                  <div className={styles.price_container}>
                    {product.discountRate > 0 ? (
                      <>
                        <p className={styles.original_price}>{product.price.toLocaleString()}원</p>
                        <p className={styles.product_price}>{discountedPrice.toLocaleString()}원</p>
                      </>
                    ) : (
                      <p className={styles.product_price}>{product.price.toLocaleString()}원</p>
                    )}
                  </div>
                  {/* 평점이 있을 때만 표시 */}
                  {
                    product.reviewAvg
                    ?
                    (
                      <p className={styles.rating}>
                        ⭐ {product.reviewAvg.toFixed(1)} ({product.reviewCnt || 0})
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
        discountProducts.length === 0 && (
          <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: '#888'}}>
            현재 할인 중인 상품이 없습니다.
          </div>
        )
      }
      {
        urlInfo.pathname !== '/' && discountProducts.length > 0
        &&
        <Pagination
          totalItems={discountProducts.length}
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

export default DiscountProducts
