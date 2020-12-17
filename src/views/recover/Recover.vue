<template>
    <b-card
        class="recover-form mt-4"
        bg-variant="light">

        <template slot="header">
            <h2>Recover Account</h2>
        </template>

        <p>
            Please enter your account email address. You will be sent a link
            to reset your password.
        </p>

        <b-form>
            <b-form-group
                label="Email">
                <b-form-input type="email" placeholder="Enter your email"/>
            </b-form-group>
            <center>
                <b-button class="mt-2" variant="primary">Submit</b-button>
            </center>
        </b-form>
    </b-card>
</template>

<style scoped>
.recover-form {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>
