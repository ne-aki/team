import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router";
import UserLayout from "./layout/user/UserLayout";
import Home from "./pages/user/Home";
import NewProductList from "./pages/user/products/NewProductList";
import PopularProductList from "./pages/user/products/PopularProductList";
import DiscountProductList from "./pages/user/products/DiscountProductList";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import ProductDetail from "./pages/user/products/ProductDetail";
import ProductIntro from "./components/ProductDetail/ProductIntro";
import QnA from "./components/ProductDetail/QnA";
import Review from "./components/ProductDetail/Review";
import RegProduct from "./pages/admin/products/RegProduct";
import DiscountManagement from "./pages/admin/products/DiscountManagement";
import RegReview from "./components/ProductDetail/RegReview";
import axios from "axios";
import MemberList from "./pages/admin/MemberList";
import Mypage from "./pages/user/Mypage";
import UserInfoUpdate from "./pages/user/products/UserInfoUpdate";
import Memberdel from "./pages/user/products/Memberdel";
import ShopCart from "./pages/user/ShopCart";
import Reply from "./pages/admin/Reply";
//import ReplyList from "./pages/admin/ReplyList";
import BuyList from "./pages/user/BuyList";
import Deliverypage from "./pages/user/products/Deliverypage";
import SalesList from "./pages/admin/SalesList";
import Temperature from "./pages/admin/Temperature";
import Humidity from "./pages/admin/Humidity";
import AirQuality from "./pages/admin/AirQuality";
import Illuminance from "./pages/admin/Illuminance";
import UserReviewList from "./pages/user/products/UserReviewList";
import UserQna from "./pages/user/products/UserQna";
import ScrollToTop from "./common/ScrollToTop";
import SurveyResult from "./pages/admin/products/SurveyResult";
import Paymentpage from "./pages/user/Paymentpage";
import Dibs from "./pages/user/products/dibs";
import GiftSet from "./pages/user/products/GiftSet";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 일반 사용자 페이지 */}

        <Route path="/" element={<UserLayout />}>
          <Route path="" element={<Home />} />
          <Route path="new-product-list" element={<NewProductList />} />

          <Route path="product-detail/:itemNum" element={<ProductDetail />}>
            <Route path="intro" element={<ProductIntro />} />
            <Route path="review/:itemNum" element={<Review />} />
            <Route path="qna/:itemNum" element={<QnA />} />
          </Route>
          <Route path="popular-product-list" element={<PopularProductList />} />
          <Route
            path="discount-product-list"
            element={<DiscountProductList />}
          />
          <Route path="gift-set" element={ <GiftSet /> } />
        </Route>

        {/* 일반사용자 개인페이지 */}
        <Route path="/mypage" element={<Mypage />}>
          <Route path="/mypage/update" element={<UserInfoUpdate />} />
          <Route path="/mypage/memdel" element={<Memberdel />} />
          <Route path="shop-cart" element={<ShopCart />} />
          <Route path="buy-list" element={<BuyList />} />
          <Route path="order-list" element={<BuyList />} />
          <Route path="/mypage/delivery" element={<Deliverypage />} />
          <Route path="/mypage/review-list" element={<UserReviewList />} />
          <Route path="/mypage/Qna" element={<UserQna />} />
          <Route path="/mypage/payment" element={<Paymentpage />} />
          <Route path="/mypage/dibs" element={ <Dibs /> } />
        </Route>

        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminHome />} />
          <Route path="sales-list" element={<SalesList />} />
          <Route path="reg-product" element={<RegProduct />} />
          <Route path="discount-management" element={<DiscountManagement />} />
          <Route path="member-list" element={<MemberList />} />
          <Route path="survey-result" element={<SurveyResult />} />
          <Route path="qna-reply" element={<Reply />} />
          <Route path="temperature" element={<Temperature />} />
          <Route path="humidity" element={<Humidity />} />
          <Route path="air-quality" element={<AirQuality />} />
          <Route path="illuminance" element={<Illuminance />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
