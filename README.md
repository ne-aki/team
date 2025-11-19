# 🌾 Farm Hub
> **스마트 농장 IoT 통합 관리 시스템 & 농산물 쇼핑몰**  
> IoT 센서 데이터 수집부터 웹/앱 쇼핑몰까지, 처음부터 끝까지 직접 구현한 풀스택 프로젝트

<br>

## 👋 프로젝트 소개

안녕하세요! **일본어 전공에서 개발자로 전향**한 이근형입니다.

Farm Hub는 제가 그린컴퓨터아카데미 **IoT 웹&앱 개발자 양성과정**(2025.05~11)에서 팀원들과 함께 만든 프로젝트입니다.  
라즈베리파이로 축사 환경을 모니터링하고, 수집한 데이터를 웹과 모바일 앱에서 실시간으로 확인할 수 있으며,  
동시에 가축 판매 쇼핑몰까지 운영할 수 있는 **통합 플랫폼**입니다.

### 💡 이 프로젝트를 통해 얻은 것

```
📱 React & React Native - 웹과 모바일 양쪽 개발 경험
🔧 Spring Boot + MyBatis - RESTful API 설계 및 구현
🌡️ Raspberry Pi + Python - 실제 하드웨어 제어 경험
👥 Git & GitHub - 팀 협업 및 버전 관리
```

<br>

## 📋 프로젝트 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Farm Hub (팜 허브) |
| **개발 기간** | 2024.09.11 ~ 2024.11.14 (총 65일) |
| **개발 인원** | 4명 (팀 프로젝트) |
| **담당 역할** | 프론트엔드 개발, 코드 리팩토링, IoT 데이터 시각화 |
| **개발 환경** | Windows 11, IntelliJ IDEA, VS Code |

<br>

## 🎯 프로젝트 목표

1. **IoT 센서 데이터 수집 및 자동 제어** - 라즈베리파이로 축사 환경 관리
2. **실시간 데이터 시각화** - Chart.js를 활용한 직관적인 대시보드
3. **웹/모바일 통합 쇼핑몰** - 가축 판매 플랫폼 구축
4. **사용자 경험 최적화** - 직관적인 UI/UX 설계

<br>

## 🗓️ 개발 프로세스

### 1차 (2024.09.11 ~ 2024.09.24) - IoT 기기 개발
```
🎯 목표: 라즈베리파이 기반 센서 데이터 수집 및 자동 제어
✅ 완료: 온도/습도/조도/공기질 센서 연동
✅ 완료: 센서 값 기반 팬/LED 자동 제어 알고리즘 구현
```

### 2차 (2024.09.25 ~ 2024.10.16) - React 웹 개발
```
🎯 목표: 웹 쇼핑몰 구축 및 IoT 데이터 시각화
✅ 완료: 회원/상품/주문/결제 시스템 구현
✅ 완료: 실시간 센서 데이터 차트 구현
✅ 완료: 관리자 대시보드 개발
```

### 3차 (2024.10.17 ~ 2024.11.14) - React Native 앱 개발
```
🎯 목표: 모바일 환경에서 IoT 모니터링 및 쇼핑몰 이용
✅ 완료: 크로스 플랫폼 모바일 앱 구현
✅ 완료: 웹과 동일한 기능을 모바일에서 제공
```

<br>

## 🛠️ 기술 스택

### Frontend
| 분류 | 기술 스택 |
|------|-----------|
| **Web** | React 19, Vite 7, React Router DOM |
| **Mobile** | React Native (Expo 54), React Navigation 7 |
| **상태 관리** | useState, useContext, useOutletContext |
| **HTTP 통신** | Axios |
| **차트** | Chart.js, React Native Gifted Charts |
| **기타** | React Daum Postcode, PortOne (결제) |

### Backend
| 분류 | 기술 스택 |
|------|-----------|
| **Framework** | Spring Boot 3.4.9 |
| **Language** | Java 17 |
| **ORM** | MyBatis 3.0.5 |
| **Database** | MariaDB |
| **Build Tool** | Gradle |

### IoT
| 분류 | 기술 스택 |
|------|-----------|
| **Hardware** | Raspberry Pi |
| **Language** | Python |
| **Sensors** | DHT (온습도), 조도 센서, 공기질 센서 |
| **Actuators** | 팬, LED |

### Tools
```
Git/GitHub, Notion, HeidiSQL, Postman
```

<br>

## 🎬 주요 기능 시연

### 📱 쇼핑몰 기능

#### 1. 회원 관리
<!-- 여기에 회원가입/로그인 GIF 또는 이미지 추가 -->
```
📝 회원가입 / 로그인 / 로그아웃
🔒 비밀번호 찾기 (보안 질문)
👤 회원 정보 수정 / 탈퇴
```

