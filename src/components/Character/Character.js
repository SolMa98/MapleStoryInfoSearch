import React, {useEffect, useState} from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";
import {isFavorite, toggleFavorite} from "../../utils/storageUtils";
import {findStat, formatNumber, getMainStat} from "../../utils/utilis";
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

const Character = ({basicInfo, statInfo, ocid, onRefresh, onCompareAdd}) => {
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        setIsFav(isFavorite(basicInfo?.character_name));
    }, [basicInfo?.character_name]);

    const handleToggleFavorite = () => {
        const nextFavorites = toggleFavorite({
            name: basicInfo.character_name,
            level: basicInfo.character_level,
            ocid
        });
        setIsFav(nextFavorites.some(favorite => favorite.name === basicInfo.character_name));
    };

    const handleAvatarError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultAvatarImg;
    };

    if("error" in basicInfo || "error" in statInfo){
        let errorType = "error" in basicInfo ? basicInfo.error.name : statInfo.error.name;

        return (
            <div className="character-header-row">
                <div className="character-card">
                    <div className="character-avatar-box">
                        <img src={defaultAvatarImg} alt="캐릭터 아바타" />
                    </div>
                    <div className="character-card-body character-card-body-error">
                        <p className="character-error-message">{ERROR_MESSAGE[errorType]}</p>
                    </div>
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

        const finalStat = statInfo?.final_stat || [];
        const combatPowerStat = findStat(finalStat, "전투력");
        const mainStat = getMainStat(finalStat);
        const statAttackStat = findStat(finalStat, "최대 스탯공격력");
        const arcaneForceStat = findStat(finalStat, "아케인포스");
        const expRate = Number(basicInfo?.character_exp_rate) || 0;

        // TODO: 전투력 순위 패널(디자인 섹션3, width:250px 다크 패널) - 넥슨 오픈 API에 랭킹 조회
        // 엔드포인트가 없어 표시하지 않음. 랭킹 API 연동 시 이 자리에 character-header-row의
        // 두 번째 자식으로 추가한다.
        return (
            <div className="character-header-row">
                <div className="character-card">
                    <div className="character-avatar-box">
                        <img src={basicInfo?.character_image} alt="캐릭터 아바타" onError={handleAvatarError} />
                    </div>

                    <div className="character-card-body">
                        <div className="character-card-top">
                            <div className="character-identity">
                                <div className="character-name-row">
                                    <h1 className="character-name">{basicInfo?.character_name}</h1>
                                    <span className="character-world-badge">
                                        <img className="character-world-badge-icon" src={worldIcon} alt="월드 아이콘" />
                                        {basicInfo.world_name}
                                    </span>
                                </div>
                                <div className="character-meta-row">
                                    <span className="character-level">Lv.{basicInfo?.character_level}</span>
                                    <span className="character-meta-dot" />
                                    <span>{basicInfo?.character_class}</span>
                                    <span className="character-meta-dot" />
                                    <span>{basicInfo?.character_guild_name || "무길드"}</span>
                                </div>
                            </div>

                            <div className="character-actions">
                                <button className="character-action-btn character-action-favorite" onClick={handleToggleFavorite}>
                                    <span className="character-action-favorite-star" style={{color: isFav ? "#F0B429" : "#D1D5DB"}}>★</span>
                                    <span className="character-action-label">{isFav ? "즐겨찾기 해제" : "즐겨찾기"}</span>
                                </button>
                                <button className="character-action-btn character-action-compare" onClick={onCompareAdd}>비교에 추가</button>
                                <button className="character-action-btn character-action-refresh" onClick={onRefresh}>갱신</button>
                            </div>
                        </div>

                        <div className="character-exp">
                            <div className="character-exp-label-row">
                                <span className="character-exp-label">EXP</span>
                                <span className="character-exp-value">{expRate}%</span>
                            </div>
                            <div className="character-exp-bar">
                                <div className="character-exp-bar-fill" style={{width: expRate + "%"}} />
                            </div>
                        </div>

                        <div className="character-stat-grid">
                            <div className="character-stat-cell">
                                <span className="character-stat-label">전투력</span>
                                <span className="character-stat-value">{formatNumber(combatPowerStat?.stat_value)}</span>
                            </div>
                            <div className="character-stat-cell">
                                <span className="character-stat-label">{mainStat.stat_name}</span>
                                <span className="character-stat-value">{formatNumber(mainStat.stat_value)}</span>
                            </div>
                            <div className="character-stat-cell">
                                <span className="character-stat-label">스탯 공격력</span>
                                <span className="character-stat-value">{formatNumber(statAttackStat?.stat_value)}</span>
                            </div>
                            <div className="character-stat-cell">
                                <span className="character-stat-label">아케인포스</span>
                                <span className="character-stat-value">{formatNumber(arcaneForceStat?.stat_value)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Character;