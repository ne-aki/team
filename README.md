# Farm Hub 🌾
> **스마트 농장 IoT 통합 관리 시스템 & 농산물 쇼핑몰**  
> 울산대학교 출신 신입 개발자 **이근형**의 팀 프로젝트

<br>

## 👋 프로젝트 소개

안녕하세요! 저는 일본어 전공에서 개발자로 전향한 **이근형**입니다.  

**Farm Hub**는 제가 그린컴퓨터아카데미 IoT 웹&앱 개발자 양성과정(2025.05~11)에서 진행한 팀 프로젝트입니다. 라즈베리파이를 활용한 IoT 센서 모니터링부터 React 기반 웹/앱 쇼핑몰까지, **처음부터 끝까지 직접 구현**하며 실전 개발 경험을 쌓았습니다.

특히 이 프로젝트를 통해:
- 📱 **React와 React Native**로 웹과 모바일 양쪽을 경험
- 🔧 **Spring Boot + MyBatis**로 RESTful API 설계 및 구현
- 🌡️ **라즈베리파이**로 실제 센서 데이터 수집 및 제어
- 👥 **팀 협업**을 통한 Git 버전 관리 경험

을 얻을 수 있었습니다.

<br>

## 📅 프로젝트 여정

### 1차 (2024.09.11 ~ 2024.09.24)
**라즈베리파이 + Python 기반 IoT 기기 개발**
- 온도, 습도, 조도, 공기질 센서 데이터 수집
- 센서 값에 따른 팬/LED 자동 제어 알고리즘 구현

### 2차 (2024.09.25 ~ 2024.10.16)
**React 웹 쇼핑몰 + IoT 연동**
- 가축 구매/판매 쇼핑몰 구축
- 장바구니, 결제, 리뷰, Q&A 등 이커머스 핵심 기능 구현
- IoT 센서 데이터 실시간 시각화

### 3차 (2024.10.17 ~ 2024.11.14)
**React Native 모바일 앱 개발**
- 모바일 환경에서 IoT 데이터 조회
- 쇼핑몰 주요 기능 모바일 앱으로 구현

<br>

## 🏗️ 프로젝트 구조

```
team/
├── backend_farm_hub/          # Spring Boot 백엔드
├── frontend_farm_hub/         # React 웹 프론트엔드  
├── frontend_farm_hub_app/     # React Native 모바일 앱
├── 팀플.sql                   # 데이터베이스 스키마
└── README.md
```

<br>

## 🚀 기술 스택

### Backend
- **Java 17** + **Spring Boot 3.4.9**
- **MyBatis 3.0.5** (ORM)
- **MariaDB** (Database)
- **Gradle** (Build Tool)

### Frontend (Web)
- **React 19** + **Vite 7**
- **React Router DOM** (라우팅)
- **Axios** (HTTP 통신)
- **Chart.js** (데이터 시각화)
- **PortOne** (결제 연동)

### Frontend (Mobile)
- **React Native** (Expo 54)
- **React Navigation 7** (네비게이션)
- **React Native Gifted Charts** (차트)

### IoT
- **Raspberry Pi**
- **Python** (센서 제어)
- DHT 센서, 조도 센서, 공기질 센서

<br>

## 💡 주요 기능

### 🛒 쇼핑몰 기능
- 회원 관리 (가입/로그인/탈퇴)
- 상품 관리 (등록/수정/삭제)
- 장바구니 & 찜하기
- 포트원 결제 연동
- 상품 리뷰 & Q&A
- 주문 관리

### 🌡️ IoT 환경 모니터링
- 실시간 온도/습도/조도/공기질 데이터 수집
- 센서 데이터 기반 팬/LED 자동 제어
- 기간별 데이터 시각화 (1~4주 선택 가능)
- 최고/평균/최저 값 자동 계산

<br>

## 🎯 제가 구현한 핵심 기능

### 1. 중복 코드 리팩토링 🔨
**문제**: Home 페이지와 신상품 페이지에 동일한 상품 목록 조회 로직이 중복  
**해결**: 공통 컴포넌트(`NewProducts`)로 분리하여 **32줄 코드 제거**

```javascript
// 개선 전: 각 페이지마다 중복된 상품 목록 코드
// 개선 후: 재사용 가능한 컴포넌트로 분리
<NewProducts limit={location.pathname === '/home' ? 8 : null} />
```

**배운 점**: 컴포넌트 재사용의 중요성과 유지보수성 향상 방법

