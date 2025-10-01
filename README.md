<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Future Face Generator

아이의 사진을 업로드하면 AI가 미래 모습을 생성해주는 웹 애플리케이션입니다.

## 로컬에서 실행하기

**필수 요구사항:** Node.js

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 환경 변수 설정:
   `.env.local` 파일을 생성하고 Gemini API 키를 설정하세요:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

## Vercel에 배포하기

1. GitHub에 코드를 푸시합니다.

2. [Vercel](https://vercel.com)에 로그인하고 새 프로젝트를 생성합니다.

3. GitHub 저장소를 연결합니다.

4. 환경 변수 설정:
   - Vercel 대시보드에서 프로젝트 설정으로 이동
   - Environment Variables 섹션에서 `GEMINI_API_KEY`를 추가
   - 값에 실제 Gemini API 키를 입력

5. 배포를 시작합니다.

## 문제 해결

### 배포 후 배경만 보이는 문제
- Tailwind CSS가 제대로 빌드되지 않았을 수 있습니다.
- `npm install` 후 `npm run build`로 빌드가 성공하는지 확인하세요.
- 환경 변수가 Vercel에 올바르게 설정되었는지 확인하세요.
