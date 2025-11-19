package com.craft.backend_farm_hub.dibs.controller;

import com.craft.backend_farm_hub.dibs.dto.DibsDTO;
import com.craft.backend_farm_hub.dibs.service.DibsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/dibs")
public class DibsController {
  private final DibsService dibsService;

  @PostMapping("")
  public ResponseEntity<?> addDibs(@RequestBody DibsDTO dibsDTO) {
    try {
      if (dibsDTO.getMemId() == null || dibsDTO.getMemId().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("message", "회원 ID가 필요합니다."));
      }
      if (dibsDTO.getItemNum() <= 0) {
        return ResponseEntity.badRequest().body(Map.of("message", "상품 번호가 올바르지 않습니다."));
      }

      boolean exists = dibsService.checkDibs(dibsDTO.getMemId(), dibsDTO.getItemNum());
      if (exists) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "이미 찜한 상품입니다."));
      }

      dibsService.addDibs(dibsDTO);
      return ResponseEntity.status(HttpStatus.CREATED)
              .body(Map.of("message", "찜 목록에 추가되었습니다."));

    } catch (DuplicateKeyException e) {
      return ResponseEntity.status(HttpStatus.CONFLICT)
              .body(Map.of("message", "이미 찜한 상품입니다."));
    } catch (Exception e) {
      log.error("찜 추가 실패", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(Map.of("message", "찜 추가에 실패했습니다."));
    }
  }

  @GetMapping("")
  public ResponseEntity<?> getDibs(@RequestParam(required = false) String memId) {
    try {
      if (memId == null || memId.isEmpty()) {
        return ResponseEntity.badRequest().body("회원 ID가 필요합니다.");
      }

      List<DibsDTO> dibsList = dibsService.getDibs(memId);
      return ResponseEntity.ok(dibsList);

    } catch (Exception e) {
      log.error("찜 목록 조회 실패", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("찜 목록을 불러오지 못했습니다.");
    }
  }

  @GetMapping("/check")
  public ResponseEntity<?> checkDibs(@RequestParam String memId, @RequestParam int itemNum) {
    try {
      boolean isDibbed = dibsService.checkDibs(memId, itemNum);

      Map<String, Boolean> response = new HashMap<>();
      response.put("isDibbed", isDibbed);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      log.error("찜 여부 확인 실패", e);
      Map<String, Boolean> response = new HashMap<>();
      response.put("isDibbed", false);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }

  @DeleteMapping("/{dibsNum}")
  public ResponseEntity<?> removeDibs(@PathVariable int dibsNum) {
    try {
      dibsService.removeDibs(dibsNum);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      log.error("찜 삭제 실패", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("삭제에 실패했습니다.");
    }
  }

  @DeleteMapping("/item")
  public ResponseEntity<?> removeDibsByItem(@RequestParam String memId, @RequestParam int itemNum) {
    try {
      dibsService.removeDibsByItem(memId, itemNum);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      log.error("찜 삭제 실패", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("삭제에 실패했습니다.");
    }
  }

  @DeleteMapping("")
  public ResponseEntity<?> removeSelectedDibs(@RequestParam List<Integer> dibsNumList) {
    try {
      dibsService.removeSelectedDibs(dibsNumList);
      return ResponseEntity.ok().build();
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      log.error("선택 삭제 실패", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("삭제에 실패했습니다.");
    }
  }
}