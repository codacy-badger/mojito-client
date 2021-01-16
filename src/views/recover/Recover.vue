<template>
    <b-card
        class="centered-form mt-4"
        bg-variant="light">
        <template slot="header">
            <h2>Recover Account</h2>
        </template>

        <b-form @submit.prevent="onSubmit(email)" v-if="!recoveryEmailSent">
            <p>
                Please enter your account email address. You will be sent a link
                to reset your password.
            </p>
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
                    Sending recovery email...
                </p>
            </center>
        </b-form>

        <center v-else>
            <p>
                Please check your email for a link to recover your account.
            </p>

            <b-button
                class="mt-2"
                variant="primary"
                @click="resend(email)"
                :disabled="loading">
                Resend Recovery Email
            </b-button>

            <div class="mt-4" v-if="loading">
                <b-spinner variant="primary" label="Spinning"></b-spinner><br><br>
                <p>
                    Resending recovery email...
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
import { mapActions, mapState } from "vuex";

export default {
    name: "recover",

    data() {
        return {
            email: "",
            recoveryEmailSent: false,
        }
    },

    computed: {
        ...mapState({
            error: state => state.user.error,
            loading: state => state.user.loading,
        }),
    },

    methods: {
        ...mapActions({
            recover: "recover",
        }),

        onSubmit(email) {
            this.recover({
                email,
            }).then(() => {
                this.recoveryEmailSent = true;
            }).catch(() => {});
        },

        resend(email) {
            this.recover({
                email,
            }).then(() => {
                this.$bvToast.toast(`Recovery email resent to ${email}`, {
                    title: "Success!",
                    variant: "success",
                    autoHideDelay: 5000,
                });
            }).catch(() => {});
        },

    },
}
</script>
