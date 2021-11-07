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
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      stock: "",
      nameLimit: 60,
      isLoading: false,
      search: null,
      stockSymbols: [],
    };
  },
  mounted() {
    this.stock = this.$store.getters.getCurrentStock;
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
    updateSearchInput() {
      if (this.stock != null && this.stock != "") {
        this.$store.commit("setSearchInput", this.stock);
        this.goSearchResultView();
      }
    },
    goSearchResultView() {
      this.$router.push({
        name: "Result",
        query: { symbol: this.stock, period: "TIME_SERIES_DAILY" },
      });
    },
  },
};
</script>

<style scoped>
</style>