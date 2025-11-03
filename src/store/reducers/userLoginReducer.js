import {
    FETCH_USER_LOGIN_REQUEST,
    FETCH_USER_LOGIN_SUCCESS,
    FETCH_USER_LOGIN_FAILURE,
} from "../action/userLoginActions";

const initialState = {
    loading: false,
    error: null,
    data: null,
};

export default function userLoginReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_LOGIN_REQUEST:
            return { ...state, loading: true };
        case FETCH_USER_LOGIN_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case FETCH_USER_LOGIN_FAILURE:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
}
