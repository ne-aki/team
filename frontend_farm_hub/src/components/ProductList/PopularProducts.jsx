import React, { useEffect, useState } from 'react'
import styles from './NewProducts.module.css'
import axios from 'axios';
import PageTitle from '../../common/PageTitle';
import { useLocation, useNavigate } from 'react-router';
import Pagination from '../../common/Pagination';

const PopularProducts = () => {
  const nav = useNavigate();

  //url정보를 객체로 리턴하는 hook
  const urlInfo = useLocation();

  console.log(urlInfo.pathname);
  
  //신상품 목록을 저장할 state 변수
  const [newProducts, setNewProducts] = useState([]);

  //인기상품 목록 조회 (선물세트 제외)
  useEffect(() => {
    axios.get('/api/items')
    .then(res => {
      console.log(res.data);
      // isGiftSet가 1이 아닌 상품만 필터링 (선물세트 제외, null/undefined 포함)
      const filteredProducts = res.data.filter(item => item.isGiftSet !== 1);
      // reviewAvg 기준으로 정렬 (복합 조건)
      const sortedProducts = filteredProducts.sort((a, b) => {
        const avgA = a.reviewAvg || 0;
        const avgB = b.reviewAvg || 0;
        const cntA = a.reviewCnt || 0;
        const cntB = b.reviewCnt || 0;
        
        // 1순위: 평점 높은 순
        if (avgB !== avgA) {
          return avgB - avgA;
        }
        
        // 2순위: 평점이 같으면 리뷰 개수 많은 순
        if (cntB !== cntA) {
          return cntB - cntA;
        }
        
        // 3순위: 평점과 리뷰 개수가 같으면 가격 낮은 순
        return a.price - b.price;
      });
      setNewProducts(sortedProducts);
    })
    .catch(e => console.log(e));
  }, []);
  console.log(newProducts);

  // 활성 페이지 세팅
  const [currentPage, setCurrentPage] = useState(0);

  // 보여줄 페이지
  const itemsPerPage = 8;

  // 현재 페이지 보여줄 데이터 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const viewNewProducts = newProducts.slice(startIndex, endIndex);

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
      <PageTitle title='인기상품' />
      <div className={`${styles.grid_div}`}>
        {
          // Home컴포넌트에 있으면 상품목록을 8개까지 자르고, 그 외에는 모두 표시함
          (
            urlInfo.pathname === '/'
            ?
            newProducts.slice(0,8)
            :
            viewNewProducts
          ).map((newProduct, i) => {
            const discountedPrice = calculateDiscountedPrice(newProduct.price, newProduct.discountRate || 0);

            return (
              <div
                className={styles.grid_content}
                key={i}
                onClick={e => nav(`/product-detail/${newProduct.itemNum}/intro`)}
              >
                <div className={styles.grid_img}>
                  <img src={`http://localhost:8080/upload/${newProduct.imgList[0].attachedImgName}`} />
                  {/* 할인율 배지 */}
                  {newProduct.isOnSale && newProduct.discountRate > 0 && (
                    <div className={styles.discount_badge}>
                      {newProduct.discountRate}% 할인
                    </div>
                  )}
                </div>
                <div className={styles.grid_info}>
                  <h3>{newProduct.itemName}</h3>
                  {/* 할인가와 원가 표시 */}
                  <div className={styles.price_container}>
                    {newProduct.isOnSale && newProduct.discountRate > 0 ? (
                      <>
                        <p className={styles.original_price}>{newProduct.price.toLocaleString()}원</p>
                        <p className={styles.product_price}>{discountedPrice.toLocaleString()}원</p>
                      </>
                    ) : (
                      <p className={styles.product_price}>{newProduct.price.toLocaleString()}원</p>
                    )}
                  </div>
                  {/* 평점이 있을 때만 표시 */}
                  {
                    newProduct.reviewAvg
                    ?
                    (
                      <p className={styles.rating}>
                        ⭐ {newProduct.reviewAvg.toFixed(1)} ({newProduct.reviewCnt || 0})
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
        urlInfo.pathname !== '/'
        &&
        <Pagination
          totalItems={newProducts.length}
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

export default PopularProducts