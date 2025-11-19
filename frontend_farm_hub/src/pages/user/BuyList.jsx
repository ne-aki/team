import React, { useEffect, useState } from 'react'
import styles from './BuyList.module.css'
import PageTitle from '../../common/PageTitle'
import axios from 'axios'
import Button from '../../common/Button'
import dayjs from 'dayjs'

const BuyList = () => {
  const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
  const [reload, setReload] = useState(0);
  const [buyList, setBuyList] = useState([]);

  // 취소 가능 기간 설정 (일 단위)
  const CANCEL_AVAILABLE_DAYS = 3;

  // 구매 목록 조회
  useEffect(() => {
    axios.get(`/api/buy/${loginInfo.memId}`)
    .then(res => {
      console.log(res.data);
      setBuyList(res.data);
    })
    .catch(e => {
      console.log(e);
      alert(e.response.data)
    });
  }, [reload]);

  // 총 구매 금액 계산
  const getTotalAmount = () => {
    return buyList.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // ✅ 취소 가능 여부 확인
  const isCancelable = (buyDate) => {
    const purchaseDate = dayjs(buyDate);
    const today = dayjs();
    const daysDiff = today.diff(purchaseDate, 'day');
    
    return daysDiff <= CANCEL_AVAILABLE_DAYS;
  };

  // 주문 취소
  const deleteBuy = (buyNum, buyDate) => {
    // ✅ 취소 가능 기간 체크
    if (!isCancelable(buyDate)) {
      alert(`구매일로부터 ${CANCEL_AVAILABLE_DAYS}일이 지나 취소가 불가능합니다.`);
      return;
    }

    if (!confirm('해당 주문을 취소하시겠습니까?')) {
      return;
    }
    
    axios.delete(`/api/buy/${buyNum}`)
    .then(() => {
      alert('주문이 취소되었습니다.');      
      setReload(reload + 1);
    })    
    .catch(e => {
      console.log(e);
      alert(e.response.data);
    });
  }

  return (
    <div className={styles.container}>
      <PageTitle title='주문목록' />
      <table className={styles.buy_table}>
        <thead>
          <tr>
            <td>상품명</td>
            <td>가격</td>
            <td>수량</td>
            <td>총 구매 가격</td>
            <td>구매일</td>
            <td>주문취소</td>
          </tr>
        </thead>
        <tbody>
          {
            buyList.length === 0
            ?
            <tr>
              <td colSpan={6} className={styles.empty_message}>
                주문 내역이 없습니다.
              </td>
            </tr>
            :
            buyList.map((e, i) => {
              const canCancel = isCancelable(e.buyDate);
              
              return (
                <tr key={i}>
                  <td>{e.itemDTO.itemName}</td>
                  <td>{e.itemDTO.price.toLocaleString()}원</td>
                  <td>{e.buyCnt}개</td>
                  <td>{e.totalPrice.toLocaleString()}원</td>
                  <td>{dayjs(e.buyDate).format('YYYY년 MM월 DD일')}</td>
                  <td>
                    {canCancel ? (
                      <Button 
                        onClick={() => deleteBuy(e.buyNum, e.buyDate)} 
                        title='주문취소' 
                        color='gray' 
                        size='90px' 
                      />
                    ) : (
                      <span className={styles.disabled_button}>취소불가</span>
                    )}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      
      {buyList.length > 0 && (
        <>
          {/* ✅ 안내 문구 추가 */}
          <div className={styles.notice_container}>
            <p className={styles.notice_text}>
              * 구매일로부터 {CANCEL_AVAILABLE_DAYS}일 이내 주문만 취소 가능합니다.
            </p>
          </div>
          
          <div className={styles.total_summary}>
            <div className={styles.total_box}>
              <span className={styles.total_label}>총 주문 금액</span>
              <span className={styles.total_amount}>{getTotalAmount().toLocaleString()}원</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BuyList