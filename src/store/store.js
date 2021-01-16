import Vue from "vue";
import Vuex from "vuex";

import user from "@/store/modules/user";
import candlestick from "@/store/modules/candlestick";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        candlestick,
    },
});
