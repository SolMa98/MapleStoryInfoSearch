import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import "../styles/SearchResult.css";
import apiCall from "../utils/apiUtils";
import ability from "../components/ability/ability";

const SearchResult = () => {
    const location = useLocation();
    const navigate  = useNavigate();

    const [ocid, setOcid] = useState("");
    // 캐릭터 기본 정보
    const [basicInfo, setBasicInfo] = useState({
        character_class : "",
        character_class_level : "",
        character_exp_rate : "",
        character_guild_name : "",
        character_image : "",
        character_level : "",
        character_name : "",
        world_name : ""
    });

    // 캐릭터 능력치 정보
    const [statInfo, setStatInfo] = useState({
        final_stat : []
    });

    // 장착 세트 효과 정보
    const [effectSetInfo,setEffectSetInfo] = useState({
        set_effect : []
    });

    // 어빌리티 정보
    const [abilityInfo, setAbilityInfo] = useState({
        ability_preset_1 : {},
        ability_preset_2 : {},
        ability_preset_3 : {},
        preset_no : ""
    });

    // 캐릭터 정보 가져오기
    const getCharacterInfo = async () => {
        let basicRes = await getBasicInfo();
        let statRes = await getStatInfo();
        let setEffectRes = await getSetEffectInfo();
        let abilityRes = await getAbilityInfo();

        setBasicInfo(basicRes);
        setStatInfo(statRes);
        setEffectSetInfo(setEffectRes);
        setAbilityInfo(abilityRes);

        /*if(statRes?.final_stat.length !== 0){
            console.log(statRes.final_stat);
        }*/
    }

    //캐릭터 기본 정보 가져오기
    async function getBasicInfo() {
        let basicParams = {
            ocid : ocid
        }
        const basicRes = await apiCall("CHARACTER_BASIC", basicParams);
        return basicRes;
    }

    // 캐릭터 종합 능력치 가져오기
    async function getStatInfo() {
        let statParams = {
            ocid : ocid
        }
        const statRes = await apiCall("CHARACTER_STAT", statParams);
        return statRes;
    }

    // 세트 효과 정보 가져오기
    async function getSetEffectInfo() {
        let setEffectParams = {
            ocid : ocid
        }
        const setEffectRes = await apiCall("CHARACTER_SET_EFFECT", setEffectParams);
        return setEffectRes;
    }

    // 어빌리티 정보 가져오기
    async function getAbilityInfo() {
        let abilityParams = {
            ocid : ocid
        }
        const abilityRes = await apiCall("CHARACTER_ABILITY", abilityParams);
        return abilityRes;
    }

    // 페이지 진입 시 이벤트
    useEffect(() => {
        if(location?.state?.ocid && location?.state?.ocid !== ""){
            setOcid(location.state.ocid);
        }else{
            // 비정상적인 방법으로 result 페이지 진입 시 메인 페이지로 이동
            navigate("/");
        }
    }, []);

    // ocid 변경 시 이벤트
    useEffect(() => {
        if(ocid !== ""){
            getCharacterInfo().then();
        }
    }, [ocid]);

    return (
        <div className="result-area">
            <div className="character-info">
                <div className="character-header">
                    <div className="character-avatar">
                        <img src={basicInfo?.character_image} alt="Character Avatar" />
                    </div>
                    <div className="character-details">
                        <h1>{basicInfo?.character_name}</h1>
                        <p>길드: {basicInfo?.character_guild_name}</p>
                        <p>랭킹: 104,214위 (16,969위)</p>
                        <p>전투력: 64,760,417</p>
                    </div>
                </div>

                <div className="character-equipment">
                    <h2>장비</h2>
                    <ul className="equipment-list">
                        <li className="equipment-item">
                            <img src="" alt="" />
                            <div className="equipment-details">
                                <p className="equipment-name"></p>
                                <p className="equipment-stats"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="sidebar">
                <h2>세트 효과</h2>
                <ul className="set-effect-list">
                    {effectSetInfo.set_effect.map((item, index) => (
                        <li key={index}>{`${item?.set_name} ${item?.total_set_count}세트`}</li>
                    ))}
                </ul>
                {abilityInfo?.preset_no !== "" && (
                    ability(abilityInfo)
                )}
            </div>
        </div>
    );
}

export default SearchResult;
