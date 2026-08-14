import React from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";

const SetEffect = ({data}) => {
    if("error" in data){
        return (
            <div className="set-effect-card">
                <div className="side-card-header">
                    <h2 className="side-card-title">세트 효과</h2>
                </div>
                <p className="api-error-img"></p>
                <p className="api-error">{ERROR_MESSAGE[data.error.name]}</p>
            </div>
        );
    }

    // 세트 효과 내림차순 정렬 (원본 배열은 변경하지 않음)
    const setEffectList = [...(data.set_effect || [])].sort((a, b) => b?.total_set_count - a?.total_set_count);

    return (
        <div className="set-effect-card">
            <div className="side-card-header">
                <h2 className="side-card-title">세트 효과</h2>
                <span className="side-card-count">{setEffectList.length}개 적용</span>
            </div>

            {setEffectList.length === 0 ? (
                <p className="side-card-empty">적용된 세트 효과가 없습니다.</p>
            ) : (
                <ul className="set-effect-list">
                    {setEffectList.map((item, index) => {
                        // 전체 옵션(set_effect_full_info)을 우선 사용, 없으면 현재 적용된 옵션만
                        const effectInfo = [...(item?.set_effect_full_info || item?.set_effect_info || [])]
                            .sort((a, b) => a?.set_count - b?.set_count);

                        return (
                            <li key={"set-effect-" + index} className="set-effect-row">
                                <span className="set-effect-count-badge">{item?.total_set_count}셋</span>
                                <span className="set-effect-name">{item?.set_name}</span>

                                {effectInfo.length > 0 && (
                                    <div className="set-effect-tooltip">
                                        <p className="set-effect-tooltip-title">{item?.set_name}</p>
                                        <ul className="set-effect-tooltip-list">
                                            {effectInfo.map((effect, effectIndex) => {
                                                const isActive = (effect?.set_count || 0) <= (item?.total_set_count || 0);

                                                return (
                                                    <li
                                                        key={"set-effect-tooltip-" + index + "-" + effectIndex}
                                                        className={"set-effect-tooltip-row" + (isActive ? " is-active" : " is-inactive")}
                                                    >
                                                        <span className="set-effect-tooltip-count">{effect?.set_count}세트</span>
                                                        <span className="set-effect-tooltip-option">{effect?.set_option}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default SetEffect;