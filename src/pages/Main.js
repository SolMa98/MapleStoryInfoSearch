import "../styles/Main.css";
import apiCall from "../utils/apiUtils";
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate  = useNavigate();
    // 검색바에서 Enter 클릭 시 캐릭터 정보 검색 호출
    const mapleSearchEvent = async (e) => {
        if(e.keyCode === 13){
            await mapleInfoSearch();
        }
    }

    // 캐릭터 기본 정보 검색
    const mapleInfoSearch = async () => {
        let name = document.getElementById("name").value.trim();

        if(nameFilter(name)){
            let prams = {
                "character_name" : name
            }

            const result = await apiCall("ID", prams);
            // 페이지 이동 및 값 전달
            navigate("/result", {
                state : {
                    ocid: result.ocid
                }
            });
        }
    }

    // 닉네임 유효성 검사
    const nameFilter = ( name ) => {
        const isValidName = /([^가-힣a-z\x20])/i.test(name);

        if( name === "" ) {
            alert("닉네임을 입력해주세요");
            return 0;
        }

        if (name.includes(" ") || isValidName) {
            alert("닉네임을 제대로 입력했는지 확인해주세요.");
            return 0;
        }

        return 1;
    }

    return (
        <div className={"main-area"}>
            <div className={"main-title"}>
                <span style={{ marginRight : "10px" }}>메른이</span>
                <span>검색</span>
            </div>
            <div className={"search-bar-area"}>
                <div className={"search-bar"}>
                    <input id="name" type={"text"} placeholder={"닉네임"} onKeyDown={mapleSearchEvent}/>
                    <button onClick={mapleInfoSearch}/>
                </div>
            </div>
        </div>
    );
}

export default Main;