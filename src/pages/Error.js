import "../styles/Error.css";

const Error = () => {
    // 이전 페이지로 돌아가는 버튼
    function backBtnClick() {
        window.history.back();
    }

    return (
        <div className={"error-message"}>
            <span>404 Not Found</span>
            <div style={{display:"flex", justifyContent:"center"}}>
                <div className={"error-page-back-button"} onClick={backBtnClick}>
                    <a onClick={backBtnClick}>뒤로가기</a>
                </div>
            </div>
        </div>
    )
}

export default Error;