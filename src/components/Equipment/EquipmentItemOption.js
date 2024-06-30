import legIcon from "../../assets/image/common/legendary_icon.png";
import uniqIcon from "../../assets/image/common/unique_icon.png";
import epicIcon from "../../assets/image/common/epic_icon.png";
import rareIcon from "../../assets/image/common/rare_icon.png";
import {ITEM_OPTION} from "../../constants/itemConstants";
import {getRandomString} from "../../utils/utilis";

const EquipmentItemOption = (itemData) => {
    const potentialGrade = {
        "" : 0,
        "레어" : 1,
        "에픽" : 2,
        "유니크" : 3,
        "레전드리" : 4
    }
    // 아이템 등급
    let itemPotential = "";
    // 아이템 이름
    let itemViewName = "";
    // 아이템 옵션
    let itemOptionHtml = [];
    // 아이템 잠재 옵션
    let potentialOptionHtml = [];
    // 아이템 에디셔널 잠재 옵션
    let additionalPotentialOptionHtml = [];

    const compareGrades = (grade1, grade2) => {
        return potentialGrade[grade1] - potentialGrade[grade2];
    }

    // 아이템 등급 설정
    let itemPotentialGrade = compareGrades(itemData.potential_option_grade, itemData.additional_potential_option_grade)
    if(itemPotentialGrade >= 0){
        itemPotential = itemData.potential_option_grade;
    }else if(itemPotentialGrade < 0){
        itemPotential = itemData.additional_potential_option_grade;
    }

    // 아이템 이름 및 아이템 옵션 설정
    if(itemData?.android_name){
        itemViewName = itemData.android_name;
    }else{
        // 아이템 이름 설정
        if(itemData?.scroll_upgrade && itemData?.scroll_upgrade > 0){
            itemViewName = itemData.item_name + " (+" + itemData.scroll_upgrade + ")";
        }else{
            itemViewName = itemData.item_name;
        }

        // 아이템 옵션 설정
        let optionLineHtml = [];
        for (let optionKey in ITEM_OPTION) {
            if((itemData?.item_total_option[optionKey] * 1) !== 0){
                if(itemData?.item_total_option[optionKey] === itemData?.item_base_option[optionKey]){
                    optionLineHtml.push(
                        <p key={getRandomString(10)}>
                            <span className={"default-option"}>{ITEM_OPTION[optionKey] + " : +" + itemData?.item_base_option[optionKey]}</span>
                        </p>
                    )
                }else{
                    const totalOptionValue = itemData?.item_total_option[optionKey];
                    const baseOptionValue = itemData?.item_base_option[optionKey];
                    const addOptionValue = itemData?.item_add_option[optionKey];
                    const etcOptionValue = itemData?.item_etc_option[optionKey];
                    const starForceOptionValue = itemData?.item_starforce_option[optionKey];
                    let optionPercent = "";
                    if (['max_hp_rate', 'max_mp_rate', 'boss_damage', 'ignore_monster_armor', 'all_stat', 'damage'].includes(optionKey)) {
                        optionPercent = "%";
                    }

                    optionLineHtml.push(
                        <p key={getRandomString(10)}>
                            <span className={"synthesis-option"}>{ITEM_OPTION[optionKey] + " : +" + totalOptionValue + optionPercent}</span>
                            {(baseOptionValue !== undefined) && (
                                <span className={"default-option"}>{" (" + baseOptionValue + optionPercent}</span>
                            )}
                            {(addOptionValue !== undefined && addOptionValue * 1 !== 0) && (
                                <span className={"add-option"}>{" +" + addOptionValue + optionPercent}</span>
                            )}
                            {(etcOptionValue !== undefined && etcOptionValue * 1 !== 0) && (
                                <span className={"force-option"}>{" +" + etcOptionValue + optionPercent}</span>
                            )}
                            {(starForceOptionValue !== undefined && starForceOptionValue * 1 !== 0) && (
                                <span className={"star-force-option"}>{" +" + starForceOptionValue + optionPercent}</span>
                            )}
                            <span className={"default-option"}>{")"}</span>
                        </p>
                    );
                }
            }
        }

        // 업그레이드 가능 횟수
        if((itemData?.scroll_upgrade * 1) !== 0 || (itemData?.scroll_upgradeable_count * 1) !== 0
            || (itemData?.scroll_resilience_count * 1) !== 0){
            optionLineHtml.push(
                <p key={getRandomString(10)}>
                    <span className={"default-option"}>{"업그레이드 가능 횟수 : " +  itemData?.scroll_upgradeable_count}</span>
                    <span className={"star-force-option"}>{" (복구 가능 횟수 : " +  itemData?.scroll_resilience_count + ")"}</span>
                </p>
            );
        }

        // 가위 사용 가능 횟수
        if(((itemData?.cuttable_count * 1) !== 255)){
            optionLineHtml.push(
                <p key={getRandomString(10)}>
                    <span className={"star-force-option"}>{"가위 사용 가능 횟수 : " +  itemData?.cuttable_count + "회"}</span>
                </p>
            );
        }

        // 옵션 삽입
        itemOptionHtml.push(
            <div key={getRandomString(10)}>
                {optionLineHtml}
            </div>
        )

        // 아이템 잠재능력
        const generatePotentialOptionHtml = (itemData, optionIcons, optionType) => {
            let optionClass = "";
            let iconHtml = [];
            let optionLevel;
            let option1;
            let option2;
            let option3;

            if(optionType === "잠재옵션"){
                optionLevel = itemData.potential_option_grade;
                option1 = itemData.potential_option_1;
                option2 = itemData.potential_option_2;
                option3 = itemData.potential_option_3;
            }else{
                optionLevel = itemData.additional_potential_option_grade;
                option1 = itemData.additional_potential_option_1;
                option2 = itemData.additional_potential_option_2;
                option3 = itemData.additional_potential_option_3;
            }

            switch (potentialGrade[optionLevel]) {
                case 4:
                    optionClass = "leg-option";
                    iconHtml.push(<img src={legIcon} alt="레전드리 아이콘" />);
                    break;
                case 3:
                    optionClass = "uniq-option";
                    iconHtml.push(<img src={uniqIcon} alt="유니크 아이콘" />);
                    break;
                case 2:
                    optionClass = "epic-option";
                    iconHtml.push(<img src={epicIcon} alt="에픽 아이콘" />);
                    break;
                case 1:
                    optionClass = "rare-option";
                    iconHtml.push(<img src={rareIcon} alt="레어 아이콘" />);
                    break;
            }

            return (
                <div>
                    <hr className={"next-line"} />

                    <div className={"equipment-item-details"}>
                        <p className={optionClass}>
                            {iconHtml}
                            <span>{optionType}</span>
                        </p>
                        <p>{option1}</p>
                        <p>{option2}</p>
                        <p>{option3}</p>
                    </div>
                </div>
            );
        };

        // 잠재옵션
        if(potentialGrade[itemData?.potential_option_grade]){
            potentialOptionHtml.push(
                generatePotentialOptionHtml(itemData, [legIcon, uniqIcon, epicIcon, rareIcon], "잠재옵션")
            )
        }

        // 에디셔널 잠재옵션
        if(potentialGrade[itemData?.additional_potential_option_grade]){
            additionalPotentialOptionHtml.push(
                generatePotentialOptionHtml(itemData, [legIcon, uniqIcon, epicIcon, rareIcon], "에디셔널 잠재옵션")
            )
        }
    }

    return (
        <div>
            <div className={"equipment-item-title"}>
                <p>{itemViewName}</p>
                {itemPotential !== "" ? <p>({itemPotential + " 아이템"})</p> : ""}
            </div>
            <hr className={"next-line"} />
            <div className={"item-top"}>
                <div className={"item-img-space"}>
                    <img src={itemData?.android_icon ? itemData.android_icon : itemData.item_icon}
                         alt={itemData?.android_name ? itemData.android_name : itemData.item_name} />
                </div>
                <div className={"equipment-level"}>
                    <p>{itemData?.item_base_option?.base_equipment_level ?
                        "· REQ LEVEL : " + itemData?.item_base_option?.base_equipment_level :
                        "· REQ LEVEL : " + 0}</p>
                    <div>
                        <div className={"equipment-level-limit"}>
                            <p>· REQ STR : 000</p>
                            <p>· REQ LUK : 000</p>
                        </div>
                        <div className={"equipment-level-limit"}>
                            <p>· REQ DEX : 000</p>
                            <p>· REQ INT : 000</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"equipment-job"}>
                <p>초보자</p>
                <p>전사</p>
                <p>마법사</p>
                <p>궁수</p>
                <p>도적</p>
                <p>해적</p>
            </div>

            <hr className={"next-line"} />

            <div className={"equipment-item-details"}>
                <p>{itemData?.android_nickname ? "장비 분류: " + itemData.android_nickname:
                    "장비 분류: " + itemData.item_equipment_part}</p>
                {itemOptionHtml}
            </div>
            {potentialOptionHtml}
            {additionalPotentialOptionHtml}
        </div>
    )
}

export default EquipmentItemOption;