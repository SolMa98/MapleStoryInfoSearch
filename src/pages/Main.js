import { useState } from "react";
import "../styles/Main.css";
import apiCall from "../utils/apiUtils";
import { useNavigate } from 'react-router-dom';
import { isValidCharacterName } from "../utils/validationUtils";
import { addRecentSearch, getRecentSearches } from "../utils/storageUtils";
import { getStoredTheme, toggleTheme } from "../utils/themeUtils";
import searchIconBlack from "../assets/image/common/search-icon-black.svg";
import searchIconWhite from "../assets/image/common/search-icon-white.svg";

const Main = () => {
    const navigate  = useNavigate();
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(getStoredTheme());
    const [recentSearches, setRecentSearches] = useState(getRecentSearches());

    const handleToggleTheme = () => {
        setTheme(toggleTheme());
    };

    // 검색바에서 Enter 클릭 시 캐릭터 정보 검색 호출
    const mapleSearchEvent = (e) => {
        if(e.keyCode === 13){
            mapleInfoSearch();
        }
    }

    // 캐릭터 기본 정보 검색 (targetName 미지정 시 입력창의 name 사용 - 최근 검색 칩 클릭용)
    const mapleInfoSearch = async (targetName) => {
        const trimmedName = (targetName ?? name).trim();

        if(!isValidCharacterName(trimmedName)){
            setError(trimmedName === "" ? "닉네임을 입력해주세요" : "닉네임을 제대로 입력했는지 확인해주세요.");
            return;
        }

        const result = await apiCall("ID", { character_name : trimmedName });

        if(result?.ocid){
            setError("");
            setRecentSearches(addRecentSearch({ name: trimmedName, ocid: result.ocid }));
            // 페이지 이동 및 값 전달
            navigate("/result", {
                state : {
                    ocid: result.ocid
                }
            });
        }else{
            setError("캐릭터를 찾을 수 없습니다.");
        }
    }

    const handleRecentChipClick = (recentName) => {
        setName(recentName);
        mapleInfoSearch(recentName);
    };

    return (
        <div className="main-page">
            <div className="main-topbar">
                <div className="main-logo">
                    <span className="main-logo-title">메른이</span>
                    <span className="main-logo-subtitle">MapleStory 전적검색</span>
                </div>
                <button className="main-theme-btn" onClick={handleToggleTheme}>
                    {theme === "light" ? "☾ 다크" : "☀ 라이트"}
                </button>
            </div>

            <div className="main-body">
                <h1 className="main-headline">캐릭터 전적 검색</h1>
                <p className="main-description">닉네임을 입력하면 능력치, 장비, 세트 효과를 한 번에 확인할 수 있습니다.</p>

                <div className="main-search-field">
                    <img src={searchIconBlack} alt="" className="main-search-field-icon" />
                    <input
                        id="name"
                        type={"text"}
                        placeholder={"캐릭터 닉네임"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={mapleSearchEvent}
                    />
                    <button className="main-search-btn" onClick={() => mapleInfoSearch()}>
                        <img src={searchIconWhite} alt="검색" />
                    </button>
                </div>
                {error && <p className={"main-search-error"}>{error}</p>}

                {recentSearches.length > 0 && (
                    <div className="main-recent-searches">
                        <span className="main-recent-label">최근 검색</span>
                        {recentSearches.map(recent => (
                            <button
                                key={"main-recent-" + recent.name}
                                className="main-recent-chip"
                                onClick={() => handleRecentChipClick(recent.name)}
                            >
                                {recent.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Main;