package com.craft.backend_farm_hub.buy.controller;

import com.craft.backend_farm_hub.buy.dto.BuyDTO;
import com.craft.backend_farm_hub.buy.service.BuyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/buy")
public class BuyController {
  private final BuyService buyService;

  @PostMapping("")
  public ResponseEntity<?> buyItem(@RequestBody BuyDTO buyDTO) {
    try {
      buyService.buyItem(buyDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("구매 중 오류 발생!");
    }
  }

  @GetMapping("/{memId}")
  public ResponseEntity<?> selectBuyforMember(@PathVariable("memId") String memId){
    try{
      List<BuyDTO> list = buyService.selectBuyforMember(memId);
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e){
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }


  @GetMapping("/sales")
  public ResponseEntity<?> selectSales(){
    try{
      List<BuyDTO> list = buyService.selectSales();
      return ResponseEntity.status(HttpStatus.OK).body(list);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  @GetMapping("/salesOne/{buyNum}")
  public ResponseEntity<?> selectSalesOne(@PathVariable("buyNum") int buyNum){
    try{
      BuyDTO buyDTO = buyService.selectSalesOne(buyNum);
      return ResponseEntity.status(HttpStatus.OK).body(buyDTO);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .build();
    }
  }

  @PostMapping("/cart")
  public ResponseEntity<?> buyCartItem(@RequestBody BuyDTO buyDTO) {
    try {
      buyService.buyCartItem(buyDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("선택상품 구매 중 오류가 발생하였습니다.\n관리자에게 문의해 주세요.");
    }
  }
  //각행의 장바구니 상품 구매하기 api
  @PostMapping("/each-cart")
  public ResponseEntity<?> buyEachCartItem(@RequestBody BuyDTO buyDTO) {
    try {
      buyService.buyEachCartItem(buyDTO);
      return ResponseEntity
              .status(HttpStatus.CREATED)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("상품을 구매하는 중 오류가 발생하였습니다.\n관리자에게 문의해 주세요.");
    }
  }

  //주문취소
  @DeleteMapping("/{buyNum}")
  public ResponseEntity<?> deleteCart(
          @PathVariable("buyNum") int buyNum
  ) {
    try {
      buyService.deleteBuy(buyNum);
      return ResponseEntity
              .status(HttpStatus.OK)
              .build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body("취소 중 오류가 발생하였습니다.\n관리자에게 문의해 주세요.");
    }
  }
}
