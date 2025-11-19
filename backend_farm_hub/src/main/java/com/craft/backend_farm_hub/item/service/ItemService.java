package com.craft.backend_farm_hub.item.service;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import com.craft.backend_farm_hub.item.mapper.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {
  private final ItemMapper itemMapper;

  public void insertItem(ItemDTO itemDTO, List<ItemImgDTO> itemImgList){
    int nextItemNum = itemMapper.getNextItemNum();
    itemDTO.setItemNum(nextItemNum);

    for (ItemImgDTO dto : itemImgList){
      dto.setItemNum(nextItemNum);
    }
    itemMapper.insertItem(itemDTO);
    itemMapper.insertImgs(itemImgList);
  }

  //신상품 목록 조회
  public List<ItemDTO> getItemList() {
    return itemMapper.getItemList();
  }

  //상품 상세 조회
  public ItemDTO getItemDetail(int itemNum) {
    return itemMapper.getItemDetail(itemNum);
  }

  //할인 상품 목록 조회
  public List<ItemDTO> getSaleItems() {
    return itemMapper.getSaleItems();
  }

  //할인율 설정 (관리자)
  public void updateDiscount(ItemDTO itemDTO) {
    // 할인율 유효성 검사
    if (itemDTO.getDiscountRate() < 0 || itemDTO.getDiscountRate() > 100) {
      throw new IllegalArgumentException("할인율은 0~100 사이여야 합니다.");
    }
    itemMapper.updateDiscount(itemDTO);
  }
}
