<template>
    <b-card
        class="section"
        bg-variant="light">
        <b-form @submit.prevent="onSubmit()">
            <b-form-group
                label="Exchange"
                placeholder="Select an exchange"
                required
                :disabled="loading">
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
                    :disabled="!selectedExchange || loading"
                ></b-form-select>
            </b-form-group>
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

        <div v-if="chartData">
            <hr ref="chartRule">
            <div class="chart-container">
                <trading-vue
                    :data="chartData"
                    :width="chartData.width-3"
                    :color-back="chartData.colors.background"
                    :color-grid="chartData.colors.grid"
                    :color-text="chartData.colors.text"
                ></trading-vue>
            </div>
        </div>

        <b-alert
            class="error-text mt-4"
            show
            variant="danger"
            v-if="error"
            v-text="error"/>
    </b-card>
</template>

<script>
import TradingVue from "trading-vue-js";

import { mapState, mapGetters, mapActions } from "vuex";

export default {
    name: "chart",

    components: {
        TradingVue,
    },

    data() {
        return {
            chartData: null,
            selectedExchange: null,
            selectedTicker: null,
            validateError: "",
        };
    },

    computed: {
        ...mapState({
            candlesticks: (state) => state.candlestick.candlesticks,
            error: (state) => state.candlestick.error,
            loading: (state) => state.candlestick.loading,
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
        window.addEventListener("resize", this.onResize);
        this.loadCandlestickSpec();

        window.setInterval(() => {
            this.updateCandlesticks()
        }, 60000)
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },

    methods: {
        ...mapActions({
            loadCandlestickSpec: "loadCandlestickSpec",
            loadCandlesticks: "loadCandlesticks",
        }),

        onResize() {
            if (this.$refs.chartRule && this.chartData) {
                this.chartData.width = this.$refs.chartRule.clientWidth;
            }
        },

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
                this.updateChart(this.selectedExchange, this.selectedTicker);
            }).catch(() => {});
        },

        updateCandlesticks() {
            if (!this.chartData || !this.chartData.exchange || !this.chartData.ticker ) {
                return;
            }

            let exchange = this.chartData.exchange;
            let ticker = this.chartData.ticker;

            this.loadCandlesticks({
                exchange,
                ticker,
            }).then(() => {
                this.updateChart(exchange, ticker);
            }).catch(() => {});
        },

        updateChart(exchange, ticker) {
            this.chart = null;

            if (!this.candlesticks) {
                return;
            }

            let data = [];

            this.candlesticks.forEach(function (item) {
                data.push([
                    Date.parse(item.created_at),
                    item.open,
                    item.high,
                    item.low,
                    item.close,
                    item.volume,
                ]);
            });

            if (data.length === 0) {
                this.validateError = "No price data found for this ticker.";
                return;
            }

            this.chartData = {
                exchange,
                ticker,
                width: 0,
                chart: {
                    name: `${exchange} - ${ticker}`,
                    type: "Candles",
                    data,
                },
                colors: {
                    background: "#fff",
                    grid: "#eee",
                    text: "#333",
                },
            };

            this.$nextTick(function () {
                this.onResize();
            });
        },
    },
};
</script>

<style scoped>
.section {
    margin: 1.5%;
}

.chart-container {
    border: 1px solid black;
}
</style>