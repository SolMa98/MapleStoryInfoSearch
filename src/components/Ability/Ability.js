import React, {useEffect, useState} from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";
import {GRADE_COLOR} from "../../constants/itemConstants";

const Ability = ({data}) => {
    const [abilityPreset, setAbilityPreset] = useState(data?.preset_no || 1);

    // API 응답으로 preset_no가 갱신되면 기본 선택 프리셋도 동기화
    useEffect(() => {
        if(data?.preset_no){
            setAbilityPreset(data.preset_no);
        }
    }, [data?.preset_no]);

    if("error" in data){
        return (
            <div className="ability-card">
                <div className="side-card-header">
                    <h2 className="side-card-title">어빌리티</h2>
                </div>
                <p className="api-error-img"></p>
                <p className="api-error">{ERROR_MESSAGE[data.error.name]}</p>
            </div>
        );
    }

    const abilityPresets = [data.ability_preset_1, data.ability_preset_2, data.ability_preset_3];
    const currentAbilities = abilityPresets[abilityPreset - 1]?.ability_info || [];

    return (
        <div className="ability-card">
            <div className="side-card-header">
                <h2 className="side-card-title">어빌리티</h2>
                <div className="side-preset-segment">
                    {[1, 2, 3].map(presetNumber => (
                        <button
                            key={"ability-preset-" + presetNumber}
                            className={"side-preset-btn" + (abilityPreset === presetNumber ? " is-active" : "")}
                            onClick={() => setAbilityPreset(presetNumber)}
                        >
                            {presetNumber}
                        </button>
                    ))}
                </div>
            </div>

            {currentAbilities.length === 0 ? (
                <p className="side-card-empty">등록된 어빌리티가 없습니다.</p>
            ) : (
                <ul className="ability-list">
                    {currentAbilities.map((ability, index) => {
                        const gradeColor = GRADE_COLOR[ability?.ability_grade] || "#36B8D0";
                        return (
                            <li key={"ability-item-" + index} className="ability-row">
                                <span className="ability-grade-bar" style={{backgroundColor: gradeColor}} />
                                <span className="ability-text">{ability?.ability_value}</span>
                                <span className="ability-grade-label" style={{color: gradeColor}}>{ability?.ability_grade}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Ability;