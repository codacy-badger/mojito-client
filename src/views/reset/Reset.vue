<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Reset Password</h2>
        </template>

        <b-form @submit.prevent="onSubmit(currentPassword, newPassword, confirmPassword)" v-if="!passwordReset">
            <b-form-group
                label="Current Password">
                <b-form-input
                    v-model="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    autocomplete="off"
                    required
                    :disabled="loading"/>
            </b-form-group>
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
            <center class="mt-4" v-if="loading">
                <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
                <p>
                    Resetting your password...
                </p>
            </center>
        </b-form>

        <center v-else>
            <p>
                Your password has been reset!<br><br>
                <a href="/home">Click here</a> to return to the home page.
            </p>
        </center>

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
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            score: 0,
            suggestions: null,
            warning: "",
            validateError: "",
            passwordReset: false,
        };
    },

    computed: {
        ...mapState({
            error: (state) => state.user.error,
            loading: (state) => state.user.loading,
        }),
    },

    methods: {
        ...mapActions({
            reset: "reset",
        }),

        onSubmit(currentPassword, newPassword, confirmPassword) {

            this.validateError = "";

            if (newPassword === currentPassword) {
                this.validateError = "New and current passwords are the same";
                return;
            }

            if (newPassword !== confirmPassword) {
                this.validateError = "New password does not match confirm password";
                return;
            }

            if (this.score < 2) {
                this.validateError = "Your new password is not complex enough";
                return;
            }

            this.reset({
                currentPassword,
                newPassword,
            }).then(() => {
                this.passwordReset = true;
            }).catch(() => {});
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
