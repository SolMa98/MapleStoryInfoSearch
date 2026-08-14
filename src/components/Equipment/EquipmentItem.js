import {useEffect, useState} from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";
import {GRADE_COLOR} from "../../constants/itemConstants";
import {applyTransparency} from "../../utils/utilis";
import EquipmentItemView from "./EquipmentItemView";

// 장비 슬롯 배치 (기존 equipViewData 배열과 동일한 순서)
const EQUIP_SLOT_LAYOUT = [
    ["반지4", "", "모자", "", "엠블렘"],
    ["반지3", "펜던트2", "얼굴장식", "", "뱃지"],
    ["반지2", "펜던트", "눈장식", "귀고리", "훈장"],
    ["반지1", "무기", "상의", "어깨장식", "보조무기"],
    ["포켓 아이템", "벨트", "하의", "장갑", "망토"],
    ["타이틀", "", "신발", "안드로이드", "기계 심장"]
];

const EquipmentItem = ({equipmentInfo, androidInfo}) => {
    const [equipPreset, setEquipPreset] = useState(equipmentInfo?.preset_no || 1);
    const [selectedSlot, setSelectedSlot] = useState({ slot: "", data: {} });

    // API 응답으로 preset_no가 갱신되면 기본 선택 프리셋도 동기화
    useEffect(() => {
        if(equipmentInfo?.preset_no){
            setEquipPreset(equipmentInfo.preset_no);
        }
    }, [equipmentInfo?.preset_no]);

    if("error" in equipmentInfo || "error" in androidInfo){
        let errorType = "error" in equipmentInfo ? equipmentInfo.error.name : androidInfo.error.name;

        return (
            <div className="equipment-card">
                <div className="equipment-card-header">
                    <h2 className="equipment-card-title">장비</h2>
                </div>
                <p className="api-error-img"></p>
                <p className="api-error">{ERROR_MESSAGE[errorType]}</p>
            </div>
        );
    }

    const equipmentPresets = [
        equipmentInfo?.item_equipment_preset_1,
        equipmentInfo?.item_equipment_preset_2,
        equipmentInfo?.item_equipment_preset_3
    ];
    const currentPreset = equipmentPresets[equipPreset - 1] || [];

    // 슬롯명으로 착용 중인 아이템(또는 안드로이드) 조회
    const findEquippedItem = (slotName) => {
        if(slotName === "안드로이드"){
            return androidInfo?.android_name ? androidInfo : null;
        }
        return currentPreset.find(item => item?.item_equipment_slot === slotName) || null;
    };

    const handlePresetChange = (presetNumber) => {
        setEquipPreset(presetNumber);
        setSelectedSlot({ slot: "", data: {} });
    };

    return (
        <div className="equipment-card">
            <div className="equipment-card-header">
                <h2 className="equipment-card-title">장비</h2>
                <span className="equipment-card-hint">아이템에 마우스를 올리면 상세 정보가 표시됩니다</span>
                <div className="equipment-preset-segment">
                    {[1, 2, 3].map(presetNumber => (
                        <button
                            key={"equip-preset-" + presetNumber}
                            className={"equipment-preset-btn" + (equipPreset === presetNumber ? " is-active" : "")}
                            onClick={() => handlePresetChange(presetNumber)}
                        >
                            프리셋 {presetNumber}
                        </button>
                    ))}
                </div>
            </div>

            <div className="equipment-card-body">
                <div className="equipment-grid">
                    {EQUIP_SLOT_LAYOUT.map((row, rowIndex) => row.map((slotName, colIndex) => {
                        const emptyKey = `equip-empty-${rowIndex}-${colIndex}`;

                        if(!slotName){
                            return <div key={emptyKey} className="equipment-slot visible-hidden" />;
                        }

                        const item = findEquippedItem(slotName);
                        if(!item){
                            return <div key={emptyKey} className="equipment-slot visible-hidden" />;
                        }

                        const gradeColor = GRADE_COLOR[item.potential_option_grade] || "#D1D5DB";
                        const isSelected = selectedSlot.slot === slotName;
                        const iconSrc = slotName === "안드로이드" ? item.android_icon : item.item_shape_icon;
                        const iconAlt = slotName === "안드로이드" ? item.android_name : item.item_equipment_part;

                        return (
                            <div
                                key={"equip-slot-" + slotName}
                                className={"equipment-slot" + (isSelected ? " is-selected" : "")}
                                style={{
                                    borderColor: isSelected ? "#12151A" : gradeColor,
                                    backgroundColor: applyTransparency(gradeColor, 0.12)
                                }}
                                onMouseEnter={() => setSelectedSlot({ slot: slotName, data: item })}
                                onClick={() => setSelectedSlot({ slot: slotName, data: item })}
                            >
                                <img src={iconSrc} alt={iconAlt} />
                                <span className="equipment-slot-label">{slotName}</span>
                            </div>
                        );
                    }))}
                </div>

                <EquipmentItemView selectItem={selectedSlot} />
            </div>
        </div>
    );
}

export default EquipmentItem;