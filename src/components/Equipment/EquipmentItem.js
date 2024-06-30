import {ERROR_MESSAGE} from "../../constants/errorConstants";
import { applyTransparency, getRandomString } from "../../utils/utilis";
import EquipmentItemView from "./EquipmentItemView";
import {useState} from "react";

const EquipmentItem = (equipmentInfo, androidInfo) => {
    let equipItemInfo = {};
    const [equipSelectItem, setEquipSelectItem] = useState({
        key : "",
        data : {}
    });
    if("error" in equipmentInfo || "error" in androidInfo){
        let errorType = "error" in equipmentInfo ? equipmentInfo.error.name : androidInfo.error.name;

        return (
            <div className="character-equipment">
                <h2>장비</h2>
                <div>
                    <p className="api-error-img"></p>
                    <p className="api-error">{ERROR_MESSAGE[errorType]}</p>
                </div>
            </div>
        );
    }else{
        // 장비 순서
        let equipViewData = [
            ["반지4", "", "모자", "", "엠블렘"],
            ["반지3", "펜던트2", "얼굴장식", "", "뱃지"],
            ["반지2", "펜던트", "눈장식", "귀고리", "훈장"],
            ["반지1", "무기", "상의", "어깨장식", "보조무기"],
            ["포켓 아이템", "벨트", "하의", "장갑", "망토"],
            ["타이틀", "", "신발", "안드로이드", "기계 심장"]
        ];

        let equipmentHtml = [];
        let equipmentPresetArray = [];

        // Preset 데이터 반복문을 돌리기 위해서 Array에 저장
        if(equipmentInfo?.item_equipment_preset_1 && equipmentInfo?.item_equipment_preset_2 && equipmentInfo?.item_equipment_preset_3){
            equipmentPresetArray.push(equipmentInfo?.item_equipment_preset_1);
            equipmentPresetArray.push(equipmentInfo?.item_equipment_preset_2);
            equipmentPresetArray.push(equipmentInfo?.item_equipment_preset_3);
        }

        // 프리셋을 장비 순서에 따라 화면에 출력
        let presetNumber = 1;
        equipmentPresetArray.forEach(preset => {
            let itemListHtml = [];
            for(let viewArray of equipViewData) {
                let itemHtml = [];
                for (let viewItem of viewArray) {
                    let checkedItem = false;
                    for(let equipItem of preset){
                        let randomKey = getRandomString(10);

                        if(viewItem === "안드로이드"){
                            checkedItem = true;
                            itemHtml.push(<li key={"equip-item-" + randomKey} className="equipment-item" data-key={randomKey} onMouseMove={handleMouseMove}>
                                              <img src={androidInfo.android_icon} alt={androidInfo.android_name} />
                                          </li>);

                            equipItemInfo[randomKey] = androidInfo;
                            break;
                        }
                        if(viewItem === equipItem?.item_equipment_slot){
                            checkedItem = true;

                            let itemBorder = "";
                            switch (equipItem.potential_option_grade){
                                case "레전드리":
                                    itemBorder = "#A4C700";
                                    break;
                                case "유니크":
                                    itemBorder = "#E89C09";
                                    break;
                                case "에픽":
                                    itemBorder = "#7F66D3";
                                    break;
                                case "레어":
                                    itemBorder = "#36B8D0";
                                    break;
                                default:
                                    itemBorder = "#FFFFFF";
                            }
                            itemHtml.push(<li key={"equip-item-" + randomKey} className="equipment-item" data-key={randomKey} onMouseMove={handleMouseMove}
                                              style={{border: "1px solid " + itemBorder, backgroundColor: applyTransparency(itemBorder, 0.2)}}>
                                            <img src={equipItem.item_shape_icon} alt={equipItem.item_equipment_part} />
                                          </li>);

                            equipItemInfo[randomKey] = equipItem;
                            break;
                        }
                    }
                    if(!checkedItem){
                        itemHtml.push(<li key={"equip-item-" + getRandomString(10)} className="equipment-item visible-hidden">
                                          <img src="" alt="빈칸" />
                                      </li>);
                    }
                }
                itemListHtml.push(
                    <ul key={"equip-list-" + getRandomString(10)} className="equipment-list">
                        {itemHtml}
                    </ul>
                )
            }
            equipmentHtml.push(
                <div key={"equip-preset-" + getRandomString(10)}
                     className={!(equipmentInfo.preset_no === presetNumber) ? 'equipment-preset display-none' : 'equipment-preset'}
                     data-key={presetNumber}>
                    {itemListHtml}
                </div>
            )

            presetNumber++;
        });

        // Preset 전환
        function handleEquipmentPreset(e){
            // 장비 preset을 이미 선택된 preset을 눌렀을 경우에는 동작 X
            if(!e.target.classList.contains("equipment-title-checked")){
                let parent = e.target.parentNode;
                let selectPresetNum = e.target.dataset.key;
                let equipmentPreset = document.getElementsByClassName("equipment-preset");

                parent.childNodes.forEach(child => {
                    if(child.dataset.key === selectPresetNum){
                        child.classList.add("equipment-title-checked");
                    }else{
                        child.classList.remove("equipment-title-checked");
                    }
                });

                for(let equipPreset of equipmentPreset){
                    if(equipPreset.dataset.key === selectPresetNum){
                        equipPreset.classList.remove("display-none");
                    }else{
                        equipPreset.classList.add("display-none");
                    }
                }
            }
        }

        // 마우스를 아이템 위에 올려놓은 경우
        function handleMouseMove(e) {
            let equipParent = e.target.closest(".equipment-preset");
            if(!equipParent.classList.contains("display-none")){
                let selectItem = null;
                if (e.target.classList.contains('equipment-item')) {
                    selectItem = e.target;
                }
                if (!selectItem) {
                    let parent = e.target.parentElement;
                    while (parent) {
                        if (parent.classList.contains('equipment-item')) {
                            selectItem = parent;
                            break;
                        }
                        parent = parent.parentElement;
                    }
                }

                if (selectItem) {
                    if(JSON.stringify(equipSelectItem.data) !== JSON.stringify(equipItemInfo[selectItem.getAttribute('data-key')])){
                        let tempSelectItem = {
                            key : selectItem.getAttribute('data-key'),
                            data : equipItemInfo[selectItem.getAttribute('data-key')]
                        }
                        setEquipSelectItem(tempSelectItem);
                    }
                }
            }
        }

        return (
            <div className="character-equipment">
                <div className={"equipment-title"}>
                    <h2>장비</h2>
                    <div>
                        <a className={equipmentInfo.preset_no === 1 ? 'equipment-title-checked' : ''} data-key="1"
                           onClick={handleEquipmentPreset}>프리셋 1</a>
                        <a className={equipmentInfo.preset_no === 2 ? 'equipment-title-checked' : ''} data-key="2"
                           onClick={handleEquipmentPreset}>프리셋 2</a>
                        <a className={equipmentInfo.preset_no === 3 ? 'equipment-title-checked' : ''} data-key="3"
                           onClick={handleEquipmentPreset}>프리셋 3</a>
                    </div>
                </div>
                <div className={"equipment-item-area"}>
                    <div>
                        {equipmentHtml}
                    </div>
                    <div>
                        {EquipmentItemView(equipSelectItem)}
                    </div>
                </div>
            </div>
        );
    }
}

export default EquipmentItem;