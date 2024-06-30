import legIcon from "../../assets/image/common/legendary_icon.png";
import uniqIcon from "../../assets/image/common/unique_icon.png";
import epicIcon from "../../assets/image/common/epic_icon.png";
import rareIcon from "../../assets/image/common/rare_icon.png";

const equipmentItemOption = () => {
    return (
        <div>
            <div className={"equipment-item-title"}>
                <p>하이네스 원더러 햇 (+12)</p>
                <p>(레전드리 아이템)</p>
            </div>
            <hr className={"next-line"} />
            <div className={"item-top"}>
                <div className={"item-img-space"}>
                    <img src="https://open.api.nexon.com/static/maplestory/ItemIcon/KEPCIPOA.png" alt="하이네스 원더러햇" />
                </div>
                <div className={"equipment-level"}>
                    <p>· REQ LEVEL : 150</p>
                    <div>
                        <div className={"equipment-level-limit"}>
                            <p>· REQ STR : 000</p>
                            <p>· REQ LUK : 000</p>
                        </div>
                        <div className={"equipment-level-limit"}>
                            <p>· REQ DEX : 000</p>
                            <p>· REQ INT : 000</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"equipment-job"}>
                <p>초보자</p>
                <p>전사</p>
                <p>마법사</p>
                <p>궁수</p>
                <p>도적</p>
                <p>해적</p>
            </div>

            <hr className={"next-line"} />

            <div className={"equipment-item-details"}>
                <p>장비 분류: 모자</p>
                <p>
                    <span className={"synthesis-option"}>STR : +176 </span>
                    <span className={"default-option"}>(40 </span>
                    <span className={"add-option"}>+48 </span>
                    <span className={"force-option"}>+26 </span>
                    <span className={"star-force-option"}>+62</span>
                    <span className={"default-option"}>)</span>
                </p>
                <p>DEX : +166 (40 +40 +24 +62)</p>
                <p>HP : +765 (360 +150 +255)</p>
                <p>MP : +510 (360 +150)</p>
                <p>공격력 : +41 (2 +20 +19)</p>
                <p>마력 : +19 (0 +19)</p>
                <p>방어력 : +747 (300 +21 +426)</p>
                <p>점프력 : +28 (0 +4 +24)</p>
                <p>방어력 무시 : +10%</p>
                <p>올스탯 : +5% (0% +5%)</p>
                <p>업그레이드 가능 횟수 : 0 (복구 가능 횟수 : 0)</p>
                <p>황금망치 제련 적용</p>
                <p>가위 사용 가능 횟수 : 10회</p>
            </div>

            <hr className={"next-line"} />

            <div className={"equipment-item-details"}>
                <p className={"leg-option"}>
                    <img src={legIcon} />
                    <span>잠재옵션</span>
                </p>
                <p>올스탯 : +9%</p>
                <p>최대 MP : +12%</p>
                <p>STR : +9%</p>
            </div>

            <hr className={"next-line"} />

            <div className={"equipment-item-details"}>
                <p className={"epic-option"}>
                    <img src={epicIcon} />
                    <span>에디셔널 잠재옵션</span>
                </p>
                <p>+ STR : +4%</p>
                <p>+ 공격력 : +10</p>
                <p>+ 공격력 : +10</p>
            </div>

        </div>
    )
}

export default equipmentItemOption;