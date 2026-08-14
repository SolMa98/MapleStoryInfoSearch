import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "../../utils/apiUtils";
import { isValidCharacterName } from "../../utils/validationUtils";
import { addRecentSearch, getFavorites, getRecentSearches } from "../../utils/storageUtils";
import { getStoredTheme, toggleTheme } from "../../utils/themeUtils";
import searchIcon from "../../assets/image/common/search-icon-black.svg";
import searchIconWhite from "../../assets/image/common/search-icon-white.svg";

const Header = ({ compareOpen, onToggleCompare }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [favorites, setFavorites] = useState(getFavorites());
    const [recentSearches, setRecentSearches] = useState(getRecentSearches());
    const [theme, setTheme] = useState(getStoredTheme());

    const handleToggleTheme = () => {
        setTheme(toggleTheme());
    };

    // 다른 화면(캐릭터 헤더 카드)에서 즐겨찾기/최근 검색이 바뀌면 동기화
    useEffect(() => {
        const syncFavorites = () => setFavorites(getFavorites());
        const syncRecentSearches = () => setRecentSearches(getRecentSearches());

        window.addEventListener("mereni-favorites-changed", syncFavorites);
        window.addEventListener("mereni-recent-searches-changed", syncRecentSearches);
        return () => {
            window.removeEventListener("mereni-favorites-changed", syncFavorites);
            window.removeEventListener("mereni-recent-searches-changed", syncRecentSearches);
        };
    }, []);

    const searchCharacter = async (name) => {
        const trimmedName = name.trim();

        if (!isValidCharacterName(trimmedName)) {
            setError("닉네임을 제대로 입력했는지 확인해주세요.");
            return;
        }

        const result = await apiCall("ID", { character_name: trimmedName });
        if (result?.ocid) {
            setError("");
            setRecentSearches(addRecentSearch({ name: trimmedName, ocid: result.ocid }));
            navigate("/result", { state: { ocid: result.ocid } });
        } else {
            setError("캐릭터를 찾을 수 없습니다.");
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.keyCode === 13) {
            searchCharacter(query);
        }
    };

    const handleChipClick = (name) => {
        setQuery(name);
        searchCharacter(name);
    };

    const showQuickRow = favorites.length > 0 || recentSearches.length > 0;

    return (
        <header className="app-header">
            <div className="app-header-row1">
                <div className="app-header-logo">
                    <span className="app-header-title">메른이</span>
                    <span className="app-header-subtitle">MapleStory 전적검색</span>
                </div>

                <div className="app-header-search">
                    <img src={searchIcon} alt="검색" className="app-header-search-icon" />
                    <input
                        type="text"
                        value={query}
                        placeholder="캐릭터 닉네임을 입력하세요"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button className="app-header-search-btn" onClick={() => searchCharacter(query)}>
                        <img src={searchIconWhite} alt="검색" />
                    </button>
                </div>

                <div className="app-header-actions">
                    <button className="app-header-compare-btn" onClick={onToggleCompare}>
                        {compareOpen ? "비교 닫기" : "캐릭터 비교"}
                    </button>
                    <button className="app-header-compare-btn app-header-theme-btn" onClick={handleToggleTheme}>
                        {theme === "light" ? "☾ 다크" : "☀ 라이트"}
                    </button>
                    <div className="app-header-region">KR</div>
                </div>
            </div>

            {error && (
                <div className="app-header-error-row">
                    <span className="app-header-error">{error}</span>
                </div>
            )}

            {showQuickRow && (
                <div className="app-header-row2">
                    {favorites.length > 0 && (
                        <div className="app-header-chip-group">
                            <span className="app-header-chip-label app-header-favorite-label">즐겨찾기</span>
                            {favorites.map(favorite => (
                                <button
                                    key={"header-favorite-" + favorite.name}
                                    className="app-header-chip app-header-favorite-chip"
                                    onClick={() => handleChipClick(favorite.name)}
                                >
                                    <span className="app-header-favorite-star">★</span>
                                    {favorite.name}
                                    <span className="app-header-favorite-level">Lv.{favorite.level}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {favorites.length > 0 && recentSearches.length > 0 && (
                        <div className="app-header-divider" />
                    )}

                    {recentSearches.length > 0 && (
                        <div className="app-header-chip-group">
                            <span className="app-header-chip-label app-header-recent-label">최근 검색</span>
                            {recentSearches.map(recent => (
                                <button
                                    key={"header-recent-" + recent.name}
                                    className="app-header-chip app-header-recent-chip"
                                    onClick={() => handleChipClick(recent.name)}
                                >
                                    {recent.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;