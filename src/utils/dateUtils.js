// 한국 표준시(KST) 기준 날짜 계산 - 넥슨 오픈 API의 date 파라미터는 KST 기준
function getKstDateString(offsetDays) {
    const now = new Date();
    const kstNow = new Date(now.getTime() + (9 * 60 - now.getTimezoneOffset()) * 60000);
    kstNow.setDate(kstNow.getDate() + offsetDays);

    const yyyy = kstNow.getFullYear();
    const mm = String(kstNow.getMonth() + 1).padStart(2, "0");
    const dd = String(kstNow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

// 오늘 날짜 (KST 기준, YYYY-MM-DD)
export function getTodayKstDate() {
    return getKstDateString(0);
}

// 어제부터 n일 전까지의 날짜 배열 (과거 -> 어제 순)
// 넥슨 오픈 API는 당일 데이터를 제공하지 않아 어제까지만 조회한다
export function getPastKstDates(n) {
    const dates = [];
    for (let i = n; i >= 1; i--) {
        dates.push(getKstDateString(-i));
    }
    return dates;
}

// "YYYY-MM-DD" -> "M/D"
export function toShortDateLabel(dateString) {
    const [, month, day] = dateString.split("-");
    return `${Number(month)}/${Number(day)}`;
}