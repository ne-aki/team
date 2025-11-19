import React from 'react'
import styles from './NewProductList.module.css'
import Menu from '../../../components/Menu'
import DiscountProducts from '../../../components/ProductList/DiscountProducts'

const DiscountProductList = () => {
  return (
    <div className={styles.container}>
      <Menu />
      <DiscountProducts />
    </div>
  )
}

export default DiscountProductList