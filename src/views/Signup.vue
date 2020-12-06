<template>
    <b-card
        class="signup-form mt-4"
        bg-variant="dark"
        text-variant="light">

        <template slot="header">
            <h2>Sign Up</h2>
        </template>

        <b-form>
            <b-form-group
                label="Email">
                <b-form-input type="email" placeholder="Enter your email"/>
            </b-form-group>
            <b-form-group
                label="Password">
                <b-form-input type="password" placeholder="Enter your password"/>
            </b-form-group>
            <b-form-group
                label="Confirm Password">
                <b-form-input type="password" placeholder="Confirm your password"/>
            </b-form-group>
            <center>
                <b-button class="mt-2" variant="primary">Submit</b-button>
            </center>
        </b-form>
    </b-card>
</template>

<style scoped>
.signup-form {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}
</style>
