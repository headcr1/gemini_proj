# 초당대학교 AI 상담 지원 시스템 (CDU AI Counseling System)

초당대학교 지도교수님들을 위한 사회복지전공 성인학습자 상담 지원 AI 도구입니다. 이 시스템은 비정형 상담 메모를 대학 통합정보시스템 양식에 맞는 전문적인 상담 보고서로 자동 변환해줍니다.

## 🚀 주요 기능

- **AI 상담 메모 분석**: Google Gemini 2.5 Flash 엔진을 사용하여 거친 메모를 [상담내용] 및 [향후계획] 섹션으로 구성된 전문 보고서로 변환합니다.
- **학생 명단 관리**: 학과, 학번, 성명 등 학생 정보를 관리하며 CSV 파일을 통한 일괄 가져오기가 가능합니다.
- **상담 이력 관리**: 모든 상담 기록을 데이터베이스(LocalStorage)에 저장하고, 필요 시 CSV 파일로 내보낼 수 있습니다.
- **AI 지능형 상담원**: 상담 과정에서 필요한 조언이나 정보를 즉시 제공하는 챗봇 기능을 포함합니다.
- **네이티브 데스크톱 앱**: Tauri를 기반으로 한 가볍고 빠른 Windows용 네이티브 애플리케이션입니다.

## 🛠 기술 스택

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend/Desktop**: Tauri (Rust)
- **AI Service**: Google Generative AI (Gemini 2.5 Flash)
- **Data Persistence**: LocalStorage (브라우저 로컬 저장소)

## 📦 시작하기

### 사전 요구 사항

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- [Rust & Cargo](https://www.rust-lang.org/) (Tauri 빌드용)
- Google Gemini API Key

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/headcr1/gemini_proj.git
   cd gemini_proj
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env` 파일을 생성하고 Gemini API 키를 추가합니다.
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **개발 모드 실행**
   ```bash
   npm run tauri dev
   ```

5. **애플리케이션 빌드**
   ```bash
   npm run tauri build
   ```

## 📝 라이선스

이 프로젝트는 초당대학교 사회복지전공 교육 및 상담 지원 목적으로 개발되었습니다.

---
© 2024 초당대학교 AI 상담 시스템 프로젝트
