import React from "react";

// 스탯 상세 목록에서 제외할 항목 (AP 분배 값은 빌드 참고용이라 상세 목록에서는 생략)
const AP_ALLOCATION_PREFIX = "AP 배분";

// 모바일 "능력치" 탭 전용 - final_stat 전체를 상세 리스트로 노출
const CharacterDetailStats = ({basicInfo, statInfo}) => {
    if("error" in basicInfo || "error" in statInfo){
        return null;
    }

    const finalStat = statInfo?.final_stat || [];
    const statRows = finalStat.filter(stat => !stat?.stat_name?.startsWith(AP_ALLOCATION_PREFIX));
    const expRate = Number(basicInfo?.character_exp_rate) || 0;

    return (
        <div className="mobile-detail-stats-card">
            <h2 className="side-card-title">상세 능력치</h2>
            <ul className="mobile-detail-stats-list">
                <li className="mobile-detail-stats-row">
                    <span className="mobile-detail-stats-label">EXP</span>
                    <span className="mobile-detail-stats-value">{expRate + "%"}</span>
                </li>
                {statRows.map((stat, index) => (
                    <li key={"detail-stat-" + index} className="mobile-detail-stats-row">
                        <span className="mobile-detail-stats-label">{stat?.stat_name}</span>
                        <span className="mobile-detail-stats-value">{stat?.stat_value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharacterDetailStats;