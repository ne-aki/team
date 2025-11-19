import React from "react";
import styles from "./Menu.module.css";
import { NavLink } from "react-router";

const Menu = () => {
  return (
    <div className={styles.menu}>
      <ul>
        <li>
          <NavLink
            to={"/new-product-list"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <p>신상품</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/popular-product-list"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <p>인기상품</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/discount-product-list"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <p>할인상품</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/gift-set"}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <p>선물세트</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
