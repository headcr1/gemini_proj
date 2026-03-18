# Glassmorphic To-Do List Project Context

이 프로젝트는 현대적이고 세련된 Glassmorphism 디자인이 적용된 웹 기반 할 일 목록 애플리케이션입니다. 사용자 친화적인 인터페이스와 브라우저 로컬 저장소를 활용한 데이터 지속성을 제공합니다.

## Project Overview

- **Purpose:** 사용자에게 시각적으로 즐거운 경험을 제공하면서 할 일을 효율적으로 관리할 수 있는 도구를 제공합니다.
- **Main Technologies:**
  - **Frontend:** HTML5, CSS3 (Vanilla)
  - **Scripting:** JavaScript (Vanilla JS)
  - **Styling:** Glassmorphism 디자인 기법, CSS Animations
- **Architecture:** 단일 페이지 애플리케이션(SPA) 구조로, 별도의 백엔드 없이 클라이언트 사이드에서 모든 로직이 처리됩니다.
  - `index.html`: 애플리케이션의 골격과 UI 구조 정의.
  - `style.css`: 레이아웃, 유리 질감 효과, 색상 테마 및 애니메이션 정의.
  - `script.js`: 할 일 추가/삭제/토글 기능 및 LocalStorage 연동 로직 담당.

## Building and Running

이 프로젝트는 별도의 빌드 과정이 필요 없는 정적 웹 애플리케이션입니다.
- **실행 방법:** 브라우저에서 `index.html` 파일을 직접 열어 실행합니다.
- **의존성:** 외부 라이브러리나 프레임워크 없이 브라우저 기본 기능만 사용합니다.

## Development Conventions

- **HTML:** Semantic 태그를 최대한 활용하며, ID와 Class를 명확하게 구분하여 사용합니다.
- **CSS:** 변수(`:root`)를 사용하여 색상 테마를 관리하며, Glassmorphism 효과를 위해 `backdrop-filter`와 `rgba` 색상을 적극적으로 사용합니다.
- **JS:** DOMContentLoaded 이벤트 이후 로직을 실행하며, 코드의 가독성을 위해 기능별로 함수를 분리하여 작성합니다.
- **Data Persistence:** 사용자의 데이터를 유지하기 위해 브라우저의 `localStorage`를 사용하며, 데이터 구조는 `{ id, text, completed }` 객체의 배열 형식을 따릅니다.

## Key Files

- `index.html`: 메인 UI 구조 및 요소 정의.
- `style.css`: Glassmorphic 스타일링 및 애니메이션.
- `script.js`: 비즈니스 로직 및 상태 관리.
- `README.md`: 프로젝트 기본 설명 및 사용 가이드.

## Documentation

- 프로젝트의 주요 변경 사항이나 추가 기능 구현 시 `README.md`를 최신 상태로 유지합니다.
- 복잡한 로직이 추가될 경우 `script.js` 내에 주석으로 설명을 보완합니다.
