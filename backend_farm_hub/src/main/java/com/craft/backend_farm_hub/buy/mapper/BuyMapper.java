package com.craft.backend_farm_hub.buy.mapper;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BuyMapper {
  // 상품 구매
  public void buyItem(BuyDTO buyDTO);

  public List<BuyDTO> selectBuyforMember(String memId);

  public List<BuyDTO> selectSales();

  public BuyDTO selectSalesOne(int buyNum);
  
  //체크된 장바구니 구매
  public void buyCartItem(BuyDTO buyDTO);

  //각 행의 장바구니 데이터 구매
  public void buyEachCartItem(BuyDTO buyDTO);

  //주문취소
  public void deleteBuy(int buyNum);

}