import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import captiveAdsReducer from "./reducers/captiveAdsReducer";
import captiveClickReducer from "./reducers/captiveClickReducer";
import viewVideoReducer from "./reducers/viewVideoReducer";
import userLoginReducer from "./reducers/userLoginReducer";

const rootReducer = combineReducers({
    captiveAds: captiveAdsReducer,
    captiveClick: captiveClickReducer,
    viewVideo: viewVideoReducer,
    userLogin: userLoginReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
