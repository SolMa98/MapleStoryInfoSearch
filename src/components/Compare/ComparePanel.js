import {useState} from "react";
import apiCall from "../../utils/apiUtils";
import {findStat, formatNumber, getMainStat, sumStarforce} from "../../utils/utilis";
import {isValidCharacterName} from "../../utils/validationUtils";

// 비교용 지표 묶음 생성
const buildMetrics = (name, level, finalStat, equipmentItems) => {
    const combatPowerStat = findStat(finalStat, "전투력");
    const mainStat = getMainStat(finalStat);

    return {
        name,
        level: Number(level) || 0,
        combatPower: Number(combatPowerStat?.stat_value) || 0,
        mainStatName: mainStat.stat_name,
        mainStatValue: Number(mainStat.stat_value) || 0,
        starforce: sumStarforce(equipmentItems)
    };
};

// 장비 정보에서 현재 프리셋의 아이템 배열 추출
const extractEquipmentItems = (equipmentInfo) => {
    const presetNumber = equipmentInfo?.preset_no || 1;
    return equipmentInfo?.[`item_equipment_preset_${presetNumber}`] || [];
};

const ComparePanel = ({open, onClose, myBasicInfo, myStatInfo, myEquipmentInfo}) => {
    const [rivalQuery, setRivalQuery] = useState("");
    const [rivalError, setRivalError] = useState("");
    const [rivalLoading, setRivalLoading] = useState(false);
    const [rival, setRival] = useState(null);

    if(!open){
        return null;
    }

    const hasMyData = myBasicInfo?.character_name && !("error" in myBasicInfo);
    const me = hasMyData
        ? buildMetrics(myBasicInfo.character_name, myBasicInfo.character_level, myStatInfo?.final_stat || [], extractEquipmentItems(myEquipmentInfo))
        : null;

    // 비교 대상 캐릭터 조회
    const searchRival = async () => {
        const trimmedName = rivalQuery.trim();

        if(!isValidCharacterName(trimmedName)){
            setRivalError("닉네임을 제대로 입력했는지 확인해주세요.");
            return;
        }

        setRivalLoading(true);
        setRivalError("");

        const idRes = await apiCall("ID", { character_name: trimmedName });
        if(!idRes?.ocid){
            setRivalError("캐릭터를 찾을 수 없습니다.");
            setRivalLoading(false);
            return;
        }

        const params = { ocid: idRes.ocid };
        const [basicRes, statRes, equipmentRes] = await Promise.all([
            apiCall("CHARACTER_BASIC", params),
            apiCall("CHARACTER_STAT", params),
            apiCall("CHARACTER_ITEM_EQUIPMENT", params)
        ]);

        if("error" in basicRes || "error" in statRes){
            setRivalError("캐릭터 정보를 불러오지 못했습니다.");
            setRivalLoading(false);
            return;
        }

        setRival(buildMetrics(basicRes.character_name, basicRes.character_level, statRes?.final_stat || [], extractEquipmentItems(equipmentRes)));
        setRivalLoading(false);
    };

    const handleRivalKeyDown = (e) => {
        if(e.keyCode === 13){
            searchRival();
        }
    };

    const handleReset = () => {
        setRival(null);
        setRivalQuery("");
        setRivalError("");
    };

    const compareRows = (me && rival) ? [
        { label: "전투력", left: me.combatPower, right: rival.combatPower },
        { label: "레벨", left: me.level, right: rival.level },
        { label: me.mainStatName === rival.mainStatName ? me.mainStatName : "주스탯", left: me.mainStatValue, right: rival.mainStatValue },
        { label: "스타포스", left: me.starforce, right: rival.starforce }
    ] : [];

    return (
        <div className="compare-panel">
            <div className="compare-panel-header">
                <h2 className="compare-panel-title">캐릭터 비교</h2>
                <button className="compare-panel-close" onClick={onClose}>닫기</button>
            </div>

            {!me && (
                <p className="compare-error">캐릭터 정보를 불러온 뒤 비교할 수 있습니다.</p>
            )}

            {me && !rival && (
                <div className="compare-search-row">
                    <input
                        type="text"
                        className="compare-search-input"
                        placeholder="비교할 캐릭터 닉네임을 입력하세요"
                        value={rivalQuery}
                        onChange={(e) => setRivalQuery(e.target.value)}
                        onKeyDown={handleRivalKeyDown}
                    />
                    <button className="compare-search-btn" onClick={searchRival} disabled={rivalLoading}>
                        {rivalLoading ? "조회 중..." : "비교하기"}
                    </button>
                </div>
            )}

            {rivalError && <p className="compare-error">{rivalError}</p>}

            {me && rival && (
                <>
                    <div className="compare-header-row">
                        <div className="compare-side compare-side-left">
                            <div className="compare-side-info">
                                <div className="compare-side-name">{me.name}</div>
                                <div className="compare-side-sub">{"Lv." + me.level}</div>
                            </div>
                        </div>
                        <div className="compare-vs">VS</div>
                        <div className="compare-side compare-side-right">
                            <div className="compare-side-info">
                                <div className="compare-side-name">{rival.name}</div>
                                <div className="compare-side-sub">{"Lv." + rival.level}</div>
                            </div>
                        </div>
                    </div>

                    <div className="compare-rows">
                        {compareRows.map(row => {
                            const maxValue = Math.max(row.left, row.right, 1);
                            const leftPercent = (row.left / maxValue) * 100;
                            const rightPercent = (row.right / maxValue) * 100;

                            return (
                                <div key={"compare-row-" + row.label} className="compare-row">
                                    <div className="compare-row-left">
                                        <span className="compare-row-value">{formatNumber(row.left)}</span>
                                        <div className="compare-row-bar-track compare-row-bar-track-left">
                                            <div className="compare-row-bar compare-row-bar-left" style={{width: leftPercent + "%"}} />
                                        </div>
                                    </div>
                                    <div className="compare-row-label">{row.label}</div>
                                    <div className="compare-row-right">
                                        <div className="compare-row-bar-track">
                                            <div className="compare-row-bar compare-row-bar-right" style={{width: rightPercent + "%"}} />
                                        </div>
                                        <span className="compare-row-value">{formatNumber(row.right)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className="compare-reset-btn" onClick={handleReset}>다른 캐릭터와 비교</button>
                </>
            )}
        </div>
    );
};

export default ComparePanel;