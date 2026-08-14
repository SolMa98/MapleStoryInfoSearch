import starFull from "../../assets/image/common/star.png";
import starEmpty from "../../assets/image/common/star-empty.png";
import React from "react";
import {getRandomString} from "../../utils/utilis";

// starforce가 존재하는 장비일 경우 화면에 별 출력 (15개마다 줄바꿈, 5번째마다 여백)
const StarForce = ({force, maxForce}) => {
    const rows = [];
    let currentRow = [];

    for(let i = 1; i <= maxForce; i++){
        currentRow.push(
            <img
                key={"star-" + i}
                src={i <= force ? starFull : starEmpty}
                alt=""
                className={"equipment-star" + (i % 5 === 0 ? " equipment-star-gap" : "")}
            />
        );

        if(i % 15 === 0){
            rows.push(currentRow);
            currentRow = [];
        }
    }
    if(currentRow.length > 0){
        rows.push(currentRow);
    }

    return (
        <div className="equipment-star-rows">
            {rows.map(row => (
                <div key={"star-row-" + getRandomString(6)} className="equipment-star-row">
                    {row}
                </div>
            ))}
        </div>
    );
}

export default StarForce;