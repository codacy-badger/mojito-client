<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Verify Account</h2>
        </template>

        <center v-if="loading">
            <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
            <p>
                Verifying your email address...
            </p>
        </center>

        <center v-else-if="verificationFailed">
            <p>
                Failed to verify your email address, please try again later.
            </p>
        </center>

        <center v-else>
            <p>
                Your email has been verified! You may now log in to your account.<br><br>
                <a href="/login">Click here</a> to return to the login page.
            </p>
        </center>

        <b-alert
            class="error-text mt-4"
            show
            variant="danger"
            v-if="validateError"
            v-text="validateError"/>

        <b-alert
            class="error-text mt-4"
            show
            variant="danger"
            v-if="error"
            v-text="error"/>

    </b-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "signup-verify",

    data() {
        return {
            validateError: "",
            verificationFailed: false,
        };
    },

    computed: {
        ...mapState({
            error: (state) => state.user.error,
            loading: (state) => state.user.loading,
        }),
    },

    mounted() {
        this.$nextTick(function () {
            if (!this.$route.query.token) {
                this.validateError = "verification token not found";
                this.verificationFailed = true;
                return;
            }

            this.signupVerify({
                token: this.$route.query.token,
            }).then(() => {}).catch(() => {
                this.verificationFailed = true;
            });
        });
    },

    methods: {
        ...mapActions({
            signupVerify: "signupVerify",
        }),
    },
};
</script>
