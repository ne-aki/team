# Farm Hub 🌾

스마트 농장 관리 및 농산물 쇼핑몰 통합 플랫폼

## 📋 프로젝트 개요

Farm Hub는 스마트 농장 환경 모니터링과 농산물 직거래 쇼핑몰을 결합한 풀스택 프로젝트입니다. 라즈베리파이를 활용한 IoT 센서 데이터 수집 및 제어, 웹/모바일 쇼핑몰, 관리자 대시보드 기능을 제공합니다.

## 🏗️ 프로젝트 구조

```
team/
├── backend_farm_hub/          # Spring Boot 백엔드
├── frontend_farm_hub/         # React 웹 프론트엔드  
├── frontend_farm_hub_app/     # React Native 모바일 앱
├── 팀플.sql                   # 데이터베이스 스키마
└── README.md
```

## 🚀 기술 스택

### Backend
- **Framework**: Spring Boot 3.4.9
- **Language**: Java 17
- **ORM**: MyBatis 3.0.5
- **Database**: MariaDB
- **Build Tool**: Gradle
- **주요 라이브러리**:
    - log4jdbc-log4j2 (쿼리 로깅)
    - Lombok (코드 간소화)

### Frontend (Web)
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **주요 라이브러리**:
    - React Router DOM (라우팅)
    - Axios (HTTP 클라이언트)
    - Chart.js (데이터 시각화)
    - DayJS (날짜 처리)
    - React-Daum-Postcode (주소 검색)
    - PortOne Browser SDK (결제 연동)

### Frontend (Mobile App)
- **Framework**: React Native (Expo 54)
- **Navigation**: React Navigation 7
- **주요 라이브러리**:
    - Expo Router (파일 기반 라우팅)
    - React Native Gifted Charts (차트)
    - React Native WebView (웹뷰)
    - Expo Image Picker (이미지 선택)
    - AsyncStorage (로컬 저장소)

## 💡 주요 기능

### 🛒 쇼핑몰 기능
- **회원 관리**
    - 회원가입/로그인/로그아웃
    - 비밀번호 찾기 (보안 질문)
    - 회원 탈퇴 및 설문조사
    - 회원 상태 관리 (ACTIVE, WITHDRAWN, SUSPENDED)

- **상품 관리**
    - 상품 등록/수정/삭제 (관리자)
    - 상품 목록 조회 및 상세 정보
    - 상품 이미지 관리 (메인/서브 이미지)
    - 상품별 평균 평점 표시

- **주문 및 결제**
    - 장바구니 기능
    - 포트원(PortOne) 결제 연동
    - 주문 상태 관리 (PENDING, PAID, SHIPPING, DELIVERED, CANCELLED)
    - 결제 내역 조회

- **리뷰 시스템**
    - 별점 및 리뷰 작성
    - 리뷰 이미지 첨부
    - 조회수 카운팅

- **고객 지원**
    - 상품별 Q&A
    - 관리자 답변 기능

- **찜하기**
    - 관심 상품 등록/해제
    - 찜한 상품 목록 관리

### 🌡️ 스마트 농장 모니터링 (IoT)
- **센서 데이터 수집**
    - 온도/습도 센서 (DHT)
    - 공기질 센서
    - 조도 센서

- **액츄에이터 제어**
    - 팬 제어 (온습도 기반 자동 제어)
    - LED 제어 (조도 기반 자동 제어)

- **데이터 시각화**
    - 실시간 환경 데이터 차트
    - 이력 데이터 조회

## 📊 데이터베이스 스키마

### 주요 테이블
- `SHOP_MEMBER`: 회원 정보
- `ITEM`: 상품 정보
- `ORDERS`: 주문 정보
- `PAYMENT`: 결제 정보
- `ITEM_itemIMG`: 상품 이미지
- `REVIEW`: 리뷰
- `SHOP_CART`: 장바구니
- `DIBS`: 찜하기
- `QNA` / `REPLY`: 문의 및 답변
- `FAN_FUNCTION`: 온습도 센서 데이터
- `illuminance_function`: 조도 센서 데이터
- `SURVEY`: 회원 탈퇴 설문조사

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

# Gradle 빌드
./gradlew build

# Spring Boot 실행
./gradlew bootRun
```

**설정 파일**: `src/main/resources/application.properties`에서 데이터베이스 연결 정보 수정

### 3. 웹 프론트엔드 실행
```bash
cd frontend_farm_hub

# 의존성 설치
npm install

# 개발 서버 실행 (기본 포트: 5173)
npm run dev

# 프로덕션 빌드
npm run build
```

### 4. 모바일 앱 실행
```bash
cd frontend_farm_hub_app

# 의존성 설치
npm install

# Expo 개발 서버 실행
npm start

# Android 에뮬레이터에서 실행
npm run android

# iOS 시뮬레이터에서 실행 (Mac만 가능)
npm run ios

# 웹 브라우저에서 실행
npm run web
```

## 🔧 개발 환경 설정

### 필수 요구사항
- **Java**: JDK 17 이상
- **Node.js**: v18 이상
- **MariaDB**: 10.x 이상
- **Gradle**: 8.x 이상
- **npm**: 9.x 이상

### 권장 IDE
- **Backend**: IntelliJ IDEA / Eclipse
- **Frontend**: Visual Studio Code
- **Mobile**: Visual Studio Code + Expo Tools

## 📱 모바일 앱 테스트

### Expo Go를 통한 테스트
1. 모바일 기기에 Expo Go 앱 설치
    - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
    - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. 개발 서버 실행 후 QR 코드 스캔

### 개발 빌드
```bash
# Android APK 빌드
eas build --platform android --profile preview

# iOS 빌드 (Apple Developer 계정 필요)
eas build --platform ios --profile preview
```

## 🌐 API 엔드포인트

### 백엔드 기본 URL
```
http://localhost:8080
```

### 주요 API 예시
- `GET /api/items`: 상품 목록 조회
- `POST /api/members/login`: 로그인
- `POST /api/orders`: 주문 생성
- `GET /api/sensors/temperature`: 온도 데이터 조회
- `POST /api/actuators/fan`: 팬 제어

## 🔐 보안 고려사항

- 비밀번호는 암호화하여 저장 권장 (현재는 평문)
- HTTPS 사용 권장
- API 인증/인가 구현 권장 (JWT 등)
- CORS 설정 확인 필요

## 📝 향후 개선 사항

- [ ] 비밀번호 암호화 (BCrypt)
- [ ] JWT 기반 인증 시스템
- [ ] 파일 업로드 크기 제한 및 검증
- [ ] 페이징 및 검색 기능 고도화
- [ ] 실시간 알림 시스템 (WebSocket)
- [ ] 관리자 대시보드 고도화
- [ ] 테스트 코드 작성
- [ ] CI/CD 파이프라인 구축

## 👥 팀 구성

이 프로젝트는 울산대학교 팀 프로젝트로 개발되었습니다.

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Issues를 통해 등록해주세요.

---

**Last Updated**: 2024
