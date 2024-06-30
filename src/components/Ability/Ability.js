import React from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";

const Ability = (data, number) => {
    if("error" in data){
        return (
            <div>
                <div className={"ability-title-area"}>
                    <h2>어빌리티</h2>
                </div>
                <div className="ability-section">
                    <p className="api-error-img"></p>
                    <p className="api-error">{ERROR_MESSAGE[data.error.name]}</p>
                </div>
            </div>
        );
    }else{
        let abilityPresetArray = [];
        abilityPresetArray.push(data.ability_preset_1);
        abilityPresetArray.push(data.ability_preset_2);
        abilityPresetArray.push(data.ability_preset_3);

        let abilityHtml = [];
        let abilityNumber = 1;

        // 어빌리티 등급에 따라서 클래스 반환
        function abilityRanked(data) {
            let rank = "";

            switch (data){
                case "레전드리":
                    rank = "ability-item-leg";
                    break;
                case "유니크":
                    rank = "ability-item-uniq";
                    break;
                case "에픽":
                    rank = "ability-item-epic";
                    break;
                case "레어":
                    rank = "ability-item-rare";
                    break;
                default:
                    rank = "레어";
            }

            return rank;
        }

        // 어빌리티 Html 생성
        abilityPresetArray.forEach(item => {
            let presetItemNumber = 0;
            let abilities = item?.ability_info.map(presetItem => {
                let abilityRank = abilityRanked(presetItem?.ability_grade);
                presetItemNumber++;
                return <p key={"ability_preset" + abilityNumber + "_item_" +  presetItemNumber} className={`ability-item ${abilityRank}`}>{presetItem?.ability_value}</p>;
            });

            let presetDisplay = "display-none";
            if(data?.preset_no.toString() === abilityNumber.toString()){
                presetDisplay = "";
            }

            abilityHtml.push(
                <div key={`ability_item_${abilityNumber}`} className={`ability_item ability_${abilityNumber} ${presetDisplay}`}>
                    {abilities}
                </div>
            );

            abilityNumber++;
        });

        function handleAbilityPresetChange(e) {
            let parent = e.target.parentNode;
            let preset = document.getElementsByClassName("ability_item");

            // 프리셋 선택 시 선택된 프리셋 조작
            parent.childNodes.forEach(child => {
                if (child.nodeType === 1) {
                    child.classList.remove("ability-preset-checked");

                    if(e.target.text === child.text){
                        child.classList.add("ability-preset-checked");
                    }
                }
            });

            for(let presetItem of preset){
                if(presetItem.classList.contains("ability_" + e.target.text)){
                    presetItem.classList.remove("display-none");
                }else{
                    presetItem.classList.add("display-none");
                }
            }
        }

        return (
            <div>
                <div className={"ability-title-area"}>
                    <h2>어빌리티</h2>
                    <div style={{marginLeft:"auto"}}>
                        <a className={data?.preset_no === 1 ? "ability-preset-checked" : ""} onClick={handleAbilityPresetChange}>1</a>
                        <a className={data?.preset_no === 2 ? "ability-preset-checked" : ""} onClick={handleAbilityPresetChange}>2</a>
                        <a className={data?.preset_no === 3 ? "ability-preset-checked" : ""} onClick={handleAbilityPresetChange}>3</a>
                    </div>
                </div>
                <div className="ability-section">
                    {abilityHtml}
                </div>
            </div>
        );
    }
}
export default Ability;