import StarForce from "./StarForce";
import EquipmentItemOption from "./EquipmentItemOption";
import {getRandomString, maxStarForce} from "../../utils/utilis";

const EquipmentItemView = (selectItem) => {
    if(selectItem?.data && Object.keys(selectItem.data).length !== 0){
        let maxForce = 0;
        let currentForce = 0;
        if(!(selectItem?.data?.android_nickname)){
            maxForce = maxStarForce(selectItem?.data?.item_name, selectItem?.data?.item_base_option?.base_equipment_level);
            currentForce = selectItem?.data?.starforce * 1;
        }

        return (
            <div key={getRandomString(10)} className={"equipment-view-box"}>
                {maxForce > 0 && currentForce > 0 ? StarForce(currentForce, maxForce) : ''}
                {EquipmentItemOption(selectItem.data)}
            </div>
        );
    }else{
        return (
            <div key={getRandomString(10)} className={"equipment-view-box"}>
                <div className={"equipment-select-alert"}>
                    <p>선택된 장비 아이템이 없습니다.</p>
                    <p>장비 아이템을 선택해주세요.</p>
                </div>
            </div>
        );
    }
}

export default EquipmentItemView;