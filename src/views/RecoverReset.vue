<template>
    <b-card
        class="recover-reset-form mt-4"
        bg-variant="dark"
        text-variant="light">

        <template slot="header">
            <h2>Create a New Password</h2>
        </template>

        <p>
            To complete the account recovery process, please enter your new
            password.
        </p>

        <b-form>
            <b-form-group
                label="New Password">
                <b-form-input type="password" placeholder="Enter your new password"/>
            </b-form-group>
            <b-form-group
                label="Confirm New Password">
                <b-form-input type="password" placeholder="Confirm your new password"/>
            </b-form-group>
            <center>
                <b-button class="mt-2" variant="primary">Submit</b-button>
            </center>
        </b-form>
    </b-card>
</template>

<style scoped>
.recover-reset-form {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>
