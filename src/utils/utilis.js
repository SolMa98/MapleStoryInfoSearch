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