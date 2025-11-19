import React, { useEffect, useState } from 'react'
import Button from '../../common/Button'
import PageTitle from '../../common/PageTitle'
import styles from './Home.module.css'
import Select from '../../common/Select'
import { NavLink, useNavigate } from 'react-router'
import axios from 'axios'
import NewProductList from './products/NewProductList'
import Menu from '../../components/Menu'
import NewProducts from '../../components/ProductList/NewProducts'
import PopularProducts from '../../components/ProductList/PopularProducts'
import DiscountProducts from '../../components/ProductList/DiscountProducts'
import GiftSets from '../../components/ProductList/GiftSets'

const Home = () => {
  const nav = useNavigate();  


  return (
    <div className={styles.container}>
      <Menu />
      <div className={styles.new_product}>
        <NewProducts />
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/new-product-list')}>더보기</span>
        </p>
      </div>
      <div className={styles.new_product}>
        <PopularProducts />
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/popular-product-list')}>더보기</span>
        </p>
      </div>
      <div className={styles.new_product}>
        <DiscountProducts />
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/discount-product-list')}>더보기</span>
        </p>
      </div>
      <div className={styles.new_product}>
        <GiftSets />
        <p className={`${styles.more}`}>
          <span onClick={e => nav('/gift-set')}>더보기</span>
        </p>
      </div>
    </div>
  )
}

export default Home