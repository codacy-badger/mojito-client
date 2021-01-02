import axios from "axios";

// defines the key used to access the JWT access token from local storage.
const ACCESS_TOKEN_KEY = "jwt_access";

// defines the key used to access the JWT refresh token from local storage.
const REFRESH_TOKEN_KEY = "jwt_refresh";

// defines the key used to access permissions from local storge.
const PERMISSIONS_KEY = "permissions";

// initial state
const state = ({
    accessToken: null,
    refreshToken: null,
    permissions: null,
    error: null,
    loading: false,
});

const mutations = {

    // reset clears the state.
    reset(state) {
        state.accessToken = null;
        state.refreshToken = null;
        state.permissions = null;
        state.error = null;
        state.loading = false;

        // remove the tokens from local storage
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(PERMISSIONS_KEY);
    },

    // setAuth sets the JWT access and refresh tokens.
    setAuth(state, payload) {

        // set auth tokens and add to local storage
        state.accessToken = payload.access_token;
        state.refreshToken = payload.refresh_token;

        localStorage.setItem(ACCESS_TOKEN_KEY, state.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken);

        // set permissions and add to local storage
        state.permissions = new Set();

        if (Array.isArray(payload.permissions) && payload.permissions.length) {
            payload.permissions.forEach(item => {
                state.permissions.add(item);
            });

            localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(payload.permissions));
        }
    },

    // setError sets the error message for the store.
    setError(state, payload) {

        // if payload is empty or null clear the error message
        if (!payload) {
            state.error = null;
            return;
        }

        // set the error message
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

    // hasPermission returns a function that can be used to check if the user
    // has a specific permission.
    hasPermission() {
        return (permission) => {

            // if the permissions are blank attempt to set them from local
            // storage
            if (!state.permissions) {
                state.permissions = new Set();
                let permissions = JSON.parse(localStorage.getItem(PERMISSIONS_KEY));

                if (Array.isArray(permissions) && permissions.length) {
                    permissions.forEach(item => {
                        state.permissions.add(item);
                    });
                }
            }

            // if permissions are still blank return that the user does not have
            // the specified permission
            if (!state.permissions) {
                return false;
            }

            return state.permissions.has(permission);
        };
    },

};

const actions = {

    // login logs the user in with the supplied credentials.
    login({ commit }, {email, password}) {

        commit("setError", null);
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

    // refresh gets fresh user credentials.
    refresh({ commit }) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.post("/refresh", {
            refresh_token: getters.getRefreshToken(),
        });

        promise.then(response => {
            commit("setAuth", response.data);
            commit("setLoading", false);
        }).catch(() => {
            commit("reset");
            commit("setLoading", false);
        });

        return promise;

    },

    // logout clears the user credentials.
    logout({ commit }) {

        commit("setError", null);

        if (getters.isLoggedIn()) {

            // if the user is logged in make a call to the logout endpoint to
            // explicitly invalidate their login credentials on the server
            commit("setLoading", true);

            axios.post("/logout", {})
            .then(() => {
                commit("reset");
                commit("setLoading", false);
            }).catch(() => {
                commit("reset");
                commit("setLoading", false);
            });

        } else {

            // if the user is not logged in clear any stored information
            commit("reset");

        }

    },

    // reset changes the logged in user's password.
    reset({ commit }, {currentPassword, newPassword}) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.post("/reset", {
            current_password: currentPassword,
            new_password: newPassword,
        });

        promise.then(() => {
            commit("setLoading", false);
        }).catch(error => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        });

        return promise;

    },

    // signup creates a new user account.
    signup({ commit }, {email, password}) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.post("/signup", {
            email: email,
            password: password,
        });

        promise.then(() => {
            commit("setLoading", false);
        }).catch(error => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        });

        return promise;

    },

    // signupVerify confirms that a user has access to the email address that
    // they supplied during signup.
    signupVerify({ commit }, {token}) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.post("/signup/verify", {
            token: token,
        });

        promise.then(() => {
            commit("setLoading", false);
        }).catch(error => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        });

        return promise;

    },

    // recover initiates the account recovery process.
    recover({ commit }, {email}) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.post("/recover", {
            email: email,
        });

        promise.then(() => {
            commit("setLoading", false);
        }).catch(error => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        });

        return promise;

    },

    // recoverReset confirms that a user has access to the email address of the
    // account that they are trying to recover and resets the account password.
    recoverReset({ commit }, {token, password}) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.post("/recover/reset", {
            token: token,
            password: password,
        });

        promise.then(() => {
            commit("setLoading", false);
        }).catch(error => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        });

        return promise;

    },

};

export default {
    state,
    mutations,
    getters,
    actions,
};
