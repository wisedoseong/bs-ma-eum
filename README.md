# 마음(Ma-eum) - AI 기반 텍스트 및 이미지 생성 애플리케이션

이 프로젝트는 Google의 Gemini AI 모델을 활용하여 다양한 종류의 텍스트를 생성 및 수정하고, 생성된 텍스트를 기반으로 이미지를 만드는 SvelteKit 기반 웹 애플리케이션입니다.

사용자는 간단한 키워드나 원본 텍스트만으로 상장, 일기, 보고서, 이메일 등 다양한 목적의 글을 만들고, 원하는 스타일의 이미지까지 한 번에 얻을 수 있습니다.

## ✨ 주요 기능

- **다양한 문서 타입 생성**: 상장, 일기, 보고서, 메일, 블로그 포스트, 광고 문구 등
- **텍스트 수정 기능**: 입력된 텍스트의 오타 수정 및 문맥 개선
- **AI 이미지 생성**: 생성된 텍스트의 내용과 스타일에 맞춰 이미지 생성
- **다양한 스타일 지정**: 근엄하게, SNS 스타일 등 다양한 작문 스타일 및 이미지 스타일 선택 가능
- **커스터마이징**: API 키, 시스템 프롬프트, 이미지 스타일 사용자 정의 기능
- **API 문서**: Swagger UI를 통한 인터랙티브 API 문서 제공 (`/api/docs`)

## 🛠️ 기술 스택

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Core API**: Google Gemini API
- **UI**: Svelte Components, Tailwind CSS (추정)
- **Package Manager**: pnpm

## 🚀 시작하기

로컬 환경에서 프로젝트를 실행하려면 다음 단계를 따르세요.

### 1. 프로젝트 클론

```bash
git clone https://github.com/wisedoseong/bs-ma-eum.git
cd bs-ma-eum
```

### 2. 종속성 설치

이 프로젝트는 `pnpm`을 사용합니다. 다음 명령어로 필요한 모든 패키지를 설치합니다.

```bash
pnpm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다. 이 파일은 UI에서 API 키를 입력하지 않고 서버 측에서 기본 키를 사용하고 싶을 때 필요합니다.

```bash
cp .env.example .env
```

그런 다음, 생성된 `.env` 파일을 열어 자신의 Google Gemini API 키를 입력합니다.

```
VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

> **참고**: API 키를 `.env` 파일에 설정하지 않아도 UI의 설정 메뉴를 통해 직접 입력하고 사용할 수 있습니다.

### 4. 개발 서버 실행

다음 명령어로 개발 서버를 시작합니다.

```bash
pnpm dev
```

애플리케이션은 기본적으로 `http://localhost:5173` 에서 실행됩니다.

## 📚 API

주요 API 엔드포인트는 다음과 같습니다.

- `POST /api/text-generate`: 텍스트 생성 및 수정
- `POST /api/image-generate`: 이미지 생성
- `POST /api/generate`: 텍스트와 이미지 동시 생성

자세한 명세 및 테스트는 애플리케이션 실행 후 `/api/docs` 경로에서 직접 확인하고 실행해볼 수 있습니다.
