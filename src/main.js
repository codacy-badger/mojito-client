import Vue from "vue";
import Router from 'vue-router';
import App from "@/App.vue";

import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import NotFound from "@/views/NotFound";
import Login from "@/views/Login";
import Home from "@/views/Home";
import Charts from "@/views/Charts";
import Bots from "@/views/Bots";
import Settings from "@/views/Settings";
import Logout from "@/views/Logout";

// install VueJS plugins
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Router);
Vue.config.productionTip = false;

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
      path: "/charts",
      name: "charts",
      component: Charts,
      meta: { secure: true },
    },
    {
      path: "/bots",
      name: "bots",
      component: Bots,
      meta: { secure: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      meta: { secure: true },
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
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

// // require credentials for secure pages
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.secure) /* TODO: && is logged in */) {
//     next("/login");
//   } else {
//     next();
//   }
// });

// create VueJS app
new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
