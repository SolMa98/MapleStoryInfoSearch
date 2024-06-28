import React from "react";

const equipmentItem = (data) => {
    console.log(data);
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
    if(data.equipment?.item_equipment_preset_1 && data.equipment?.item_equipment_preset_2 && data.equipment?.item_equipment_preset_3){
        equipmentPresetArray.push(data.equipment?.item_equipment_preset_1);
        equipmentPresetArray.push(data.equipment?.item_equipment_preset_2);
        equipmentPresetArray.push(data.equipment?.item_equipment_preset_3);
    }

    equipmentPresetArray.forEach(preset => {
        let itemListHtml = [];
        for(let viewArray of equipViewData) {
            let itemHtml = [];
            for (let viewItem of viewArray) {
                let checkedItem = false;
                for(let equipItem of preset){
                   if(viewItem === "안드로이드"){
                       checkedItem = true;
                       itemHtml.push(<li className="equipment-item">
                                        <img src={data.android.android_icon} alt={data.android.android_name} />
                                     </li>);
                       break;
                   }
                   if(viewItem === equipItem?.item_equipment_slot){
                       checkedItem = true;
                       itemHtml.push(<li className="equipment-item">
                                        <img src={equipItem.item_shape_icon} alt={equipItem.item_equipment_part} />
                                     </li>);
                       break;
                   }
                }
                if(!checkedItem){
                    itemHtml.push(<li className="equipment-item visible-hidden">
                                     <img src="" alt="빈칸" />
                                  </li>);
                }
            }
            itemListHtml.push(
                <ul className="equipment-list">
                    {itemHtml}
                </ul>
            )
        }
        equipmentHtml.push(
            <div>
                {itemListHtml}
            </div>
        )
    });

    return (
        <div>
            {equipmentHtml}
        </div>
    );
}

export default equipmentItem;