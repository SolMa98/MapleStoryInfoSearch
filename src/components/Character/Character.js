import React from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";
import defaultAvatarImg from "../../assets/image/common/maplestory-default-avatar.png";
import acainIcon from "../../assets/image/common/acain.png";
import beraIcon from "../../assets/image/common/bera.png";
import croaIcon from "../../assets/image/common/croa.png";
import elysiumIcon from "../../assets/image/common/elysium.png";
import enosisIcon from "../../assets/image/common/enosis.png";
import novaIcon from "../../assets/image/common/nova.png";
import ororaIcon from "../../assets/image/common/orora.png";
import rebootIcon from "../../assets/image/common/reboot.gif";
import redIcon from "../../assets/image/common/red.png";
import runaIcon from "../../assets/image/common/runa.png";
import scaniaIcon from "../../assets/image/common/scania.png";
import unionIcon from "../../assets/image/common/union.png";
import zenisIcon from "../../assets/image/common/zenis.png";
import errorIcon from "../../assets/image/common/maplestory-char-img.jpg";

const Character = (basicInfo, statInfo) => {
    if("error" in basicInfo || "error" in statInfo){
        let errorType = "error" in basicInfo ? basicInfo.error.name : statInfo.error.name;

        return (
            <div className="character-header">
                <div className="character-avatar">
                    <img src={defaultAvatarImg} alt="캐릭터 아바타" />
                </div>
                <div className="character-details">
                    <h1>{ERROR_MESSAGE[errorType]}</h1>
                    <p>레밸: -</p>
                    <p>직업: -</p>
                    <p>월드: -</p>
                    <p>길드: -</p>
                    <p>전투력: -</p>
                </div>
            </div>
        );
    }else{
        let worldIcon;
        switch (basicInfo.world_name) {
            case "아케인":
                worldIcon = acainIcon;
                break;
            case "베라":
                worldIcon = beraIcon;
                break;
            case "크로아":
                worldIcon = croaIcon;
                break;
            case "엘리시움":
                worldIcon = elysiumIcon;
                break;
            case "이노시스":
                worldIcon = enosisIcon;
                break;
            case "노바":
                worldIcon = novaIcon;
                break;
            case "오로라":
                worldIcon = ororaIcon;
                break;
            case "리부트":
                worldIcon = rebootIcon;
                break;
            case "레드":
                worldIcon = redIcon;
                break;
            case "루나":
                worldIcon = runaIcon;
                break;
            case "스카니아":
                worldIcon = scaniaIcon;
                break;
            case "유니온":
                worldIcon = unionIcon;
                break;
            case "제니스":
                worldIcon = zenisIcon;
                break;
            default:
                worldIcon = errorIcon;
        }
        const combatPower = statInfo?.final_stat.find(stat => stat?.stat_name === "전투력");

        return (
            <div className="character-header">
                <div className="character-avatar">
                    <img src={basicInfo?.character_image} alt="캐릭터 아바타" />
                </div>
                <div className="character-details">
                    <h1>{basicInfo?.character_name}</h1>
                    <p>레밸: {basicInfo?.character_level}</p>
                    <p>직업: {basicInfo?.character_class}</p>
                    <p>
                        <span>월드: </span>
                        <img className={"character-world-icon"} src={worldIcon} alt={basicInfo.world_name + " 월드 아이콘"}/>
                    </p>
                    <p>길드: {basicInfo?.character_guild_name}</p>
                    <p>전투력: {(combatPower?.stat_value * 1).toLocaleString()}</p>
                </div>
            </div>
        )
    }
}

export default Character;