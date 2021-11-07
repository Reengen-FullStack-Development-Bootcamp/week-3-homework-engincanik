import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentStock: "",
        searchInput: "",
        stockData: "",
        timeSelection: "TIME_SERIES_DAILY",
    },
    mutations: {
        setCurrentStock(state, payload)
        {
            state.currentStock = payload;
        },
        setSearchInput(state, payload)
        {
            state.searchInput = payload;
        },
        setStockData(state, payload)
        {
            state.stockData = payload;
        },
        setTimeSelection(state, payload)
        {
            state.timeSelection = payload;
        },
    },
    actions: {
        getSelectedStock(context)
        {
            console.log("NO PARAMS");
            axios
                .get("https://www.alphavantage.co/query", {
                    params: {
                        function: context.state.timeSelection,
                        symbol: context.state.searchInput,
                        apikey: "DVSM9MPECXXYFVXQ",
                    },
                })
                .then((response) =>
                {
                    console.log(response)
                    context.commit("setStockData", response);
                })
                .catch((error) => console.log(error));
        },
        getSelectedStockWithParameter(context, params)
        {
            console.log("WITH PARAMS");
            axios
                .get("https://www.alphavantage.co/query", {
                    params: {
                        function: params.period,
                        symbol: params.selectedSymbol,
                        apikey: "DVSM9MPECXXYFVXQ",
                    },
                })
                .then((response) =>
                {
                    console.log(response)
                    context.commit("setStockData", response);
                })
                .catch((error) => console.log(error));
        },
    },
    modules: {},
    getters: {
        getCurrentStock: (state) => state.currentStock,
        getTimeSelection: (state) => state.timeSelection
    },
});
