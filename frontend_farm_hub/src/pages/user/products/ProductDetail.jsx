import React, { useEffect, useState } from 'react'
import PageTitle from '../../../common/PageTitle'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router'
import styles from './ProductDetail.module.css'
import axios from 'axios'
import Button from '../../../common/Button'
import Input from '../../../common/Input'
import Login from '../../../components/Login'

const ProductDetail = () => {
  const nav = useNavigate();
  const {itemNum} = useParams();
  const [itemDetail, setItemDetail] = useState({});
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [cnt, setCnt] = useState(1);
  const loginData = sessionStorage.getItem('loginInfo');
  const [isDibbed, setIsDibbed] = useState(false);

  const checkLogin = (message = '로그인이 필요한 서비스입니다.') => {
    if (JSON.parse(loginData) === null) {
      alert(message);
      setIsOpenLogin(true);
      return false;
    }
    return true;
  };

  const insertCart = () => {
    if (!checkLogin('장바구니는 로그인이 필요한 서비스입니다.')) return;

    axios.post('/api/carts', {
      itemNum,
      cartCnt : cnt,
      memId : JSON.parse(loginData).memId,
    })
    .then(res => {
      console.log(res.data);
      const changePage = confirm('장바구니에 상품을 담았습니다.\n장바구니 페이지로 이동할까요?');
      changePage && nav('/mypage/shop-cart');
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
  };

  const buyItem = () => {
    if (!checkLogin('로그인해 주세요.')) return;

    const confirmBuy = confirm('상품을 구매하시겠습니까?');
    if (!confirmBuy) return;

    nav('/mypage/payment', {
      state : {
        itemNum,
        itemDetail,
        buyCnt: cnt
      }
    });
  };

  const fetchItem = () => {
    axios.get(`/api/items/${itemNum}`)
    .then(res => {
      console.log(res.data);
      setItemDetail(res.data);
    })
    .catch(e => console.log(e));
  };

  useEffect(() => {
    fetchItem();
    const reviewAvgUpdate = () => {
      fetchItem();
    };

    window.addEventListener('reviewUpdated', reviewAvgUpdate);

    return() => {
      window.removeEventListener('reviewUpdated', reviewAvgUpdate);
    };
  }, [itemNum]);

  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100));
  };

  // 찜 상태 확인
  useEffect(() => {
      if (!loginData || JSON.parse(loginData) === null || !itemNum) {
          return;
      }

      const memId = JSON.parse(loginData).memId;

      axios.get('/api/dibs/check', {
          params: { memId: memId, itemNum: itemNum }
      })
      .then(res => {
          console.log('찜 상태 응답:', res.data);
          setIsDibbed(res.data.isDibbed);
      })
      .catch(e => {
          console.log('찜 상태 확인 에러:', e);
          setIsDibbed(false);
      });
  }, [itemNum, loginData]);

  // 찜 토글 함수
  const toggleDibs = async () => {
    if (!checkLogin()) return;

    const memId = JSON.parse(loginData).memId;

    try {
      if (isDibbed) {
        // 찜 삭제
        const confirmRemove = window.confirm('찜한 상품에서 제거하시겠습니까?');
        if (!confirmRemove) return;

        await axios.delete('/api/dibs/item', {
          params: {
            memId: memId,
            itemNum: itemNum
          }
        });

        alert('찜한 상품에서 제거되었습니다.');
        setIsDibbed(false);

      } else {
        // 찜 추가
        await axios.post('/api/dibs', {
          memId: memId,
          itemNum: itemNum
        });

        alert('찜한 상품에 담았습니다.');
        setIsDibbed(true);

        const moveToDibs = window.confirm('찜한 상품으로 이동할까요?');
        if (moveToDibs) {
          nav('/mypage/dibs');
        }
      }
    } catch (error) {
      console.error('찜 처리 오류:', error);
      
      if (error.response?.status === 409) {
        alert('이미 찜한 상품입니다.');
        setIsDibbed(true);
      } else {
        alert(error.response?.data?.message || '오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <PageTitle title={'상품 상세정보'} size='250px' />
      <div className={styles.item_info}>
        <div className={styles.main_img_div}>
          {
            itemDetail.imgList &&
            itemDetail.imgList.map((img, i) => {
              if (img.isMain === 'Y') {
                return (
                  <img src={`http://localhost:8080/upload/${img.attachedImgName}`} className={styles.main_img} key={i} />
                );
              }
            })
          }
        </div>
        <div className={styles.item_intro}>
          <h1>{itemDetail.itemName}</h1>
          <table className={styles.main_info_table}>
            <colgroup>
              <col width={'22%'} />
              <col width={'78%'} />
            </colgroup>
            <tbody>
              <tr>
                <td>판매가</td>
                <td>
                  {itemDetail.price && (
                    <div className={styles.price_info}>
                      {itemDetail.isOnSale && itemDetail.discountRate > 0 ? (
                        <>
                          <span className={styles.discount_badge_detail}>
                            {itemDetail.discountRate}% 할인
                          </span>
                          <div className={styles.price_container_detail}>
                            <span className={styles.original_price_detail}>
                              {itemDetail.price.toLocaleString()}원
                            </span>
                            <span className={styles.discount_price_detail}>
                              {calculateDiscountedPrice(itemDetail.price, itemDetail.discountRate).toLocaleString()}원
                            </span>
                          </div>
                        </>
                      ) : (
                        <span>{itemDetail.price.toLocaleString()}원</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>              
              <tr>
                <td>부위</td>
                <td>{itemDetail.part}</td>
              </tr>
              <tr>
                <td>원산지</td>
                <td>{itemDetail.origin}</td>
              </tr>
              <tr>
                <td>만족도 평균</td>
                <td><i className='bi bi-star-fill' />{itemDetail.reviewAvg}</td>
              </tr>
              <tr>
                <td>판매자</td>
                <td>{itemDetail.seller}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.cart_cnt}>
            <Input
              size='100%'
              type='number'
              value={cnt}
              min='1'
              onChange={e => setCnt(e.target.value)}
            />
          </div>
          <div className={styles.btns}>
            <Button color={isDibbed ? 'red' : 'gray'} size='100%' onClick={toggleDibs}>
              <i className={isDibbed ? "bi bi-heart-fill" : "bi bi-heart"}></i>
              {' '}{isDibbed ? '찜 완료' : '찜하기'}
            </Button>
            <Button
              title='장바구니'
              size='100%'
              onClick={insertCart}
            />
            <Button
              title='구매하기'
              color='green'
              size='100%'
              onClick={buyItem}
            />
          </div>
        </div>
      </div>
      <div className={styles.detail_div}>
        <div className={styles.detail_menu_div}>
          <ul>
            <li>
              <NavLink
                to={'intro'}
                className={({isActive}) => isActive ? styles.active : undefined}
              ><p>상품정보</p></NavLink>
            </li>
            <li>
              <NavLink
                to={`review/${itemNum}`}
                className={({isActive}) => isActive ? styles.active : undefined}
              ><p>이용후기</p></NavLink>
            </li>
            <li>
              <NavLink
                to={`qna/${itemNum}`}
                className={({isActive}) => isActive ? styles.active : undefined}
              ><p>상품문의</p></NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.details}>
          <Outlet context={{itemDetail}} />
        </div>
      </div>
      
      <Login isOpenLogin={isOpenLogin} onClose={() => setIsOpenLogin(false)} />
    </div>
  );
};

export default ProductDetail;