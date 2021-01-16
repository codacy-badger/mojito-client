<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Log In</h2>
        </template>

        <b-form @submit.prevent="onSubmit(email, password)">
            <b-form-group label="Email">
                <b-form-input
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    autocomplete="on"
                    required
                    :disabled="loading"/>
            </b-form-group>
            <b-form-group label="Password">
                <b-form-input
                    v-model="password"
                    type="password"
                    placeholder="Enter your password"
                    autocomplete="on"
                    required
                    :disabled="loading"/>
            </b-form-group>
            <center>
                <b-button
                    class="mt-2"
                    variant="primary"
                    type="submit"
                    :disabled="loading">
                    Submit
                </b-button>
            </center>
            <center class="mt-4" v-if="loading">
                <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
                <p>
                    Logging you in...
                </p>
            </center>
        </b-form>

        <b-alert
            class="error-text mt-4"
            show
            variant="danger"
            v-if="error"
            v-text="error"/>

        <template slot="footer">
            <center>
                <div class="mb-2">
                    Don't have an account?
                    <a href="/signup">Sign up</a>
                </div>
                <div>
                    <a href="/recover">Forgot your password?</a>
                </div>
            </center>
        </template>

    </b-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
    name: "login",

    data() {
        return {
            email: "",
            password: "",
        };
    },

    computed: {
        ...mapState({
            error: state => state.user.error,
            loading: state => state.user.loading,
        }),
    },

    created() {
        this.logout();
    },

    methods: {
        ...mapActions({
            login: "login",
            logout: "logout",
        }),

        onSubmit(email, password) {
            this.login({
                email,
                password,
            }).then(() => {
                this.$router.push({ name: "home" });
            }).catch(() => {});
        },
    },
}
</script>
