import {
    FETCH_CAPTIVE_ADS_REQUEST,
    FETCH_CAPTIVE_ADS_SUCCESS,
    FETCH_CAPTIVE_ADS_FAILURE,
} from "../action/captiveActions";

const initialState = {
    ads: [],
    loading: false,
    error: null,
};

export default function captiveAdsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CAPTIVE_ADS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_CAPTIVE_ADS_SUCCESS:
            return { ...state, loading: false, ads: action.payload };
        case FETCH_CAPTIVE_ADS_FAILURE:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}
