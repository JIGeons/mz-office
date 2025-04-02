# 🏆 [비사이드 X NAVER CLOUD 502 포텐데이 온라인 해커톤]  
### 프로토타입 부문 3등 · 데모데이 최종 우수상 수상  

<img width="830" alt="수상 이미지" src="https://github.com/user-attachments/assets/5f872f54-429b-4c12-a33d-1679a8aa4b5b" />

4명으로 구성된 소규모 팀이었지만, 팀원 간의 긴밀한 협업과 빠른 의사결정으로  
6인 이상 팀들과의 경쟁에서 두각을 나타내며 **프로토타입 3등**, **데모데이 최종 우수상**을 수상하였습니다.  

- **참여 인원**: 기획 1 · 디자인 1 · 프론트엔드 1 · 백엔드 1

---

# 💼 신입 사원을 위한 AI 서비스 “MZ오피스”

<img width="800" alt="MZ오피스 데모 이미지" src="https://github.com/user-attachments/assets/8adfdd85-c2df-49c3-89b0-ae425e532bcd" />

### 🔗 [서비스 소개 바로가기](https://dahye-backend-developer.my.canva.site/mz-office)

---

## ✨ 기획 배경

최근 통계에 따르면, 신입 사원들이 직장 내에서 메일/문자 작성에 어려움을 겪는 경우가 많다는 문제점이 있습니다.  
**MZ오피스**는 이 Pain Point를 해결하기 위해 기획된 서비스입니다.

---

## 💡 서비스 소개

- **서비스명**: MZ오피스  
- **한 줄 설명**: MZ세대를 위한 문자/메일 작성 도우미 챗봇

---

## 🎯 주요 타겟

- **20~30대 직장인 신입 사원**

---

## 🧩 핵심 기능

1. ✉️ 문자 작성 요청  
2. 📧 메일 작성 요청  
3. 🔍 문구 해석 요청  
4. 📘 비즈니스 용어 단어장

---

## 👨‍💻 담당 역할

- **실시간 채팅 시스템 설계 및 구현**  
  - WebSocket 기반의 양방향 통신 구조에 맞춰 클라이언트 메시지 전송 및 수신 흐름 구현
  - 연결 상태 확인 및 자동 재연결 로직 구현을 통해 끊김 없는 메시지 전송 처리  
  - NCP 로드밸런서의 Idle Timeout(60초 → 600초) 설정을 통해 장시간 미사용 시의 연결 끊김 문제 해결

- **NCP 기반 배포 인프라 구성 및 운영**  
  - NCP 서버 + Nginx 기반의 SPA 정적 파일 배포 및 클라이언트 사이드 라우팅 대응  
  - 도메인 연결 및 SSL 인증서 적용을 통해 HTTPS 환경 구축 및 접근성 개선
    
- **프론트엔드 CI/CD 자동화 구축**  
  - GitHub Actions를 활용하여 main 브랜치에 push 시 자동으로 빌드 및 배포 실행  
  - 환경 변수 주입부터 배포까지 GitHub Actions로 자동화하여, 수동 배포 과정 제거 및 안정성 확보
  - 배포 전 자동 백업, 실패 시 롤백 처리, 성공 시 백업 정리까지 포함된 무중단 배포 흐름 구성


---

## 🛠 기술 스택

### 🚀 Frontend  
- React (19.0.0)  
- CRA (Create React App)

### 📦 State Management  
- Redux Toolkit

### 🎨 Styling  
- Custom CSS

### 🔌 API Communication  
- Axios

### 🛠 Development Tools  
- Webpack (Custom 설정 적용)  
- ESLint & Prettier

### ☁️ Infra 구성
- WebSocket (Node.js 기반 커스텀 서버)  
- Nginx  
- NCP (Naver Cloud Platform)  
- VPC 설정 및 로드밸런서 Timeout 설정

### ⚙️ CI/CD  
- GitHub Actions 기반의 자동 빌드 및 배포 파이프라인 구축  
- Secrets 및 SCP를 활용한 안전한 서버 배포 구성

---

## ⚙️ WebSocket 기반 실시간 채팅 개선 성과

- **초기 설계 단계부터 WebSocket을 도입**하여, 실시간 메시지 송수신을 위한 구조적 기반을 마련  
- **Polling/REST API 방식의 한계를 고려하여**, 낮은 지연 시간과 서버 푸시 기능을 갖춘 WebSocket을 채택  
- **로드밸런서 Idle Timeout** 설정을 600초로 확장하여 장시간 미사용 상태에서도 안정적인 연결 유지  
- **WebSocket 연결 상태 체크 및 재연결 로직을 리팩토링**  
  → 연결이 끊어진 경우에도 사용자가 메시지를 전송하면 자동으로 연결을 복원한 뒤 메시지를 전송  
- **리소스 낭비 최소화 및 사용자 경험 개선**  
  → 불필요한 재시도 제거, 끊김 없는 채팅 흐름 유지, 재접속 문제 발생률 감소

---

## 🌐 NCP 기반 인프라 및 배포 구성 요약

- **NCP Global Edge의 SPA 대응 한계**를 극복하기 위해, <br />
  NCP 서버 + 로드밸런서 + Nginx 기반의 배포 구조로 전환  
- **Nginx 설정** (`try_files $uri /index.html`)을 통해 React SPA의 클라이언트 사이드 라우팅 문제 해결  
- **로드밸런서를 활용한 SSL 인증서 적용**, <br />
  80 → 443 포트 리다이렉션으로 보안성 및 신뢰도 강화  
- **NCP 네임서버 설정을 통한 전용 도메인 연결**로 접근성 및 브랜딩 효과 향상  
- 기존 NCP Global Edge 구조의 한계를 보완하고, **SPA에 최적화된 확장 가능한 인프라 환경 구축에 성공**

---

## ⚙️ GitHub Actions 기반 프론트엔드 CI/CD 자동화 구축
- GitHub Actions에서 main 브랜치에 push 시 자동 빌드 및 배포 실행
- .env.production에 필요한 환경변수는 GitHub Secrets로 안전하게 주입
- appleboy/scp-action을 활용해 NCP 서버로 dist 파일을 SSH 기반 업로드
- 배포 전 자동 백업, 실패 시 복원, 성공 시 백업 정리 포함
- 운영자의 개입 없이도 안정적인 정적 파일 배포 흐름 구성
