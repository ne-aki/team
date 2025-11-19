package com.craft.backend_farm_hub.dibs.service;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import com.craft.backend_farm_hub.dibs.mapper.DibsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DibsService {
  private final DibsMapper dibsMapper;

  public void addDibs(DibsDTO dibsDTO) {
    dibsMapper.addDibs(dibsDTO);
  }

  @Transactional(readOnly = true)
  public List<DibsDTO> getDibs(String memId) {
    List<DibsDTO> dibsList = dibsMapper.getDibs(memId);

    // 삭제된 상품 필터링
    return dibsList.stream()
            .filter(dibs -> dibs.getItemDTO() != null)
            .filter(dibs -> dibs.getItemDTO().getImgList() != null)
            .filter(dibs -> !dibs.getItemDTO().getImgList().isEmpty())
            .collect(Collectors.toList());
  }

  public void removeDibs(int dibsNum) {
    dibsMapper.removeDibs(dibsNum);
  }

  public void removeSelectedDibs(List<Integer> dibsNumList) {
    if (dibsNumList == null || dibsNumList.isEmpty()) {
      throw new IllegalArgumentException("삭제할 항목이 없습니다.");
    }
    dibsMapper.removeSelectedDibs(dibsNumList);
  }

  @Transactional(readOnly = true)
  public boolean checkDibs(String memId, int itemNum) {
    Integer count = dibsMapper.checkDibs(memId, itemNum);
    return count != null && count > 0;
  }

  public void removeDibsByItem(String memId, int itemNum) {
    dibsMapper.removeDibsByItem(memId, itemNum);
  }
}