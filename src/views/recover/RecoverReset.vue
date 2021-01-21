<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Create a New Password</h2>
        </template>

        <b-form @submit.prevent="onSubmit(newPassword, confirmPassword)" v-if="!accountRecovered && !recoveryFailed">
            <p>
                To complete the account recovery process, please enter your new
                password.
            </p>
            <b-form-group
                label="New Password">
                <b-form-input
                    v-model="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    autocomplete="off"
                    required
                    :disabled="loading"/>
                <password
                    v-model="newPassword"
                    :strength-meter-only="true"
                    @feedback="showFeedback"
                    @score="setScore"/>
                <ul v-if="newPassword && newPassword.length > 3 && suggestions && suggestions.length > 0">
                    <li v-for="suggestion in suggestions" :key="suggestion">
                        {{suggestion}}
                    </li>
                </ul>
                <b-alert
                    class="error-text"
                    show
                    variant="warning"
                    v-if="warning"
                    v-text="warning"/>
            </b-form-group>
            <b-form-group
                label="Confirm New Password">
                <b-form-input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    autocomplete="off"
                    required
                    :disabled="loading"/>
            </b-form-group>
            <b-alert
                class="error-text mt-4"
                show
                variant="danger"
                v-if="validateError"
                v-text="validateError"/>
            <center>
                <b-button
                    class="mt-2"
                    variant="primary"
                    type="submit"
                    :disabled="loading">
                    Submit
                </b-button>
            </center>
        </b-form>

        <center v-else-if="recoveryFailed">
            <p>
                Failed to recovery your account, please try again later.
            </p>
        </center>

        <center v-else>
            <p>
                Your account has been recovered! You may now log in to your account.<br><br>
                <a href="/login">Click here</a> to return to the login page.
            </p>
        </center>

        <b-alert
            class="error-text mt-4"
            show
            variant="danger"
            v-if="validateError && recoveryFailed"
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
import Password from "vue-password-strength-meter";

import { mapActions, mapState } from "vuex";

export default {
    name: "reset",

    components: {
        Password,
    },

    data() {
        return {
            newPassword: "",
            confirmPassword: "",
            score: 0,
            suggestions: null,
            warning: "",
            validateError: "",
            accountRecovered: false,
            recoveryFailed: false,
        };
    },

    computed: {
        ...mapState({
            error: (state) => state.user.error,
            loading: (state) => state.user.loading,
        }),
    },

    mounted() {
        if (!this.$route.query.token) {
            this.validateError = "recovery token not found";
            this.recoveryFailed = true;
            return;
        }
    },

    methods: {
        ...mapActions({
            recoverReset: "recoverReset",
        }),

        onSubmit(newPassword, confirmPassword) {

            this.validateError = "";

            if (newPassword !== confirmPassword) {
                this.validateError = "New password does not match confirm password";
                return;
            }

            if (this.score < 2) {
                this.validateError = "Your new password is not complex enough";
                return;
            }

            this.recoverReset({
                token: this.$route.query.token,
                password: newPassword,
            }).then(() => {
                this.accountRecovered = true;
            }).catch(() => {
                this.recoveryFailed = true;
            });
        },

        showFeedback ({suggestions, warning}) {
            this.suggestions = suggestions;
            this.warning = warning;
        },

        setScore(score) {
            this.score = score;
        },
    },
};
</script>
