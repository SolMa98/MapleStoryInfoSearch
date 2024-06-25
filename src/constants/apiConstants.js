/**
 * 넥슨 open api constants 정의
 */

// 기본 주소
export const API_BASE_URL = "https://open.api.nexon.com/maplestory/v1/";

// API 엔드 포인트
export const API_ENDPOINTS = {
    ID: "id",                                                       // 캐릭터 식별자 (ocid) 조회
    CHARACTER_LIST: "character/list",                               // 캐릭터 목록 조회
    CHARACTER_BASIC: "character/basic",                             // 기본 정보 조회
    CHARACTER_POPULARITY: "character/popularity",                   // 인기도 정보 조회
    CHARACTER_STAT: "character/stat",                               // 종합 능력치 정보 조회
    CHARACTER_HYPER_STAT: "character/hyper-stat",                   // 하이퍼 스탯 정보 조회
    CHARACTER_PROPENSITY: "character/propensity",                   // 성향 정보 조회
    CHARACTER_ABILITY: "character/ability",                         // 어빌리티 정보 조회
    CHARACTER_ITEM_EQUIPMENT: "character/item-equipment",           // 장착 장비 정보 조회
    CHARACTER_CASH_ITEM_EQUIPMENT: "character/cashitem-equipment",  // 장착 캐시 장비 정보 조회
    CHARACTER_SYMBOL_EQUIPMENT: "character/symbol-equipment",       // 장착 심볼 정보 조회
    CHARACTER_SET_EFFECT: "character/set-effect",                   // 적용 세트 효과 정보 조회
    CHARACTER_BEAUTY_EQUIPMENT: "character/beauty-equipment",       // 장착 헤어, 성형 정보 조회
    CHARACTER_ANDROID_EQUIPMENT: "character/android-equipment",     // 장착 안드로이드 정보 조회
    CHARACTER_PET_EQUIPMENT: "character/pet-equipment",             // 장착 펫 정보 조회
    CHARACTER_SKILL: "character/skill",                             // 스킬 정보 조회
}

