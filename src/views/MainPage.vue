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
              @change="getSelectedStock('TIME_SERIES_DAILY')"
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
            @click="getSelectedStock('TIME_SERIES_DAILY')"
            value="TIME_SERIES_DAILY"
          >
            Daily
          </v-btn>

          <v-btn
            @click="getSelectedStock('TIME_SERIES_WEEKLY')"
            value="TIME_SERIES_WEEKLY"
          >
            Weekly
          </v-btn>

          <v-btn
            @click="getSelectedStock('TIME_SERIES_MONTHLY')"
            value="TIME_SERIES_MONTHLY"
          >
            Monthly
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <div id="chartSection">
        <chart
          :key="componentKey"
          v-if="isChartActive"
          :chartData="chartData"
        />
      </div>
    </v-card>
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";
import axios from "axios";

export default {
  components: { Chart },
  data() {
    return {
      stock: "",
      timeSelection: "TIME_SERIES_DAILY",
      nameLimit: 60,
      isChartActive: false,
      chartData: {},
      isLoading: false,
      search: null,
      stockSymbols: [],
      componentKey: 0,
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
    selected() {
      return this.stock;
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
    getSelectedStock(time) {
      if (this.stock != null && this.stock != "") {
        const _that = this;
        axios
          .get("https://www.alphavantage.co/query", {
            params: {
              function: time,
              symbol: this.stock,
              apikey: "DVSM9MPECXXYFVXQ",
            },
          })
          .then(function (response) {
            _that.getDataByTimeSelection(response);
          })
          .catch((error) => console.log(error));
      }
    },
    getDataByTimeSelection(response) {
      const labels = [];
      const values = [];
      let time = "";
      switch (this.timeSelection) {
        case "TIME_SERIES_DAILY":
          time = "Time Series (Daily)";
          break;
        case "TIME_SERIES_WEEKLY":
          time = "Weekly Time Series";
          break;
        case "TIME_SERIES_MONTHLY":
          time = "Monthly Time Series";
          break;
        default:
          time = "Time Series (Daily)";
          break;
      }
      for (
        let i = Object.keys(response.data[time]).length - 1;
        i > Object.keys(response.data[time]).length - 11;
        i--
      ) {
        labels.push(Object.keys(response.data[time]).reverse()[i]);
        values.push(
          Object.values(response.data[time]).reverse()[i]["4. close"]
        );
      }
      this.prepareChart(labels.reverse(), values.reverse());
    },
    prepareChart(labels, values) {
      this.chartData = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: this.stock,
              data: values,
              fill: false,
              backgroundColor: "rgba(54,73,93,.5)",
              borderColor: "#36495d",
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          lineTension: 1,
        },
      };
      this.isChartActive = true;
      this.componentKey += 1;
    },
  },
};
</script>

<style scoped>
</style>