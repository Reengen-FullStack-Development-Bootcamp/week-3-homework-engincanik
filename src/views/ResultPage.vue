<template>
	<div>
		<v-card rounded="xl">
			<v-row class="justify-center">
				<v-col cols="6">
					<div>
						<v-autocomplete
							v-model="stock"
							:items="stocks"
							:loading="isLoading"
							@change="updateSearchInput()"
							filled
							rounded
							hide-no-data
							label="Stock Symbols"
							placeholder="Search Stocks"
							:search-input.sync="search"
						></v-autocomplete>
					</div>
				</v-col>
			</v-row>
			<v-row class="ma-0 justify-center">
				<v-btn-toggle
					v-model="timeSelection"
					tile
					mandatory
					color="black accent-3"
					group
				>
					<v-btn
						@click="updateTimeSelection('TIME_SERIES_DAILY')"
						value="TIME_SERIES_DAILY"
					>
						Daily
					</v-btn>

					<v-btn
						@click="updateTimeSelection('TIME_SERIES_WEEKLY')"
						value="TIME_SERIES_WEEKLY"
					>
						Weekly
					</v-btn>

					<v-btn
						@click="updateTimeSelection('TIME_SERIES_MONTHLY')"
						value="TIME_SERIES_MONTHLY"
					>
						Monthly
					</v-btn>
				</v-btn-toggle>
			</v-row>
			<div class="d-flex justify-center">
				<candlestick class="chart" />
			</div>
		</v-card>
	</div>
</template>

<script>
import Candlestick from "../components/Candlestick.vue";
import axios from "axios";
export default {
	components: { Candlestick },
	data() {
		return {
			stock: "",
			timeSelection: "TIME_SERIES_DAILY",
			nameLimit: 60,
			isLoading: false,
			search: null,
			stockSymbols: [],
			componentKey: 0,
		};
	},
	computed: {
		stocks() {
			if (this.search != null && this.search != "") {
				return this.stockSymbols.map((entry) => {
					const Symbol =
						entry["1. symbol"].length > this.nameLimit
							? entry["1. symbol"].slice(0, this.nameLimit) + "..."
							: entry["1. symbol"];
					return Symbol;
				});
			} else {
				return [];
			}
		},
	},
	watch: {
		search() {
			if (this.isLoading) return;
			if (this.search != null && this.search != "") {
				this.isLoading = true;
				axios
					.get("https://www.alphavantage.co/query", {
						params: {
							function: "SYMBOL_SEARCH",
							keywords: this.search,
							apikey: "DVSM9MPECXXYFVXQ",
						},
					})
					.then((response) => {
						this.stockSymbols = response.data.bestMatches;
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {
						this.isLoading = false;
					});
			}
		},
	},
	methods: {
		updateTimeSelection(time) {
			this.$store.commit("setTimeSelection", time);
			if (!this.stock) {
				this.$store.commit("setSearchInput", this.$route.query.symbol);
			} else if (this.stock) {
				this.$store.commit("setSearchInput", this.stock);
			}
			this.$store.commit("setTimeSelection", time);
			this.goSearchResultView();
		},
		updateSearchInput() {
			if (this.stock != null && this.stock != "") {
				this.$store.commit("setSearchInput", this.stock);
				this.$store.commit("setTimeSelection", "TIME_SERIES_DAILY");
				this.$store.dispatch("getSelectedStock");
				this.timeSelection = "TIME_SERIES_DAILY";
				this.$router.push({
					name: "Result",
					query: {
						symbol: this.stock,
						period: "TIME_SERIES_DAILY",
					},
				});
			}
		},
		goSearchResultView() {
			console.log(this.$store.getters.getTimeSelection);
			this.$store.dispatch("getSelectedStock");
			this.$router.push({
				name: "Result",
				query: {
					symbol: this.$route.query.symbol,
					period: this.$store.getters.getTimeSelection,
				},
			});
		},
	},
	created() {
		this.$store.commit("setSearchInput", this.$route.query.symbol);
		this.$store.commit("setTimeSelection", this.$route.query.period);
		this.timeSelection = this.$route.query.period;
		this.$store.dispatch("getSelectedStock");
	},
};
</script>

<style></style>
