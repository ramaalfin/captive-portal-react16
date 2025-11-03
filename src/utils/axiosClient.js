import axios from "axios";

export const createApiClient = (baseURL) => {
    const apiKey = process.env.REACT_APP_API_KEY;

    const instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "X-API-KEY": apiKey } : {}),
        },
    });

    instance.interceptors.request.use((config) => {
        config.headers = config.headers || {};
        if (apiKey) {
            config.headers["X-API-KEY"] = apiKey;
        }
        if ("Authorization" in config.headers) {
            delete config.headers.Authorization;
        }
        return config;
    });

    instance.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response && err.response.status === 401) {
                window.location.href = "/login";
                localStorage.clear();
            }
            return Promise.reject(err);
        }
    );

    return instance;
};
