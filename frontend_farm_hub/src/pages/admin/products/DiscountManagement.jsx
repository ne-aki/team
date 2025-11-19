import React, { useEffect, useState } from "react";
import styles from "./DiscountManagement.module.css";
import axios from "axios";
import PageTitle from "../../../common/PageTitle";
import Button from "../../../common/Button";
import Input from "../../../common/Input";

const DiscountManagement = () => {
  // 모든 상품 목록을 저장할 state
  const [products, setProducts] = useState([]);

  // 검색어를 저장할 state
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링된 상품 목록
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 상품 목록 조회
  useEffect(() => {
    axios.get('/api/items')
    .then(res => {
      console.log(res.data);
      setProducts(res.data);
      setFilteredProducts(res.data);
    })
    .catch(e => console.log(e));
  }, []);

  // 검색어에 따라 상품 필터링
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // 할인 설정 함수
  const updateDiscount = (itemNum, discountRate, isOnSale) => {
    // 할인율 유효성 검사
    if (discountRate < 0 || discountRate > 100) {
      alert("할인율은 0~100 사이로 입력해주세요.");
      return;
    }

    console.log('할인 설정 요청:', { itemNum, discountRate, isOnSale });

    axios.put(`/api/items/${itemNum}/discount`, {
      discountRate: parseInt(discountRate),
      isOnSale: isOnSale
    })
    .then(res => {
      console.log('할인 설정 응답:', res.data);
      alert(res.data);
      // 상품 목록 다시 조회
      return axios.get('/api/items');
    })
    .then(res => {
      console.log('상품 목록 재조회:', res.data);
      setProducts(res.data);
      setFilteredProducts(res.data);
    })
    .catch(e => {
      console.error('할인 설정 오류:', e);
      console.error('오류 응답:', e.response);
      alert("할인 설정 중 오류가 발생했습니다.");
    });
  };

  // 개별 상품의 할인율 변경 핸들러
  const handleDiscountChange = (itemNum, value) => {
    const updatedProducts = products.map(product =>
      product.itemNum === itemNum
        ? { ...product, discountRate: value }
        : product
    );
    setProducts(updatedProducts);

    // 필터링된 목록도 업데이트
    const updatedFiltered = filteredProducts.map(product =>
      product.itemNum === itemNum
        ? { ...product, discountRate: value }
        : product
    );
    setFilteredProducts(updatedFiltered);
  };

  // 개별 상품의 할인 활성화 토글 핸들러
  const handleSaleToggle = (itemNum) => {
    console.log('체크박스 토글 시작 - itemNum:', itemNum);

    const updatedProducts = products.map(product => {
      if (product.itemNum === itemNum) {
        const newValue = !product.isOnSale;
        console.log('이전 isOnSale:', product.isOnSale, '→ 새로운 값:', newValue);
        return { ...product, isOnSale: newValue };
      }
      return product;
    });
    setProducts(updatedProducts);

    // 필터링된 목록도 업데이트
    const updatedFiltered = filteredProducts.map(product => {
      if (product.itemNum === itemNum) {
        return { ...product, isOnSale: !product.isOnSale };
      }
      return product;
    });
    setFilteredProducts(updatedFiltered);
  };

  // 할인가 계산 함수
  const calculateDiscountedPrice = (price, discountRate) => {
    return Math.floor(price * (1 - discountRate / 100));
  };

  return (
    <div className={styles.container}>
      <PageTitle title="할인 관리" />

      {/* 검색 영역 */}
      <div className={styles.search_area}>
        <Input
          type="text"
          placeholder="상품명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="300px"
        />
      </div>

      {/* 상품 목록 테이블 */}
      <div className={styles.table_container}>
        <table className={styles.product_table}>
          <thead>
            <tr>
              <th>상품번호</th>
              <th>이미지</th>
              <th>상품명</th>
              <th>원가</th>
              <th>할인율(%)</th>
              <th>할인가</th>
              <th>할인 활성화</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '30px'}}>
                    상품이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, i) => {
                  const discountedPrice = calculateDiscountedPrice(
                    product.price,
                    product.discountRate || 0
                  );

                  return (
                    <tr key={i}>
                      <td>{product.itemNum}</td>
                      <td>
                        <img
                          src={`http://localhost:8080/upload/${product.imgList[0].attachedImgName}`}
                          alt={product.itemName}
                          className={styles.product_img}
                        />
                      </td>
                      <td>{product.itemName}</td>
                      <td>{product.price.toLocaleString()}원</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={product.discountRate || 0}
                          onChange={(e) => handleDiscountChange(product.itemNum, e.target.value)}
                          className={styles.discount_input}
                        />
                      </td>
                      <td>
                        {product.discountRate > 0
                          ? `${discountedPrice.toLocaleString()}원`
                          : '-'
                        }
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={product.isOnSale === true}
                          onChange={() => handleSaleToggle(product.itemNum)}
                          className={styles.checkbox}
                        />
                      </td>
                      <td>
                        <Button
                          title="적용"
                          onClick={() => updateDiscount(
                            product.itemNum,
                            product.discountRate || 0,
                            product.isOnSale === true
                          )}
                        />
                      </td>
                    </tr>
                  );
                })
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountManagement;
