import React from "react";
import starForce from "./starForce";
import equipmentItemOption from "./equipmentItemOption";
import {getRandomString} from "../../utils/utilis";

const equipmentItemView = () => {

    return (
        <div key={getRandomString(10)} className={"equipment-view-box"}>
            {starForce(22, 25)}
            {equipmentItemOption()}
        </div>
    );
}

export default equipmentItemView;