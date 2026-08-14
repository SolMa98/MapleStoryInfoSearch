import { formatNumber } from "../../utils/utilis";
import { toShortDateLabel } from "../../utils/dateUtils";

// 최근 N일 경험치 달성률(%) 막대 그래프 - 막대 높이는 그 날짜의 경험치 %, hover 시 전날 대비 증가량 표시
const ExpHistoryChart = ({history, loading}) => {
    const hasAnyData = history.some(item => item?.expRate !== null && item?.expRate !== undefined);

    return (
        <div className="exp-history-card">
            <div className="side-card-header">
                <h2 className="side-card-title">경험치 변화</h2>
                <span className="side-card-count">{"최근 " + (history.length || 7) + "일"}</span>
            </div>

            {loading && history.length === 0 ? (
                <p className="side-card-empty">경험치 히스토리를 불러오는 중입니다...</p>
            ) : !hasAnyData ? (
                <p className="side-card-empty">경험치 히스토리를 불러올 수 없습니다.</p>
            ) : (
                <>
                    <div className="exp-history-chart">
                        {history.map((item, index) => {
                            const hasExpRate = item?.expRate !== null && item?.expRate !== undefined;
                            const hasLevel = item?.level !== null && item?.level !== undefined;
                            const hasGain = item?.gain !== null && item?.gain !== undefined;
                            const expRate = hasExpRate ? Number(item.expRate) : 0;
                            const heightPercent = hasExpRate ? Math.max(expRate, expRate > 0 ? 2 : 0) : 2;

                            return (
                                <div key={"exp-history-col-" + index} className="exp-history-col">
                                    <div className="exp-history-tooltip">
                                        <span className="exp-history-tooltip-date">{item.date}</span>
                                        <span className="exp-history-tooltip-value">
                                            {hasGain ? "+" + formatNumber(item.gain) + " EXP" : "데이터 없음"}
                                        </span>
                                    </div>
                                    <div
                                        className={"exp-history-bar" + (hasExpRate ? "" : " is-empty")}
                                        style={{height: heightPercent + "%"}}
                                    >
                                        {hasLevel && (
                                            <span className="exp-history-level-label">{"Lv." + item.level}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="exp-history-labels">
                        {history.map((item, index) => (
                            <span key={"exp-history-label-" + index} className="exp-history-label">
                                {toShortDateLabel(item.date)}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ExpHistoryChart;