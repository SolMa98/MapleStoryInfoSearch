// 캐릭터 닉네임 유효성 검사 (한글/영문/공백만 허용, 공백 단독 불가)
const INVALID_NAME_PATTERN = /([^가-힣a-z\x20])/i;

export function isValidCharacterName(name) {
    if (!name || name.includes(" ") || INVALID_NAME_PATTERN.test(name)) {
        return false;
    }
    return true;
}