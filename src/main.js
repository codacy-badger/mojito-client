import Vue from "vue";
import Router from 'vue-router';
import axios from "axios";

import App from "@/views/App.vue";
import store from "@/store/store";

import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import NotFound from "@/views/NotFound";
import Home from "@/views/Home";
import Login from "@/views/login/Login";
import Logout from "@/views/logout/Logout";
import Signup from "@/views/signup/Signup";
import Recover from "@/views/recover/Recover";
import RecoverReset from "@/views/recover/RecoverReset";
import Reset from "@/views/reset/Reset";

// install VueJS plugins
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Router);
Vue.config.productionTip = false;

// set base API URL for axios
axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL ||
    "https://mojitobot.com/api"

// add interceptor for setting the auth token when making API requests
axios.interceptors.request.use(function(config) {
    let accessToken = store.getters.getAccessToken;
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});

// add interceptor to refresh the user's access token, if the access token
// cannot be refreshed redirect the user to the login page
axios.interceptors.response.use(null, error => {
    if (router.currentRoute?.name && router.currentRoute.name == "login") {
        return Promise.reject(error);
    }
    if (error.config && error.response && error.response.status === 401) {
        return new Promise((resolve, reject) => {
            store.dispatch("refresh").then(() => {
                error.config.__isRetryRequest = true;
                resolve(axios(error.config));
            }).catch(() => {
                router.push({ name: "login" });
                reject(error);
            });
        });
    }
    return Promise.reject(error);
});

// define application router
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: "/login",
            name: "login",
            component: Login,
        },
        {
            path: "/logout",
            name: "logout",
            component: Logout,
        },
        {
            path: "/signup",
            name: "signup",
            component: Signup,
        },
        {
            path: "/recover",
            name: "recover",
            component: Recover,
        },
        {
            path: "/recover/reset",
            name: "recover-reset",
            component: RecoverReset,
        },
        {
            path: "/reset",
            name: "reset",
            component: Reset,
            meta: { secure: true },
        },
        {
            path: "",
            component: Home,
            meta: { secure: true },
            children: [
                {
                    path: "/home",
                    name: "home",
                    component: Home,
                    meta: { secure: true },
                },
            ],
        },
        {
            path: "/not-found",
            name: "not-found",
            component: NotFound,
        },
        {
            path: "*",
            redirect: {
                name: "not-found",
            },
        },
    ],
});

// require credentials for secure pages
router.beforeEach((to, _, next) => {
    if (to.matched.some(record => record.meta.secure) &&
        !store.getters.isLoggedIn) {
        next("/login");
    } else {
        next();
    }
});

// create VueJS app
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount("#app");
