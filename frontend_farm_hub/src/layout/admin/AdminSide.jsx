import React from "react";
import styles from "./AdminSide.module.css";
import { NavLink } from "react-router";

const AdminSide = () => {
  return (
    <div className={styles.container}>
      <div className={styles.category}>
        <p>판매목록조회</p>
        <ul>
          <li>
            <NavLink
              to={`sales-list`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-file-earmark-text-fill"></i>
                </span>
                판매 목록
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.category}></div>
      <div className={styles.category}>
        <p>회원정보조회</p>
        <ul>
          <li>
            <NavLink
              to={`member-list`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-person-lines-fill"></i>
                </span>
                회원 목록
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`survey-result`}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i class="bi bi-chat-right-text-fill"></i>
                </span>
                탈퇴 설문 조사 및 명단
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>판매상품등록</p>
        <ul>
          <li>
            <NavLink
              to={"reg-product"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-bag-plus-fill"></i>
                </span>
                상품 등록
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"discount-management"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i class="fa-solid fa-tags"></i>
                </span>
                할인 관리
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>상품문의정보</p>
        <ul>
          <li>
            <NavLink
              to={"qna-reply"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-megaphone-fill"></i>
                </span>
                문의답변
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.category}>
        <p>축사정보</p>
        <ul>
          <li>
            <NavLink
              to={"temperature"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-thermometer-half"></i>
                </span>
                온도
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"humidity"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-moisture"></i>
                </span>
                습도
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"air-quality"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-cloud-fog2-fill"></i>
                </span>
                공기질
              </p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"illuminance"}
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <p>
                <span>
                  <i className="bi bi-sun-fill"></i>
                </span>
                조도
              </p>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSide;
