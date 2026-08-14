// localStorage 기반 즐겨찾기 / 최근 검색 / 경험치 히스토리 관리
const FAVORITES_KEY = "mereni_favorites";
const RECENT_SEARCHES_KEY = "mereni_recent_searches";
const MAX_RECENT_SEARCHES = 5;
const EXP_HISTORY_KEY_PREFIX = "mereni_exp_history_v2_";
const CHARACTER_CACHE_KEY_PREFIX = "mereni_character_cache_";

function readList(key) {
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function writeList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

// 즐겨찾기 목록 조회
export function getFavorites() {
    return readList(FAVORITES_KEY);
}

// 즐겨찾기 여부 확인
export function isFavorite(name) {
    return getFavorites().some(item => item.name === name);
}

// 즐겨찾기 토글 (character: { name, level, ocid })
export function toggleFavorite(character) {
    const favorites = getFavorites();
    const existsIndex = favorites.findIndex(item => item.name === character.name);

    const next = existsIndex >= 0
        ? favorites.filter((_, index) => index !== existsIndex)
        : [...favorites, character];

    writeList(FAVORITES_KEY, next);
    window.dispatchEvent(new Event("mereni-favorites-changed"));
    return next;
}

// 최근 검색 목록 조회
export function getRecentSearches() {
    return readList(RECENT_SEARCHES_KEY);
}

// 최근 검색 추가 (character: { name, ocid }) - 중복 제거, 최대 5개
export function addRecentSearch(character) {
    const filtered = getRecentSearches().filter(item => item.name !== character.name);
    const next = [character, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    writeList(RECENT_SEARCHES_KEY, next);
    window.dispatchEvent(new Event("mereni-recent-searches-changed"));
    return next;
}

function readExpHistoryMap(ocid) {
    try {
        const raw = localStorage.getItem(EXP_HISTORY_KEY_PREFIX + ocid);
        const parsed = raw ? JSON.parse(raw) : {};
        return (parsed && typeof parsed === "object") ? parsed : {};
    } catch (error) {
        return {};
    }
}

// 날짜별 경험치 스냅샷 캐시 조회 (지난 날짜의 값은 바뀌지 않으므로 무기한 캐시)
// snapshot: { exp: 누적 경험치, level: 레벨, expRate: 그 레벨에서의 경험치 % }
export function getCachedExp(ocid, date) {
    const map = readExpHistoryMap(ocid);
    const value = Object.prototype.hasOwnProperty.call(map, date) ? map[date] : null;
    if (value === null) {
        return null;
    }
    // 이전 버전 캐시(숫자만 저장) 호환
    return (typeof value === "object") ? value : { exp: value, level: null, expRate: null };
}

// 날짜별 경험치 스냅샷 캐시 저장
export function setCachedExp(ocid, date, snapshot) {
    const map = readExpHistoryMap(ocid);
    map[date] = snapshot;
    localStorage.setItem(EXP_HISTORY_KEY_PREFIX + ocid, JSON.stringify(map));
}

// 캐릭터 상세정보(기본/능력치/장비/세트효과/어빌리티) 캐시 조회
// date가 저장 당시와 다르면(날짜가 바뀌면) 무효 - 하루 지나면 자동으로 다시 호출된다
export function getCachedCharacterInfo(ocid, date) {
    try {
        const raw = localStorage.getItem(CHARACTER_CACHE_KEY_PREFIX + ocid);
        const parsed = raw ? JSON.parse(raw) : null;
        return (parsed && parsed.date === date) ? parsed.data : null;
    } catch (error) {
        return null;
    }
}

// 캐릭터 상세정보 캐시 저장 (캐릭터당 최신 하루치만 유지 - 이전 날짜 캐시는 자동으로 대체됨)
export function setCachedCharacterInfo(ocid, date, data) {
    localStorage.setItem(CHARACTER_CACHE_KEY_PREFIX + ocid, JSON.stringify({ date, data }));
}