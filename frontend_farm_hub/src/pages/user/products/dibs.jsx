import React, { useEffect, useState } from 'react'
import styles from './Dibs.module.css'
import PageTitle from '../../../common/PageTitle'
import axios from 'axios'
import dayjs from 'dayjs'
import Button from '../../../common/Button'
import { useNavigate } from 'react-router'

const Dibs = () => {
  const nav = useNavigate();
  const loginData = sessionStorage.getItem('loginInfo');
  const [dibsList, setDibsList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDibsList();
  }, []);

  const fetchDibsList = async () => {
    try {
      setIsLoading(true);
      const memId = JSON.parse(loginData).memId;
      const res = await axios.get(`/api/dibs?memId=${memId}`);
      console.log('찜 목록:', res.data);
      setDibsList(res.data);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      alert(error.response?.data || '데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allDibsNums = dibsList.map(item => item.dibsNum);
      setCheckedItems(allDibsNums);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckItem = (dibsNum) => {
    if (checkedItems.includes(dibsNum)) {
      setCheckedItems(checkedItems.filter(num => num !== dibsNum));
    } else {
      setCheckedItems([...checkedItems, dibsNum]);
    }
  };

  const removeSelectedList = async () => {
    if (checkedItems.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `선택한 ${checkedItems.length}개의 항목을 삭제하시겠습니까?`
    );
    if (!confirmDelete) return;

    try {
      const params = new URLSearchParams();
      checkedItems.forEach(num => params.append('dibsNumList', num));

      await axios.delete(`/api/dibs?${params.toString()}`);
      alert('삭제되었습니다.');

      await fetchDibsList();
      setCheckedItems([]);
    } catch (error) {
      console.error('삭제 오류:', error);
      alert(error.response?.data || '삭제에 실패했습니다.');
    }
  };

  const insertCart = async (itemNum, itemName) => {
    try {
      await axios.post('/api/carts', {
        itemNum: itemNum,
        cartCnt: 1,
        memId: JSON.parse(loginData).memId
      });

      alert(`"${itemName}"을(를) 장바구니에 담았습니다.`);
    } catch (error) {
      console.error('장바구니 담기 오류:', error);
      alert(error.response?.data || '장바구니 담기에 실패했습니다.');
    }
  };

  const removeSingleDib = async (dibsNum, itemName) => {
    const confirmDelete = window.confirm(
      `"${itemName}"을(를) 찜 목록에서 삭제하시겠습니까?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/dibs/${dibsNum}`);
      alert('삭제되었습니다.');

      await fetchDibsList();
      setCheckedItems([]);
    } catch (error) {
      console.error('삭제 오류:', error);
      alert(error.response?.data || '삭제에 실패했습니다.');
    }
  };

  const isAllChecked = dibsList.length > 0 && checkedItems.length === dibsList.length;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <PageTitle title='찜 리스트' />
        <div className={styles.loading_container}>
          <div className={styles.loading_spinner}></div>
          <p className={styles.loading_text}>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageTitle title='찜 리스트' />

      {dibsList.length === 0 ? (
        <div className={styles.empty_container}>
          <div className={styles.empty_icon}>
            <span><i className="fa-solid fa-heart-crack"></i></span>
          </div>
          <p className={styles.empty_message}>찜한 상품이 없습니다</p>
          <p className={styles.empty_description}>마음에 드는 상품을 찜해보세요!</p>
        </div>
      ) : (
        <>
          <div className={styles.table_wrapper}>
            <table className={styles.dibs_table}>
              <thead>
                <tr className={styles.table_header_row}>
                  <td className={styles.checkbox_cell}>
                    <input
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={handleSelectAll}
                    />
                  </td>
                  <td className={styles.image_cell}>이미지</td>
                  <td className={styles.name_cell}>상품명</td>
                  <td className={styles.price_cell}>가격</td>
                  <td className={styles.date_cell}>담은 날짜</td>
                  <td className={styles.action_cell}>관리</td>
                </tr>
              </thead>
              <tbody>
                {dibsList.map((item) => {
                  const imageUrl = `http://localhost:8080/upload/${item.itemDTO.imgList[0].attachedImgName}`;

                  return (
                    <tr key={item.dibsNum} className={styles.table_body_row}>
                      <td className={styles.checkbox_cell}>
                        <input
                          type="checkbox"
                          checked={checkedItems.includes(item.dibsNum)}
                          onChange={() => handleCheckItem(item.dibsNum)}
                        />
                      </td>
                      <td className={styles.image_cell}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.itemDTO.itemName}
                            className={styles.item_image}
                            onError={(e) => e.target.src = '/placeholder-image.png'}
                          />
                        ) : (
                          <div className={styles.no_image}>no image</div>
                        )}
                      </td>
                      <td className={styles.name_cell}>
                        <span
                          className={styles.item_name}
                          onClick={() => nav(`/product-detail/${item.itemNum}/intro`)}
                        >
                          {item.itemDTO.itemName}
                        </span>
                      </td>
                      <td className={styles.price_cell}>
                        <span className={styles.item_price}>
                          {item.itemDTO.price.toLocaleString()}원
                        </span>
                      </td>
                      <td className={styles.date_cell}>
                        {dayjs(item.dibsDate).format('YYYY년 MM월 DD일')}
                      </td>
                      <td className={styles.action_cell}>
                        <div className={styles.button_group}>
                          <Button
                            title='장바구니'
                            onClick={() => insertCart(item.itemNum, item.itemDTO.itemName)}
                          />
                          <Button
                            title='삭제'
                            color='gray'
                            onClick={() => removeSingleDib(item.dibsNum, item.itemDTO.itemName)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.summary_section}>
            <span className={styles.summary_text}>
              총 <strong>{dibsList.length}</strong>개의 상품
            </span>
            <Button
              title='선택 삭제'
              color='gray'
              size='150px'
              onClick={removeSelectedList}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dibs;