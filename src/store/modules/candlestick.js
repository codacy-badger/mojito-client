import axios from "axios";

// initial state
const state = ({
    spec: null,
    candlesticks: null,
    error: null,
    loading: false,
});

const mutations = {

    // reset clears the state.
    reset(state) {
        state.spec = null;
        state.candlesticks = null;
        state.error = null;
        state.loading = false;
    },

    // setSpec updates the candlestick spec.
    setSpec(state, payload) {
        state.spec = payload;
    },

    // setCandlesticks updates candlestick data.
    setCandlesticks(state, payload) {
        state.candlesticks = payload;
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

    // getExchanges retrieves all available exchanges. The resulting value is a
    // tuple containing the exchange id and display name.
    getExchanges() {

        if (!state.spec || !state.spec.exchanges) {
            return null;
        }

        let exchanges = [];

        state.spec.exchanges.forEach(function (item) {
            exchanges.push({ id: item.id, name: item.name });
        });

        return exchanges;
    },

    // getTickers gets a function that can be used to retrieve all available
    // tickers for a specific exchange. The resulting value is a tuple
    // containing the ticker id and display name.
    getTickers() {

        return function(exchange) {

            if (!state.spec || !state.spec.exchanges) {
                return null;
            }

            let tickers = [];

            state.spec.exchanges.forEach(function (item) {
                if (item.id === exchange) {
                    item.tickers.forEach(function (item) {
                        tickers.push({ id: item.id, name: item.name });
                    });
                }
            });

            return tickers;

        };
    },

};

const actions = {

    // loadCandlestickSpec retrieves the spec that determines what options are
    // available when making a call to load candlestick data.
    loadCandlestickSpec({ commit }) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.get("/candlestick/spec");

        promise.then((response) => {
            commit("setSpec", response.data);
            commit("setLoading", false);
        }).catch((error) => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        })

        return promise;

    },

    // loadCandlesticks requests candlestick data.
    loadCandlesticks({ commit }, { exchange, ticker }) {

        commit("setError", null);
        commit("setLoading", true);

        let promise = axios.get(
            `/candlestick/exchange/${exchange}/ticker/${ticker}`);

        promise.then((response) => {
            commit("setCandlesticks", response.data);
            commit("setLoading", false);
        }).catch((error) => {
            commit("setError", error.response?.data);
            commit("setLoading", false);
        })

        return promise;

    },

};

export default {
    state,
    mutations,
    getters,
    actions,
};
