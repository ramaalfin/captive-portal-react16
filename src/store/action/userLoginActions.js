import { createApiClient } from "../../utils/axiosClient";

const apiClient = createApiClient(process.env.REACT_APP_URL_MASTER_DATA);

export const FETCH_USER_LOGIN_REQUEST = "FETCH_USER_LOGIN_REQUEST";
export const FETCH_USER_LOGIN_SUCCESS = "FETCH_USER_LOGIN_SUCCESS";
export const FETCH_USER_LOGIN_FAILURE = "FETCH_USER_LOGIN_FAILURE";

export const fetchUserLogin = () => async (dispatch) => {
    dispatch({ type: FETCH_USER_LOGIN_REQUEST });
    try {
        const res = await apiClient.get("/ads/captive/user-login");
        dispatch({ type: FETCH_USER_LOGIN_SUCCESS, payload: res.data });
    } catch (err) {
        dispatch({
            type: FETCH_USER_LOGIN_FAILURE,
            error:
                (err.response && err.response.data && err.response.data.message) ||
                err.message ||
                "Failed to fetch user login",
        });
    }
};