#### 2. 상품 관리 및 주문
<!-- 여기에 상품 목록/상세 GIF 추가 -->
```
🛍️ 상품 목록 조회 (페이지네이션)
📦 상품 상세 정보 확인
🛒 장바구니 담기
💳 포트원 결제 연동
```

#### 3. 리뷰 및 Q&A
<!-- 여기에 리뷰 작성 GIF 추가 -->
```
⭐ 별점 및 리뷰 작성
📸 리뷰 이미지 첨부
❓ 상품 문의 및 관리자 답변
```

### 🌡️ IoT 모니터링 기능

#### 실시간 센서 데이터 시각화
<!-- 여기에 차트 화면 이미지 추가 -->
```
📊 기간별 온도/습도 데이터 차트 (1~4주 선택)
📈 최고/평균/최저 값 자동 계산
🎛️ 팬/LED 수동 제어
🤖 센서 값 기반 자동 제어
```

<br>

## 💻 제가 담당한 핵심 기능

### 1️⃣ 중복 코드 리팩토링 🔨

**🔍 문제 상황**
```
Home 페이지와 신상품 페이지에서 동일한 상품 목록 조회 로직이 중복
→ 코드 수정 시 두 곳을 모두 수정해야 하는 불편함
→ 유지보수성 저하
```

**💡 해결 방법**
```javascript
// 개선 전: 각 페이지마다 중복 코드 (총 64줄)
// Home.jsx - 32줄
// NewProductList.jsx - 32줄

// 개선 후: 재사용 가능한 컴포넌트로 분리
<NewProducts limit={location.pathname === '/home' ? 8 : null} />
```

**✨ 결과**
- ✅ 중복 코드 **32줄 제거**
- ✅ 컴포넌트 재사용성 향상
- ✅ 수정 시간 단축

