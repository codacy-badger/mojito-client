<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Sign Up</h2>
        </template>

        <b-form @submit.prevent="onSubmit(email, password, confirmPassword)" v-if="!accountCreated">
            <b-form-group
                label="Email">
                <b-form-input
                    v-model="email"
                    type="email"
                    placeholder="Enter your email"
                    autocomplete="off"
                    required
                    :disabled="loading"/>
            </b-form-group>
            <b-form-group
                label="Password">
                <b-form-input
                    v-model="password"
                    type="password"
                    placeholder="Enter your password"
                    autocomplete="off"
                    required
                    :disabled="loading"/>
                <password
                    v-model="password"
                    :strength-meter-only="true"
                    @feedback="showFeedback"
                    @score="setScore"/>
                <ul v-if="password && password.length > 3 && suggestions && suggestions.length > 0">
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
                label="Confirm Password">
                <b-form-input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
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
                    Creating your account...
                </p>
            </center>
        </b-form>

        <center v-else>
            <p>
                Your account has been created! Please check your email to verify
                your account.
            </p>

            <b-button
                class="mt-2"
                variant="primary"
                @click="resend(email, password)"
                :disabled="loading">
                Resend Verification Email
            </b-button>

            <div class="mt-4" v-if="loading">
                <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
                <p>
                    Resending verification email...
                </p>
            </div>
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
    name: "signup",

    components: {
        Password,
    },

    data() {
        return {
            email: "",
            password: "",
            confirmPassword: "",
            score: 0,
            suggestions: null,
            warning: "",
            validateError: "",
            accountCreated: false,
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
            signup: "signup",
        }),

        onSubmit(email, password, confirmPassword) {

            this.validateError = "";

            if (password !== confirmPassword) {
                this.validateError = "Password does not match confirm password";
                return;
            }

            if (this.score < 2) {
                this.validateError = "Your password is not complex enough";
                return;
            }

            this.signup({
                email,
                password,
            }).then(() => {
                this.accountCreated = true;
            }).catch(() => {});
        },

        resend(email, password) {
            this.signup({
                email,
                password,
            }).then(() => {
                this.$bvToast.toast(`Verification email resent to ${email}`, {
                    title: "Success!",
                    variant: "success",
                    autoHideDelay: 5000,
                });
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
