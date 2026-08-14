// 지정 ms만큼 대기 (API 연속 호출 시 간격을 두기 위한 용도)
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 지정 색상에서 transparent color 얻기 ( 색상, 투명 %)
export function applyTransparency(color, alpha) {
    if (color.startsWith('#')) {
        let hex = color.slice(1);
        let rgb = parseInt(hex, 16);
        let r = (rgb >> 16) & 0xff;
        let g = (rgb >> 8) & 0xff;
        let b = (rgb >> 0) & 0xff;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (color.startsWith('rgb')) {
        let match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
            let [, r, g, b] = match;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
            throw new Error('Invalid RGB/RGBA color format');
        }
    } else {
        throw new Error('Unsupported color format');
    }
}

// final_stat 배열에서 특정 stat_name 조회
export function findStat(finalStat, statName) {
    return finalStat?.find(stat => stat?.stat_name === statName);
}

// 주스탯(값이 가장 큰 STR/DEX/INT/LUK) 조회
const MAIN_STAT_CANDIDATES = ["STR", "DEX", "INT", "LUK"];
export function getMainStat(finalStat) {
    let mainStat = { stat_name: "STR", stat_value: 0 };
    MAIN_STAT_CANDIDATES.forEach(statName => {
        const stat = findStat(finalStat, statName);
        if (stat && Number(stat.stat_value) > Number(mainStat.stat_value)) {
            mainStat = stat;
        }
    });
    return mainStat;
}

// 숫자 표기 (미조회 시 "-")
export function formatNumber(value) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue.toLocaleString() : "-";
}

// 장비 프리셋 배열의 스타포스 합계
export function sumStarforce(equipmentItems) {
    if (!Array.isArray(equipmentItems)) {
        return 0;
    }
    return equipmentItems.reduce((total, item) => total + (Number(item?.starforce) || 0), 0);
}

// 랜덤 String 생성
export function getRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

// MaxStarForce result
export function maxStarForce(name, level) {
    if (name.includes("노바") || name.includes("히아데스")) {
        // 노바나 히아데스가 포함된 경우
        if (level >= 0 && level <= 94) {
            return 3;
        } else if (level >= 95 && level <= 107) {
            return 5;
        } else if (level >= 108 && level <= 117) {
            return 8;
        } else if (level >= 118 && level <= 127) {
            return 10;
        } else if (level >= 128 && level <= 137) {
            return 12;
        } else if (level >= 138) {
            return 15;
        }
    } else {
        // 노바나 히아데스가 포함되지 않은 경우
        if (level >= 0 && level <= 94) {
            return 5;
        } else if (level >= 95 && level <= 107) {
            return 8;
        } else if (level >= 108 && level <= 117) {
            return 10;
        } else if (level >= 118 && level <= 127) {
            return 15;
        } else if (level >= 128 && level <= 137) {
            return 20;
        } else if (level >= 138) {
            return 25;
        }
    }
}