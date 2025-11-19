package com.craft.backend_farm_hub.cart.mapper;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.cart.dto.CartDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CartMapper {
  //장바구니에 상품 담기
  public void insertCart(CartDTO cartDTO);

  //장바구니에 중복된 항목이 있는지 확인
  public String findDup(CartDTO cartDTO);

  //중복된 항목이 있으면 수량만 변경
  public void updateCnt(CartDTO cartDTO);

  //장바구니 목록 조회
  public List<CartDTO> getCartList(String memId);

  //장바구니 수량 변경
  public void updateCartCnt(CartDTO cartDTO);

  // 여러 cartNum으로 장바구니 조회
  List<CartDTO> selectCartsByCartNums(List<Integer> cartNumList);
  
  //장바구니 삭제
  public void deleteCart(int cartNum);

  //장바구니에서 선택한 상품 구매시 해당 목록 삭제
  public void deleteBoughtItem(BuyDTO buyDTO);

  //장바구니 구매 시 각 행의 장바구니 삭제
  public void deleteBoughtEach(int cartNum);
} 