import React from "react";

const setEffect = (data) => {
    // 세트 효과 내림차순 정렬
    let setEffectItemArray = data.set_effect.sort((a, b) => b?.total_set_count - a?.total_set_count)

    return (
        <ul>
            {setEffectItemArray.map((item, index) => (
                <li key={index}>{`${item?.set_name} ${item?.total_set_count}세트`}</li>
            ))}
        </ul>
    );
}

export default setEffect;