import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import "../styles/SearchResult.css";
import apiCall from "../utils/apiUtils";
import Ability from "../components/Ability/Ability";
import SetEffect from "../components/SetEffect/SetEffect";
import EquipmentItem from "../components/Equipment/EquipmentItem";
import Character from "../components/Character/Character";
import CharacterDetailStats from "../components/Character/CharacterDetailStats";
import Header from "../components/Header/Header";
import ComparePanel from "../components/Compare/ComparePanel";
import ExpHistoryChart from "../components/Character/ExpHistoryChart";
import { sleep } from "../utils/utilis";
import { getPastKstDates, getTodayKstDate } from "../utils/dateUtils";
import { getCachedExp, setCachedExp, getCachedCharacterInfo, setCachedCharacterInfo } from "../utils/storageUtils";

// 모바일 세그먼트 탭 목록
const MOBILE_TABS = ["능력치", "장비", "세트·어빌"];
// 연속 API 호출 사이 간격 (ms) - 넥슨 오픈 API 순간 호출 제한 방지용
const API_CALL_INTERVAL = 200;
// 경험치 히스토리 표시 일수
const EXP_HISTORY_DAYS = 7;

const SearchResult = () => {
    const location = useLocation();
    const navigate  = useNavigate();
    const [ocid, setOcid] = useState("");
    const [defaultParams, setDefaultParams] = useState({
        ocid : ""
    });
    // 캐릭터 비교 패널 노출 여부
    const [compareOpen, setCompareOpen] = useState(false);
    // 모바일 세그먼트 탭 선택 상태 (데스크탑에서는 사용되지 않음)
    const [mobileTab, setMobileTab] = useState("장비");
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
    // 경험치 변화 히스토리 (최근 N일 일별 증가량)
    const [expHistory, setExpHistory] = useState([]);
    const [expHistoryLoading, setExpHistoryLoading] = useState(false);

    // 캐릭터 정보 가져오기
    // 같은 날짜에 이미 조회한 캐릭터라면 캐시를 그대로 쓰고 API를 호출하지 않는다.
    // "갱신" 버튼(forceRefresh=true)을 누르면 당일이라도 캐시를 무시하고 새로 불러온다 - 당일 데이터가
    // 이후에 바뀌었을 수 있다는 문제를 자동 만료가 아닌 사용자의 명시적 갱신으로 해결한다.
    // 새로 호출할 때는 넥슨 오픈 API 순간 호출 제한(OPENAPI00007) 방지를 위해 동시 호출 대신
    // 순차 호출 + 호출 간 간격(API_CALL_INTERVAL)을 둔다.
    const getCharacterInfo = async (forceRefresh = false) => {
        // API ERROR 테스트 용도
        /*let error = {
            error : {
                "message" : "Please try again later",
                "name" : "OPENAPI00007"
            }
        }*/

        const today = getTodayKstDate();

        if (!forceRefresh) {
            const cached = getCachedCharacterInfo(ocid, today);
            if (cached) {
                setBasicInfo(cached.basicInfo);
                setStatInfo(cached.statInfo);
                setEquipmentInfo(cached.equipmentInfo);
                setAndroidInfo(cached.androidInfo);
                setEffectSetInfo(cached.effectSetInfo);
                setAbilityInfo(cached.abilityInfo);
                return;
            }
        }

        const basicRes = await getBasicInfo();
        setBasicInfo(basicRes);
        await sleep(API_CALL_INTERVAL);

        const statRes = await getStatInfo();
        setStatInfo(statRes);
        await sleep(API_CALL_INTERVAL);

        const equipmentRes = await getItemEquipment();
        setEquipmentInfo(equipmentRes);
        await sleep(API_CALL_INTERVAL);

        const androidRes = await getAndroid();
        setAndroidInfo(androidRes);
        await sleep(API_CALL_INTERVAL);

        const effectSetRes = await getSetEffectInfo();
        setEffectSetInfo(effectSetRes);
        await sleep(API_CALL_INTERVAL);

        const abilityRes = await getAbilityInfo();
        setAbilityInfo(abilityRes);

        // 에러가 섞인 응답은 캐시하지 않는다 (다음 조회 때 다시 시도되도록)
        const hasError = [basicRes, statRes, equipmentRes, androidRes, effectSetRes, abilityRes]
            .some(res => res && typeof res === "object" && "error" in res);

        if (!hasError) {
            setCachedCharacterInfo(ocid, today, {
                basicInfo: basicRes,
                statInfo: statRes,
                equipmentInfo: equipmentRes,
                androidInfo: androidRes,
                effectSetInfo: effectSetRes,
                abilityInfo: abilityRes
            });
        }
    }

    //캐릭터 기본 정보 가져오기
    async function getBasicInfo() {
        return await apiCall("CHARACTER_BASIC", defaultParams);
    }

    // 캐릭터 종합 능력치 가져오기
    async function getStatInfo() {
        return await apiCall("CHARACTER_STAT", defaultParams);
    }

    // 캐릭터 장착 장비 가져오기
    async function getItemEquipment() {
        return await apiCall("CHARACTER_ITEM_EQUIPMENT", defaultParams);
    }

    // 장착 안드로이드 정보 가져오기
    async function getAndroid() {
        return await apiCall("CHARACTER_ANDROID_EQUIPMENT", defaultParams);
    }

    // 세트 효과 정보 가져오기
    async function getSetEffectInfo() {
        return await apiCall("CHARACTER_SET_EFFECT", defaultParams);
    }

    // 어빌리티 정보 가져오기
    async function getAbilityInfo() {
        return await apiCall("CHARACTER_ABILITY", defaultParams);
    }

    // 경험치 변화 히스토리 조회 (최근 N일 일별 증가량)
    // 지난 날짜의 경험치는 확정된 값이라 localStorage에 캐시해두고, 캐시가 없을 때만 API를 호출한다.
    const getExpHistory = async (targetOcid) => {
        setExpHistoryLoading(true);

        // 일별 증가량을 계산하려면 기준일 하루치가 더 필요하다 (예: 7일치 막대 = 8일치 원본 데이터)
        const dates = getPastKstDates(EXP_HISTORY_DAYS + 1);
        const points = [];

        for (const date of dates) {
            let snapshot = getCachedExp(targetOcid, date);

            if (snapshot === null) {
                const res = await apiCall("CHARACTER_BASIC", { ocid: targetOcid, date });
                if (res && !("error" in res) && res.character_exp !== undefined) {
                    snapshot = {
                        exp: Number(res.character_exp),
                        level: res.character_level !== undefined ? Number(res.character_level) : null,
                        expRate: res.character_exp_rate !== undefined ? Number(res.character_exp_rate) : null
                    };
                    setCachedExp(targetOcid, date, snapshot);
                }
                await sleep(API_CALL_INTERVAL);
            }

            const exp = (snapshot?.exp === undefined || Number.isNaN(snapshot?.exp)) ? null : snapshot.exp;
            points.push({
                date,
                exp,
                level: snapshot?.level ?? null,
                expRate: snapshot?.expRate ?? null
            });
        }

        const bars = [];
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const gain = (prev.exp !== null && curr.exp !== null) ? Math.max(curr.exp - prev.exp, 0) : null;
            bars.push({ date: curr.date, gain, level: curr.level, expRate: curr.expRate });
        }

        setExpHistory(bars);
        setExpHistoryLoading(false);
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
    // 경험치 히스토리는 캐릭터 정보 조회가 끝난 뒤 이어서 호출한다 (동시 호출로 인한 API 순간 호출 제한 방지)
    useEffect(() => {
        if(ocid !== ""){
            (async () => {
                await getCharacterInfo();
                await getExpHistory(ocid);
            })();
        }
    }, [ocid]);

    return (
        <div className="search-result-page">
            <Header compareOpen={compareOpen} onToggleCompare={() => setCompareOpen(!compareOpen)} />
            {compareOpen && (
                <div className="compare-panel-wrapper">
                    <ComparePanel
                        open={compareOpen}
                        onClose={() => setCompareOpen(false)}
                        myBasicInfo={basicInfo}
                        myStatInfo={statInfo}
                        myEquipmentInfo={equipmentInfo}
                    />
                </div>
            )}
            <div className="result-area">
                <div className="character-info">
                    <Character
                        basicInfo={basicInfo}
                        statInfo={statInfo}
                        ocid={ocid}
                        onRefresh={() => getCharacterInfo(true)}
                        onCompareAdd={() => setCompareOpen(true)}
                    />

                    <div className="mobile-tab-bar">
                        {MOBILE_TABS.map(tab => (
                            <button
                                key={"mobile-tab-" + tab}
                                className={"mobile-tab-btn" + (mobileTab === tab ? " is-active" : "")}
                                onClick={() => setMobileTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={"mobile-only" + (mobileTab !== "능력치" ? " mobile-hidden" : "")}>
                        <CharacterDetailStats basicInfo={basicInfo} statInfo={statInfo} />
                    </div>

                    <div className={mobileTab !== "장비" ? "mobile-hidden" : ""}>
                        <EquipmentItem equipmentInfo={equipmentInfo} androidInfo={androidInfo} />
                    </div>
                </div>
                <div className={"sidebar" + (mobileTab !== "세트·어빌" ? " mobile-hidden" : "")}>
                    <SetEffect data={effectSetInfo} />

                    {(abilityInfo?.preset_no || "error" in abilityInfo) && (
                        <Ability data={abilityInfo} />
                    )}
                </div>
            </div>

            <div className="exp-history-area">
                <ExpHistoryChart history={expHistory} loading={expHistoryLoading} />
            </div>
        </div>
    );
}

export default SearchResult;
