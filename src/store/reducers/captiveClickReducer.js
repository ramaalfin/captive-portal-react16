// src/store/captiveClickReducer.js
// reducer + named export resetCaptiveClick

import {
    CAPTIVE_CLICK_REQUEST,
    CAPTIVE_CLICK_SUCCESS,
    CAPTIVE_CLICK_FAILURE,
} from "../action/captiveActions";

// new action type for reset
export const RESET_CAPTIVE_CLICK = "RESET_CAPTIVE_CLICK";

const initialState = {
    loading: false,
    success: false,
    error: null,
};

export default function captiveClickReducer(state = initialState, action) {
    switch (action.type) {
        case CAPTIVE_CLICK_REQUEST:
            return { ...state, loading: true, success: false, error: null };
        case CAPTIVE_CLICK_SUCCESS:
            return { ...state, loading: false, success: true, error: null };
        case CAPTIVE_CLICK_FAILURE:
            return { ...state, loading: false, success: false, error: action.error };
        case RESET_CAPTIVE_CLICK:
            return { ...initialState };
        default:
            return state;
    }
}

// named export — action creator untuk mereset state (dipakai di komponen)
export function resetCaptiveClick() {
    return { type: RESET_CAPTIVE_CLICK };
}
