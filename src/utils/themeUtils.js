// 다크/라이트 테마 관리 (localStorage 저장)
const THEME_KEY = "theme";

// 저장된 테마 조회 (기본값 dark)
export function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

// 테마를 문서에 적용하고 저장
export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
}

// 테마 토글 (다크 <-> 라이트)
export function toggleTheme() {
    const next = getStoredTheme() === "light" ? "dark" : "light";
    applyTheme(next);
    return next;
}