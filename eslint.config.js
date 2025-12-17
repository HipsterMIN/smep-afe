import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const PLUGINS = {
  react,
  "react-hooks": reactHooks,
  "react-refresh": reactRefresh,
  "simple-import-sort": simpleImportSort,
  prettier,
};

const LANGUAGE_OPTIONS = {
  ecmaVersion: 2020,
  globals: globals.browser,
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
};

const baseRules = {
  ...react.configs.recommended.rules,
  ...react.configs["jsx-runtime"].rules,
  ...reactHooks.configs.recommended.rules,
  ...reactRefresh.configs.vite.rules,
  "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
};

const formattingRules = {
  // Prettier 강제 규칙 해제: 작은 따옴표('')와 큰 따옴표("") 혼용 허용
  // (Prettier는 기본적으로 일관된 스타일을 강제하므로, 자유로운 사용을 위해 에러 표시를 끔)
  "prettier/prettier": "off",
};

const importSortRules = {
  // Import 정렬 강제 (유지보수성 향상)
  "simple-import-sort/imports": "error",
  "simple-import-sort/exports": "error",
};

const a11yRules = {
  // 접근성 경고 수준 격상 (공공기관은 접근성 위반 시 배포 불가 원칙 권장)
  "jsx-a11y/alt-text": "error", // 이미지 대체 텍스트 누락 시 에러
  "jsx-a11y/click-events-have-key-events": "warn", // 마우스 클릭 요소에 키보드 이벤트 필수
  "jsx-a11y/no-autofocus": "warn", // 자동 포커스 지양
};

const securityRules = {
  // 보안 및 React 핵심 규칙 (공공기관 필수)
  "react/no-danger": "error", // XSS 취약점 방지 (dangerouslySetInnerHTML 금지)
  "react/jsx-no-target-blank": "error", // target="_blank" 보안 취약점 방지
};

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  // 접근성 규칙 (공공기관 필수) - Flat Config 호환 설정
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: PLUGINS,
    languageOptions: LANGUAGE_OPTIONS,
    settings: { react: { version: "detect" } },
    rules: {
      ...baseRules,
      ...formattingRules,
      ...importSortRules,
      ...a11yRules,
      ...securityRules,
    },
  },
  // Prettier 충돌 방지 설정 (항상 배열의 마지막에 위치해야 React 규칙 등과 충돌하지 않음)
  eslintConfigPrettier,
];
