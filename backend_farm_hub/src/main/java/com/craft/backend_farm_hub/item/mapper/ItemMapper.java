package com.craft.backend_farm_hub.item.mapper;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ItemMapper {
//  상품 등록
  public void insertItem(ItemDTO itemDTO);

//  상품 이미지 등록
  public void insertImgs(List<ItemImgDTO> itemImgList);

//  itemNum 조회
  public int getNextItemNum();

  // 단일 상품 조회
  ItemDTO selectItem(int itemNum);

  //신상품 목록 조회
  public List<ItemDTO> getItemList();

  //상품 상세 조회
  public ItemDTO getItemDetail(int itemNum);

  //할인 상품 목록 조회
  public List<ItemDTO> getSaleItems();

  //할인율 설정 (관리자)
  public void updateDiscount(ItemDTO itemDTO);
}