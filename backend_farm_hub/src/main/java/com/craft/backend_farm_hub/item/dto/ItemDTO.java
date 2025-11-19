package com.craft.backend_farm_hub.item.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ItemDTO {
  private int itemNum;
  private String itemName;
  private int price;
  private String itemIntro;
  private String part;
  private double reviewAvg;
  private String origin;
  private LocalDateTime regDate;
  private String seller;
  private String itemStatus;

  //  상품 하나에 이미지는 여러개
  private List<ItemImgDTO> imgList;

  //  리뷰 갯수
  private Integer reviewCnt;

  //  할인 관련 필드
  private Integer discountRate;      // 할인율 (0~100)

  @JsonProperty("isOnSale")
  private Boolean isOnSale;          // 할인 여부 (Boolean wrapper class 사용)

  //  세트메뉴 여부 필드
  private Integer isGiftSet;          // 세트메뉴 여부 (0: 일반상품, 1: 세트상품)

  // 할인가 계산 메서드
  public int getDiscountPrice() {
    if (Boolean.TRUE.equals(isOnSale) && discountRate != null && discountRate > 0) {
      return (int) Math.floor(price * (100 - discountRate) / 100.0);
    }
    return price;
  }

  // 할인 금액 계산 메서드
  public int getDiscountAmount() {
    return price - getDiscountPrice();
  }
}