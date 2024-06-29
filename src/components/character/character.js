import React from "react";
import {ERROR_MESSAGE} from "../../constants/errorConstants";
import defaultAvatarImg from "../../assets/image/common/maplestory-default-avatar.png";

const character = (data) => {
    if("error" in data){

        return (
            <div className="character-header">
                <div className="character-avatar">
                    <img src={defaultAvatarImg} alt="캐릭터 아바타" />
                </div>
                <div className="character-details">
                    <h1>{ERROR_MESSAGE[data.error.name]}</h1>
                    <p>길드: -</p>
                    <p>랭킹: -</p>
                    <p>전투력: -</p>
                </div>
            </div>
        );
    }else{
        return (
            <div className="character-header">
                <div className="character-avatar">
                    <img src={data?.character_image} alt="캐릭터 아바타" />
                </div>
                <div className="character-details">
                    <h1>{data?.character_name}</h1>
                    <p>길드: {data?.character_guild_name}</p>
                    <p>랭킹: 104,214위 (16,969위)</p>
                    <p>전투력: 64,760,417</p>
                </div>
            </div>
        )
    }
}

export default character;