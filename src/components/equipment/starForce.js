import starFull from "../../assets/image/common/star.png";
import starEmpty from "../../assets/image/common/star-empty.png";
import React from "react";
import {getRandomString} from "../../utils/utilis";

// starforce가 존재하는 장비일 경우 화면에 별 출력
const starForce = (force, maxForce) => {
    let starForce = [];
    let starForceInner = [];
    for(let i = 1; i <= maxForce ; i++){
        let starBlankSpace = "";
        if(i % 5 === 0){
            starBlankSpace = "2";
        }

        if(i <= force){
            starForceInner.push(
                <img key={"star" + getRandomString(10)} src={starFull} style={starBlankSpace !== "" ? { marginRight: starBlankSpace + "%" } : {}} />
            )
        }else{
            starForceInner.push(
                <img key={"star" + getRandomString(10)} src={starEmpty} style={starBlankSpace !== "" ? { marginRight: starBlankSpace + "%" } : {}} />
            )
        }

        if(i >= 15 && i % 15 === 0){
            starForce.push(
                <div key={"star" + getRandomString(10)}>
                    {starForceInner}
                </div>
            );
            starForceInner = [];
        }
    }

    starForce.push(
        <div key={"star" + getRandomString(10)}>
            {starForceInner}
        </div>
    );

    return starForce;
}

export default starForce;