<template>
    <b-navbar variant="primary" class="navbar" type="dark">
        <b-navbar-brand href="#">
            <!-- display logo and app name -->
            <img src="@/assets/logo.svg" width="32" height="32"/>
            <span class="ml-2 brand-name">Mojito</span>
        </b-navbar-brand>
        <!-- display navigation links -->
        <b-navbar-nav class="ml-auto" v-if="isLoggedIn">
            <!-- home page -->
            <b-nav-item id="home-button" href="/home" class="ml-2">
                <b-icon icon="house-door"></b-icon>
            </b-nav-item>
            <b-tooltip target="home-button">Home</b-tooltip>
            <!-- chart page -->
            <b-nav-item id="chart-button" href="/chart" class="ml-2">
                <b-icon icon="graph-up"></b-icon>
            </b-nav-item>
            <b-tooltip target="chart-button">Chart</b-tooltip>
            <!-- settings page -->
            <b-nav-item id="settings-button" href="/settings" class="ml-2">
                <b-icon icon="gear"></b-icon>
            </b-nav-item>
            <b-tooltip target="settings-button">Settings</b-tooltip>
            <!-- logout -->
            <b-nav-item id="logout-button" href="/logout" class="ml-2">
                <b-icon icon="door-open"></b-icon>
            </b-nav-item>
            <b-tooltip target="logout-button">Log Out</b-tooltip>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto" v-else>
            <!-- logout -->
            <b-nav-item id="login-button" href="/login" class="ml-2">
                <b-icon icon="door-closed"></b-icon>
            </b-nav-item>
            <b-tooltip target="login-button">Log In</b-tooltip>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "navbar",

    computed: {
        ...mapGetters(["isLoggedIn"]),
    },
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sedgwick+Ave&display=swap");
.brand-name {
    font-family: "Sedgwick Ave", Helvetica, sans-serif;
    vertical-align: -0.3em;
}
</style>
