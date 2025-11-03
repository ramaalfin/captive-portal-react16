import { createApiClient } from "../../utils/axiosClient";

const apiClient = createApiClient(process.env.REACT_APP_URL_MASTER_DATA);

export const FETCH_CAPTIVE_ADS_REQUEST = "FETCH_CAPTIVE_ADS_REQUEST";
export const FETCH_CAPTIVE_ADS_SUCCESS = "FETCH_CAPTIVE_ADS_SUCCESS";
export const FETCH_CAPTIVE_ADS_FAILURE = "FETCH_CAPTIVE_ADS_FAILURE";

export const CAPTIVE_CLICK_REQUEST = "CAPTIVE_CLICK_REQUEST";
export const CAPTIVE_CLICK_SUCCESS = "CAPTIVE_CLICK_SUCCESS";
export const CAPTIVE_CLICK_FAILURE = "CAPTIVE_CLICK_FAILURE";

export const VIEW_VIDEO_REQUEST = "VIEW_VIDEO_REQUEST";
export const VIEW_VIDEO_SUCCESS = "VIEW_VIDEO_SUCCESS";
export const VIEW_VIDEO_FAILURE = "VIEW_VIDEO_FAILURE";

// === Thunk Actions ===

export const fetchCaptiveAds = () => async (dispatch) => {
    dispatch({ type: FETCH_CAPTIVE_ADS_REQUEST });
    try {
        const res = await apiClient.get("/ads/captive");
        dispatch({ type: FETCH_CAPTIVE_ADS_SUCCESS, payload: res.data.data });
    } catch (err) {
        dispatch({
            type: FETCH_CAPTIVE_ADS_FAILURE,
            error:
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "Failed to fetch captive ads",
        });
    }
};

export const captiveClick = (adId) => async (dispatch) => {
    dispatch({ type: CAPTIVE_CLICK_REQUEST });
    try {
        await apiClient.post("/ads/captive/click", { ad_id: adId });
        dispatch({ type: CAPTIVE_CLICK_SUCCESS });
    } catch (err) {
        dispatch({
            type: CAPTIVE_CLICK_FAILURE,
            error:
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "Failed to send captive click",
        });
    }
};

export const viewVideo = (payload) => async (dispatch) => {
    dispatch({ type: VIEW_VIDEO_REQUEST });
    try {
        const res = await apiClient.post("/ads/captive/view", payload);
        dispatch({ type: VIEW_VIDEO_SUCCESS, payload: res.data });
    } catch (err) {
        dispatch({
            type: VIEW_VIDEO_FAILURE,
            error:
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "Failed to view video",
        });
    }
};
