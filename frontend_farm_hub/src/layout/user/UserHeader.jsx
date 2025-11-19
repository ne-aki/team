import React, { useState } from "react";
import styles from "./UserHeader.module.css";
import { NavLink, useNavigate } from "react-router";
import Input from "../../common/Input";
import Login from "../../components/Login";
import Join from "../../components/Join";
import ForgotPw from "../../components/ForgotPw";

const UserHeader = () => {
  const nav = useNavigate();

  // loginInfo 데이터 가져오기
  const loginInfo = sessionStorage.getItem("loginInfo");
  const loginInfoData = JSON.parse(loginInfo);

  // 로그인 Modal 창 숨김/보이기 여부
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  // 회원가입 Modal 창 숨김/보이기 여부
  const [isOpenJoin, setIsOpenJoin] = useState(false);

  // 비밀번호 찾기 Modal 창 숨김/보이기 여부
  const [isOpenForgotPw, setIsOpenForgotPw] = useState(false);

  console.log(loginInfoData)

  return (
    <div className={styles.container}>
      <div className={styles.members}>
        <ul>
          {loginInfo ? (
            <>
              <li>
                <span>{loginInfoData.memId}님 환영합니다</span>
              </li>
              {/* 관리자인 경우에만 관리자페이지 링크 표시 */}
              {loginInfoData.memRole === 'ADMIN' && (
                <li
                  onClick={(e) => {
                    nav("/admin");
                  }}
                >
                  관리자페이지
                </li>
              )}
              <li
                onClick={(e) => {
                  nav("/mypage");
                }}
              >
                마이페이지
              </li>
              <li
                onClick={(e) => {
                  sessionStorage.removeItem("loginInfo");
                  nav(`/`);
                }}
              >
                로그아웃
              </li>
            </>
          ) : (
            <>
              <li onClick={() => setIsOpenLogin(true)}>로그인</li>
              <li onClick={() => setIsOpenJoin(true)}>회원가입</li>
              <li onClick={() => setIsOpenForgotPw(true)}>비밀번호 찾기</li>
            </>
          )}
        </ul>
      </div>
      <div className={styles.search}>
        <div className={styles.img_div} onClick={(e) => nav("/")}>
          <img className={styles.banner_img} src="/header0.png"/>
        </div>
      </div>

      {/* 로그인 Modal */}
      <Login isOpenLogin={isOpenLogin} onClose={() => setIsOpenLogin(false)} />

      {/* 회원가입 Modal */}
      <Join isOpenJoin={isOpenJoin} onClose={() => setIsOpenJoin(false)} />

      {/* 비번찾기 Modal */}
      <ForgotPw
        isOpenForgotPw={isOpenForgotPw}
        onClose={() => setIsOpenForgotPw(false)}
      />
    </div>
  );
};

export default UserHeader;