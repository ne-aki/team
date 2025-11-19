import React from 'react'
import styles from './AdminHeader.module.css'
import Input from '../../common/Input'
import { useNavigate } from 'react-router'

const AdminHeader = () => {
  const nav = useNavigate();

  // loginInfo 데이터 가져오기
  const loginInfo = sessionStorage.getItem('loginInfo');
  const loginInfoData = JSON.parse(loginInfo);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.img_div} onClick={(e) => nav("/admin")}>
          <img className={styles.banner_img} src="/header1.png"/>
        </div>
        <div className={styles.body}>
          <ul>
            <li>관리자님, 안녕하세요.</li>
            <li onClick={e => nav('/')}>유저페이지</li>
            <li onClick={e => {sessionStorage.removeItem('loginInfo'); nav(`/`);}}>로그아웃</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader