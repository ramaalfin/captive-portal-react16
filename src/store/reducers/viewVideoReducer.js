import {
    VIEW_VIDEO_REQUEST,
    VIEW_VIDEO_SUCCESS,
    VIEW_VIDEO_FAILURE,
} from "../action/captiveActions";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

export default function viewVideoReducer(state = initialState, action) {
    switch (action.type) {
        case VIEW_VIDEO_REQUEST:
            return { ...state, loading: true };
        case VIEW_VIDEO_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case VIEW_VIDEO_FAILURE:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}
