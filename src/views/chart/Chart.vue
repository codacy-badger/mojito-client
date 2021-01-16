<template>
    <b-card
        class="section"
        bg-variant="light">
        <b-form @submit.prevent="onSubmit()">
            <b-form-group
                label="Exchange"
                placeholder="Select an exchange"
                required>
                <b-form-select
                    v-model="selectedExchange"
                    :options="exchangeOptions"
                ></b-form-select>
            </b-form-group>
            <b-form-group
                label="Ticker"
                placeholder="Select a ticker"
                required>
                <b-form-select
                    v-model="selectedTicker"
                    :options="tickerOptions"
                    :disabled="!selectedExchange"
                ></b-form-select>
            </b-form-group>
            <hr>
            <b-alert
                class="error-text mt-4"
                show
                variant="danger"
                v-if="validateError"
                v-text="validateError"/>
            <b-button
                class="mt-2"
                variant="primary"
                type="submit"
                :disabled="loading">
                Update
            </b-button>
        </b-form>

        <b-alert
            class="error-text mt-4"
            show
            variant="danger"
            v-if="error"
            v-text="error"/>
    </b-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    name: "chart",

    data() {
        return {
            selectedExchange: null,
            selectedTicker: null,
            validateError: "",
        };
    },

    computed: {
        ...mapState({
            candlesticks: state => state.candlestick.candlesticks,
            error: state => state.candlestick.error,
            loading: state => state.candlestick.loading,
        }),

        ...mapGetters([
            "getExchanges",
            "getTickers",
        ]),

        exchangeOptions() {
            let options = [
                { value: null, text: "Please select an exchange." },
            ];

            if (!this.getExchanges) {
                return options;
            }

            this.getExchanges.forEach(function (item) {
                options.push({ value: item.id, text: item.name });
            });

            return options;
        },

        tickerOptions() {
            let options = [
                { value: null, text: "Please select a ticker." },
            ];

            if (!this.selectedExchange || !this.getTickers(this.selectedExchange)) {
                return options;
            }

            this.getTickers(this.selectedExchange).forEach(function (item) {
                options.push({ value: item.id, text: item.name });
            });

            return options;
        },
    },

    watch: {
        selectedExchange() {
            this.selectedTicker = null;
        },
    },

    mounted() {
        this.loadCandlestickSpec();
    },

    methods: {
        ...mapActions({
            loadCandlestickSpec: "loadCandlestickSpec",
            loadCandlesticks: "loadCandlesticks",
        }),

        onSubmit() {

            this.validateError = "";

            if (!this.selectedExchange) {
                this.validateError = "You must select an exchange.";
                return;
            }

            if (!this.selectedTicker) {
                this.validateError = "You must select a ticker.";
                return;
            }

            this.loadCandlesticks({
                exchange: this.selectedExchange,
                ticker: this.selectedTicker,
            }).then(() => {
                this.updateCharts();
            }).catch(() => {});
        },

        updateCharts() {
            // TODO: build charts from candlestick data
        },
    },
}
</script>

<style scoped>
.section {
    margin: 1.5%;
}
</style>