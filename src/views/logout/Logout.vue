<template>
    <b-card
        class="logout mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Log Out</h2>
        </template>

        <center v-if="isLoading || isLoggedIn">
            <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
            <p>
                You are being logged out...
            </p>
        </center>
        <p v-else>
            You have successfully been logged out!<br><br>
            <a href="/login">Click here</a> to return to the login page.
        </p>

    </b-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "logout",

    computed: {
        ...mapGetters(["isLoggedIn", "isLoading"]),
    },

    mounted() {
        this.$nextTick(function () {
            this.logout();
        });
    },

    methods: {
        ...mapActions({
            logout: "logout",
        }),
    },

}
</script>

<style scoped>
.logout {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>
