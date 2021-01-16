<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Log Out</h2>
        </template>

        <center v-if="loading || isLoggedIn">
            <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
            <p>
                You are being logged out...
            </p>
        </center>

        <center v-else>
            <p>
                You have successfully been logged out!<br><br>
                <a href="/login">Click here</a> to return to the login page.
            </p>
        </center>

    </b-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    name: "logout",

    computed: {
        ...mapState({
            loading: state => state.user.loading,
        }),
        ...mapGetters([
            "isLoggedIn",
        ]),
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
