import {API_BASE_URL, API_ENDPOINTS} from "../constants/apiConstants";

let apiKey = process.env.REACT_APP_API_KEY;
const apiCall = async (type, params) => {
    try{
        const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

        const response = await fetch(API_BASE_URL + API_ENDPOINTS[type] + "?" + queryString, {
            headers:{
                "x-nxopen-api-key": apiKey
            }
        });

        const responseData = await response.json();
        return responseData;
    } catch (error){
        console.log(error);
        throw new Error("API Call failed");
    }
}

export default apiCall;