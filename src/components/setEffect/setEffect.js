import React from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";

const setEffect = (data) => {
    if("error" in data){
        return (
            <ul className="set-effect-list">
                <p className="api-error-img"></p>
                <p className="api-error">{ERROR_MESSAGE[data.error.name]}</p>
            </ul>
        );
    }else{
        // 세트 효과 내림차순 정렬
        let setEffectItemArray = data.set_effect.sort((a, b) => b?.total_set_count - a?.total_set_count)

        return (
            <ul className="set-effect-list">
                {setEffectItemArray.map((item, index) => (
                    <li key={index}>{`${item?.set_name} ${item?.total_set_count}세트`}</li>
                ))}
            </ul>
        );
    }
}

export default setEffect;