📝 [상세 내용 보기](https://sticky-chill-dd2.notion.site/11-279342983be3805dba73f80e8ba26a9a)

---

### 2. Outlet을 통한 데이터 전달 📦
**문제**: 상품 상세 페이지의 여러 탭(상세/리뷰/Q&A)에서 동일한 데이터 필요 → API 중복 호출  
**해결**: `useOutletContext` 활용하여 부모에서 자식으로 데이터 공유

**결과**: 
- API 호출 횟수 감소
- 페이지 전환 속도 개선
- React Router의 Context API 활용 경험

📝 [상세 내용 보기](https://sticky-chill-dd2.notion.site/9-277342983be380b69396dc2a30378c5b)

---

### 3. Pagination 구현 📄
**문제**: 한 페이지에 50개 이상 상품 표시로 가독성 저하  
**해결**: `react-js-pagination` 라이브러리로 페이지당 8개 표시

**시행착오**: 
- 처음에 `totalItems`에 현재 페이지 데이터만 전달 → 페이지 수 계산 오류
- 전체 배열 length를 전달하도록 수정하여 해결

📝 [상세 내용 보기](https://sticky-chill-dd2.notion.site/16-280342983be381c1a6a6faefc20b0c3f)

---

### 4. IoT 데이터 차트 시각화 📊
**문제**: 축사 관리자가 센서 데이터를 한눈에 파악하기 어려움  
**해결**: Chart.js로 기간별(1~4주) 온도 데이터 시각화 + 통계 자동 계산

**시행착오**:
- SQL 쿼리에 WHERE 절 누락 → 날짜 구분 없이 동일 값만 반복 조회
- WHERE + ORDER BY 추가로 날짜별 정확한 데이터 표시

**결과**: 최고/평균/최저 온도와 공기질을 직관적으로 확인 가능

📝 [상세 내용 보기](https://sticky-chill-dd2.notion.site/17-288342983be381bfaef5fc099e5c6197)

<br>

## 🛠️ 설치 및 실행 방법

### 1. 데이터베이스 설정
```sql
-- MariaDB 데이터베이스 생성
CREATE DATABASE farm_hub;

-- 팀플.sql 파일 실행
SOURCE 팀플.sql;
```

### 2. 백엔드 실행
```bash
cd backend_farm_hub
./gradlew bootRun
```
> `application.properties`에서 DB 연결 정보 수정 필요

### 3. 웹 프론트엔드 실행
```bash
cd frontend_farm_hub
npm install
npm run dev  # http://localhost:5173
```

### 4. 모바일 앱 실행
```bash
cd frontend_farm_hub_app
npm install
npm start
```

<br>

## 📊 데이터베이스 구조 (ERD)

프로젝트에서 사용한 주요 테이블:
- `SHOP_MEMBER` - 회원 정보
- `ITEM` - 상품 정보
- `ORDERS` / `PAYMENT` - 주문 및 결제
- `REVIEW` - 리뷰
- `SHOP_CART` - 장바구니
- `DIBS` - 찜하기
- `FAN_FUNCTION` - 온습도 센서 데이터
- `illuminance_function` - 조도 센서 데이터

<br>

## 📝 개발 과정 기록

프로젝트를 진행하며 **매일 Notion에 학습 내용과 문제 해결 과정을 기록**했습니다.

> "한 번도 결석하지 않고, 매일 배운 내용을 정리하며 성장했습니다."

📌 [전체 작업 일지 보기](https://sticky-chill-dd2.notion.site/278342983be38089b8dfda2a76735e91)

<br>

## 🌟 프로젝트를 통해 배운 것

### 1. 문제 해결 능력
끝까지 포기하지 않고 문제의 원인을 찾아 해결하는 **진득함**을 길렀습니다.

### 2. 컴포넌트 설계
중복 코드를 발견하고 재사용 가능한 컴포넌트로 리팩토링하는 경험

### 3. 팀 협업
Git을 활용한 버전 관리와 코드 리뷰 경험

### 4. 풀스택 개발
백엔드 API 설계부터 프론트엔드 UI 구현까지 전체 흐름 이해

<br>

## 💼 연락처

- **이름**: 이근형
- **Email**: geunhyeong930@gmail.com
- **GitHub**: https://github.com/ne-aki/team
- **Notion**: [학습 기록](https://sticky-chill-dd2.notion.site/)
- **Tel**: 010-4792-3663

<br>

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

> **"일본어 전공에서 개발자로, 언어의 논리를 코드로 구현하며 성장하고 있습니다."**  
> **- 이근형 -**
