package com.craft.backend_farm_hub.dibs.mapper;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DibsMapper {
  public void addDibs (DibsDTO dibsDTO);

  public List<DibsDTO> getDibs (String memId);

  // 개별 찜 삭제 (dibsNum으로)
  public void removeDibs (int dibsNum);

  // 선택한 찜 리스트 삭제
  public void removeSelectedDibs (List<Integer> dibsNumList);

  // 찜 여부 확인
  public Integer checkDibs (String memId, int itemNum);

  // 찜 삭제 (memId와 itemNum으로)
  public void removeDibsByItem (String memId, int itemNum);
}
