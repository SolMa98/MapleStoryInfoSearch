import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import "../styles/SearchResult.css";
import apiCall from "../utils/apiUtils";
import Ability from "../components/Ability/Ability";
import SetEffect from "../components/SetEffect/SetEffect";
import EquipmentItem from "../components/Equipment/EquipmentItem";
import Character from "../components/Character/Character";

const SearchResult = () => {
    const location = useLocation();
    const navigate  = useNavigate();
    const [ocid, setOcid] = useState("");
    const [defaultParams, setDefaultParams] = useState({
        ocid : ""
    });
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
    // 캐릭터 장비 정보
    const [equipmentInfo, setEquipmentInfo] = useState({

    });
    const [androidInfo, setAndroidInfo] = useState({

    })
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
        /*let basicRes = await getBasicInfo();
        let statRes = await getStatInfo();
        let equipmentRes = await getItemEquipment();
        let androidRes = await getAndroid();
        let setEffectRes = await getSetEffectInfo();
        let abilityRes = await getAbilityInfo();*/

        let error = {
            error : {
                "message" : "Please try again later",
                "name" : "OPENAPI00007"
            }
        }

        setBasicInfo(error);
        setStatInfo(error);
        setEquipmentInfo(error);
        setAndroidInfo(error);
        setEffectSetInfo(error);
        setAbilityInfo(error);
    }

    //캐릭터 기본 정보 가져오기
    async function getBasicInfo() {
        const basicRes = await apiCall("CHARACTER_BASIC", defaultParams);
        return basicRes;
    }

    // 캐릭터 종합 능력치 가져오기
    async function getStatInfo() {
        const statRes = await apiCall("CHARACTER_STAT", defaultParams);
        return statRes;
    }

    // 캐릭터 장착 장비 가져오기
    async function getItemEquipment() {
        const equipmentRes = await apiCall("CHARACTER_ITEM_EQUIPMENT", defaultParams);
        return equipmentRes;
    }

    // 장착 안드로이드 정보 가져오기
    async function getAndroid() {
        const androidEquipmentRes = await apiCall("CHARACTER_ANDROID_EQUIPMENT", defaultParams);
        return androidEquipmentRes;
    }

    // 세트 효과 정보 가져오기
    async function getSetEffectInfo() {
        const setEffectRes = await apiCall("CHARACTER_SET_EFFECT", defaultParams);
        return setEffectRes;
    }

    // 어빌리티 정보 가져오기
    async function getAbilityInfo() {
        const abilityRes = await apiCall("CHARACTER_ABILITY", defaultParams);
        return abilityRes;
    }

    // 페이지 진입 시 이벤트
    useEffect(() => {
        if(location?.state?.ocid && location?.state?.ocid !== ""){
            let params = {
                ocid : location.state.ocid
            }
            setDefaultParams(params);
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
                {Character(basicInfo)}
                {EquipmentItem(equipmentInfo, androidInfo)}
            </div>
            <div className="sidebar">
                <div className={"set-title-area"}>
                    <h2 className="set-title">세트 효과</h2>
                </div>
                {SetEffect(effectSetInfo)}

                {abilityInfo?.preset_no !== "" && (
                    Ability(abilityInfo)
                )}
            </div>
        </div>
    );
}

export default SearchResult;
