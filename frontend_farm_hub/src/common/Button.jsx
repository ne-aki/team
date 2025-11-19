import React from 'react'
import styles from './Button.module.css'

const Button = ({children, title='버튼', color='brown', size='100px', ...props}) => {
  return (
    <button
      type='button'
      className={`${styles.common_btn} ${styles[color]} ${props.disabled && styles.disabled}`}
      style={{width : size}}
      {...props}
    >{children || title}</button>
  )
}

export default Button