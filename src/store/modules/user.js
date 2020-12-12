import axios from "axios";

// defines the key used to access the JWT access token in local storage.
const ACCESS_TOKEN_KEY = "jwt_access";

// defines the key used to access the JWT refresh token in local storage.
const REFRESH_TOKEN_KEY = "jwt_refresh";

// initial state
const state = ({
    accessToken: null,
    refreshToken: null,
    error: null,
    loading: false,
});

const mutations = {

    // reset clears the state.
    reset(state) {
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
        state.loading = false;

        // remove the tokens from local storage
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    // setAuth sets the JWT access and refresh tokens.
    setAuth(state, payload) {
        state.accessToken = payload.access_token;
        state.refreshToken = payload.refresh_token;

        // add the tokens to local storage
        localStorage.setItem(ACCESS_TOKEN_KEY, state.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken);
    },

    // setError sets the error message for the store.
    setError(state, payload) {
        state.error = payload?.error ? payload.error :
            "we were unable to service your request at this time, please try again later";
    },

    // setLoading sets the loading flag.
    setLoading(state, value) {
        state.loading = value;
    },

};

const getters = {

    // isLoggedIn checks if the user is currently logged in.
    isLoggedIn() {

        // if the tokens are blank attempt to set the tokens from local storage
        if (!state.accessToken || !state.refreshToken) {
            state.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            state.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        }

        return !!state.accessToken && !!state.refreshToken;
    },

    // isLoading checks if the user store is currently loading data.
    isLoading() {
        return state.loading;
    },

    // getAccessToken retrieves the user access token.
    getAccessToken() {

        // if the access token is blank attempt to set it from local storage
        if (!state.accessToken) {
            state.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        }

        return state.accessToken;
    },

    // getRefreshToken retrieves the user refresh token.
    getRefreshToken() {

        // if the refresh token is blank attempt to set it from local storage
        if (!state.refreshToken) {
            state.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        }

        return state.refreshToken;
    },

};

const actions = {

    // login logs the user in with the supplied credentials.
    login({ commit }, {email, password}) {

        commit("setLoading", true);

        let promise = axios.post("/login", {
            email: email,
            password: password,
        });

        promise.then(response => {
            commit("setAuth", response.data);
            commit("setLoading", false);
        }).catch(error => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        });

        return promise;

    },

    // logout clears the user credentials.
    logout({ commit }) {

        if (getters.isLoggedIn()) {

            // if the user is logged in make a call to the logout endpoint to
            // explicitly invalidate their login credentials on the server
            commit("setLoading", true);

            axios.post("/logout", {})
            .then(() => {
                commit("reset");
                commit("setLoading", false);
            }).catch(error => {
                commit("reset");
                commit("setError", error.response?.data);
                commit("setLoading", false);
            });

        } else {

            // if the user is not logged in clear any stored information
            commit("reset");

        }

    },

};

export default {
    state,
    mutations,
    getters,
    actions,
};