> 📝 [상세 구현 과정 보기](https://sticky-chill-dd2.notion.site/11-279342983be3805dba73f80e8ba26a9a)

<!-- 여기에 리팩토링 전후 비교 이미지 추가 -->

---

### 2️⃣ useOutletContext를 활용한 데이터 전달 📦

**🔍 문제 상황**
```
상품 상세 페이지의 여러 탭(상세/리뷰/Q&A)에서 동일한 상품 정보 필요
→ 각 탭마다 API를 다시 호출 (불필요한 네트워크 요청)
→ 페이지 전환 시 로딩 시간 증가
```

**💡 해결 방법**
```javascript
// ProductDetail.jsx (부모)
const [itemDetail, setItemDetail] = useState();

return (
  <Outlet context={{ itemDetail }} />  // Context로 데이터 전달
);

// ProductIntro.jsx (자식)
const { itemDetail } = useOutletContext();  // Context에서 데이터 받기
```

**✨ 결과**
- ✅ API 호출 횟수 감소 (3회 → 1회)
- ✅ 페이지 전환 속도 개선
- ✅ React Router의 Context API 활용 경험

> 📝 [상세 구현 과정 보기](https://sticky-chill-dd2.notion.site/9-277342983be380b69396dc2a30378c5b)

<!-- 여기에 API 호출 비교 다이어그램 추가 -->

---

### 3️⃣ Pagination 구현 📄

**🔍 문제 상황**
```
한 페이지에 50개 이상의 상품이 표시되어 가독성 저하
→ 사용자가 원하는 상품을 찾기 어려움
→ 페이지 로딩 속도 저하
```

**💡 해결 방법**
```javascript
// react-js-pagination 라이브러리 활용
<Pagination
  activePage={currentPage}
  itemsPerPage={itemsPerPage}  // 8개씩 표시
  totalItems={newProducts.length}  // 전체 개수
  onChange={handlePageChange}
/>
```

**🐛 시행착오**
```
문제: totalItems에 현재 페이지 데이터만 전달 → 페이지 수 1로 고정
해결: 전체 배열 length를 전달하도록 수정
```

**✨ 결과**
- ✅ 페이지당 8개 항목으로 가독성 향상
- ✅ 페이지 이동이 편리한 UI
- ✅ 상태 관리 경험 축적

> 📝 [상세 구현 과정 보기](https://sticky-chill-dd2.notion.site/16-280342983be381c1a6a6faefc20b0c3f)

<!-- 여기에 Pagination 동작 GIF 추가 -->

---

### 4️⃣ IoT 데이터 차트 시각화 📊

**🔍 문제 상황**
```
축사 관리자가 센서 데이터를 숫자로만 확인 → 직관적 파악 어려움
기간별 온도 변화 추이를 한눈에 볼 수 없음
```

**💡 해결 방법**
```javascript
// Chart.js를 활용한 라인 차트 구현
<Line
  data={{
    labels: dateLabels,  // 날짜
    datasets: [
      { label: '최고 온도', data: maxTemps, borderColor: 'rgb(255, 99, 132)' },
      { label: '평균 온도', data: avgTemps, borderColor: 'rgb(75, 192, 192)' },
      { label: '최저 온도', data: minTemps, borderColor: 'rgb(54, 162, 235)' }
    ]
  }}
/>
```

**🐛 시행착오**
```xml
<!-- 문제: SQL 쿼리에 WHERE 절 누락 → 모든 날짜의 데이터가 섞여서 조회됨 -->
<!-- 해결: WHERE 절과 ORDER BY 절 추가 -->
<select id="getTemperatureData">
  SELECT 
    IFNULL(CREATE_DATE, ADDDATE(CURRENT_DATE(), -#{each})) CREATE_DATE,
    IFNULL(AVG(TEMPERATURE), 0) AS AVG_TEMP,
    IFNULL(MAX(TEMPERATURE), 0) AS MAX_TEMP,
    IFNULL(MIN(TEMPERATURE), 0) AS MIN_TEMP
  FROM fan_function
  WHERE TO_CHAR(CREATE_DATE, 'YYYY-MM-DD') = ADDDATE(CURRENT_DATE(), -#{each})
  ORDER BY CREATE_DATE ASC
</select>
```

**✨ 결과**
- ✅ 1~4주 단위로 온도 데이터 조회 가능
- ✅ 최고/평균/최저 온도를 시각적으로 비교
- ✅ 관리자가 축사 환경을 직관적으로 파악 가능

> 📝 [상세 구현 과정 보기 - 프론트엔드](https://sticky-chill-dd2.notion.site/17-288342983be381bfaef5fc099e5c6197)  
> 📝 [상세 구현 과정 보기 - 백엔드](https://sticky-chill-dd2.notion.site/18-28d342983be380119aeede978dc4e642)

<!-- 여기에 차트 화면 캡처 추가 -->

<br>

## 📁 프로젝트 구조

```
team/
├── backend_farm_hub/              # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/craft/backend_farm_hub/
│   │   │   │   ├── item/         # 상품 관련
│   │   │   │   ├── member/       # 회원 관련
│   │   │   │   ├── cart/         # 장바구니
│   │   │   │   ├── order/        # 주문
│   │   │   │   ├── review/       # 리뷰
│   │   │   │   └── sensor/       # IoT 센서
│   │   │   └── resources/
│   │   │       ├── mapper/       # MyBatis XML
│   │   │       └── application.properties
│   └── build.gradle
│
├── frontend_farm_hub/             # React 웹
│   ├── src/
│   │   ├── components/           # 재사용 컴포넌트
│   │   ├── pages/                # 페이지
│   │   │   ├── user/            # 사용자 페이지
│   │   │   └── admin/           # 관리자 페이지
│   │   ├── layout/              # 레이아웃
│   │   └── App.jsx
│   └── package.json
│
├── frontend_farm_hub_app/        # React Native 앱
│   ├── app/
│   │   ├── (tabs)/              # 탭 네비게이션
│   │   ├── auth/                # 로그인/회원가입
│   │   └── _layout.jsx
│   └── package.json
│
└── 팀플.sql                      # 데이터베이스 스키마
```

<br>

## 🗄️ 데이터베이스 설계 (ERD)

### 주요 테이블

| 테이블명 | 설명 |
|---------|------|
| `SHOP_MEMBER` | 회원 정보 (ID, PW, 이름, 주소, 권한 등) |
| `ITEM` | 상품 정보 (상품명, 가격, 부위, 원산지, 평균 평점 등) |
| `ORDERS` | 주문 정보 (주문 ID, 회원 ID, 총 금액, 주문 상태 등) |
| `PAYMENT` | 결제 정보 (결제 ID, 주문 ID, 결제 수단, 결제 상태 등) |
| `REVIEW` | 리뷰 (별점, 제목, 내용, 조회수 등) |
| `SHOP_CART` | 장바구니 |
| `DIBS` | 찜하기 |
| `QNA` / `REPLY` | 문의 및 답변 |
| `FAN_FUNCTION` | 온습도 센서 데이터 |
| `illuminance_function` | 조도 센서 데이터 |

<!-- 여기에 ERD 이미지 추가 -->

<br>

## 🚀 설치 및 실행 방법

### 1️⃣ 필수 요구사항

```
☑️ Java JDK 17 이상
☑️ Node.js v18 이상
☑️ MariaDB 10.x 이상
☑️ Gradle 8.x 이상
```

### 2️⃣ 데이터베이스 설정

```sql
-- MariaDB 접속 후 데이터베이스 생성
CREATE DATABASE farm_hub;

-- SQL 파일 실행
SOURCE 팀플.sql;
```

### 3️⃣ 백엔드 실행

```bash
cd backend_farm_hub

# application.properties에서 DB 연결 정보 수정
# spring.datasource.url=jdbc:mariadb://localhost:3306/farm_hub
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Spring Boot 실행
./gradlew bootRun
```

서버가 `http://localhost:8080`에서 실행됩니다.

### 4️⃣ 웹 프론트엔드 실행

```bash
cd frontend_farm_hub

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 5️⃣ 모바일 앱 실행

```bash
cd frontend_farm_hub_app

# 의존성 설치
npm install

# Expo 개발 서버 실행
npm start
```

**옵션:**
- `a` - Android 에뮬레이터에서 실행
- `i` - iOS 시뮬레이터에서 실행 (Mac 전용)
- `w` - 웹 브라우저에서 실행

또는 스마트폰에 **Expo Go** 앱을 설치하고 QR 코드를 스캔하여 실행

<br>

## 📚 프로젝트를 통해 배운 것

### 1. 문제 해결 능력 🔍
```
단순히 코드가 작동하는 것에 그치지 않고, 
"왜 이렇게 작동하는가?"를 끝까지 파고들며 
근본 원인을 찾아 해결하는 습관을 기를 수 있었습니다.
```

### 2. 컴포넌트 재사용의 중요성 ♻️
```
중복 코드를 발견하고 공통 컴포넌트로 분리하면서,
코드의 유지보수성과 가독성이 얼마나 중요한지 체감했습니다.
앞으로도 "이 코드는 재사용 가능한가?"를 항상 고민하겠습니다.
```

### 3. 팀 협업의 가치 👥
```
Git을 통한 버전 관리, 코드 리뷰, 역할 분담 등
실제 개발 현장과 유사한 협업 경험을 쌓았습니다.
특히 conflict를 해결하는 과정에서 많이 배웠습니다.
```

### 4. 풀스택 개발의 이해 🔄
```
백엔드 API 설계 → 프론트엔드 연동 → IoT 데이터 처리
전체 흐름을 경험하며 서비스가 어떻게 동작하는지 이해하게 되었습니다.
```

<br>

## 💭 프로젝트 회고

> **"내가 작성한 코드로 실제 하드웨어가 움직이는 순간의 감동"**

처음 라즈베리파이의 LED가 제 코드로 켜졌을 때의 그 순간을 잊을 수 없습니다.  
단순히 화면에 글자가 출력되는 것을 넘어서, **실제 물리적인 변화를 만들어낸다**는 것이  
개발의 진짜 매력이라는 것을 깨달았습니다.

이 프로젝트는 비전공자인 제게 **개발자로서의 자신감**을 준 소중한 경험이었습니다.  
처음에는 "내가 할 수 있을까?" 하는 걱정이 컸지만,  
하루하루 기록하고, 모르는 것을 끝까지 파고들며 배워나가자  
어느새 웹, 앱, IoT를 아우르는 풀스택 프로젝트를 완성할 수 있었습니다.

앞으로도 이 **진득함과 끈기**를 바탕으로, 사용자에게 가치를 주는 서비스를  
만드는 개발자가 되고 싶습니다. 🌱

<br>

## 📖 개발 일지

프로젝트 진행 중 **매일 Notion에 학습 내용과 문제 해결 과정**을 기록했습니다.

> 💡 **Tips:** 문제를 만났을 때 바로 질문하기보다,  
> 먼저 스스로 해결을 시도하고 그 과정을 기록하면  
> 나중에 유사한 문제를 만났을 때 빠르게 해결할 수 있습니다!

📝 [전체 작업 일지 보기](https://sticky-chill-dd2.notion.site/278342983be38089b8dfda2a76735e91)

<br>

## 👤 만든 사람

**이근형** (LEE GEUN HYEONG)

```
일본어 전공에서 개발자로 전향
"언어의 논리를 코드로 구현하며 성장하는 개발자"
```

📧 **Email**: geunhyeong930@gmail.com  
🐙 **GitHub**: https://github.com/ne-aki/team  
📝 **Notion**: [학습 기록](https://sticky-chill-dd2.notion.site/)  
📞 **Tel**: 010-4792-3663  

<br>

## 📜 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

<br>

---

<div align="center">

### ⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐

**"끝까지 포기하지 않는 진득함으로, 더 나은 개발자가 되겠습니다."**

</div>
