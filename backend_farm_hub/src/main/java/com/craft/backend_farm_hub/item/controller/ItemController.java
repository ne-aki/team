package com.craft.backend_farm_hub.item.controller;

import com.craft.backend_farm_hub.item.dto.ItemDTO;
import com.craft.backend_farm_hub.item.dto.ItemImgDTO;
import com.craft.backend_farm_hub.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUpload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.craft.backend_farm_hub.util.FileUploadUtil;

import java.io.File;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/items")
public class ItemController {
  private final ItemService itemService;

  // 상품 등록
  @PostMapping("")
  public ResponseEntity<?> insertItem(
          @RequestParam("mainImg") MultipartFile mainImg,
          @RequestParam(name = "subImgs", required = false) MultipartFile[] subImgs,
          ItemDTO itemDTO) {
    try {
      ItemImgDTO imgDTO = FileUploadUtil.fileUpload(mainImg);
      List<ItemImgDTO> imgList = FileUploadUtil.multipleFileUpload(subImgs);
      imgList.add(imgDTO);

      itemService.insertItem(itemDTO, imgList);

      return ResponseEntity
              .status(HttpStatus.CREATED)
              .body("상품이 등록되었습니다.");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("상품 등록 중 오류가 발생했습니다.");
    }
  }

  //신상품 목록 조회 api
  @GetMapping("")
  public ResponseEntity<List<ItemDTO>> getItemList() {
    try{
      List<ItemDTO> list = itemService.getItemList();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  //상품 상세 조회 api
  @GetMapping("/{itemNum}")
  public ResponseEntity<?> getItemDetail(@PathVariable("itemNum") int itemNum) {
    try{
      ItemDTO itemDTO = itemService.getItemDetail(itemNum);
      if (itemDTO == null) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("상품을 찾을 수 없습니다.");
      }
      return ResponseEntity.ok(itemDTO);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("조회 중 오류가 발생했습니다.");
    }
  }

  //할인 상품 목록 조회 api
  @GetMapping("/on-sale")
  public ResponseEntity<?> getSaleItems() {
    try {
      List<ItemDTO> saleItems = itemService.getSaleItems();
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(saleItems);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("할인 상품 조회 중 오류가 발생했습니다.");
    }
  }

  //할인율 설정 api (관리자)
  @PutMapping("/{itemNum}/discount")
  public ResponseEntity<?> updateDiscount(
          @PathVariable("itemNum") int itemNum,
          @RequestBody ItemDTO itemDTO
  ) {
    try {
      itemDTO.setItemNum(itemNum);
      itemService.updateDiscount(itemDTO);
      return ResponseEntity
              .status(HttpStatus.OK)
              .body("할인 설정이 완료되었습니다.");
    } catch (IllegalArgumentException e) {
      return ResponseEntity
              .status(HttpStatus.BAD_REQUEST)
              .body(e.getMessage());
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("할인 설정 중 오류가 발생했습니다.");
    }
  }

}