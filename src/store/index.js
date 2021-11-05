import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentStock: "",
    },
    mutations: {
        //Sync
        setCurrentStock(state, payload) {
            state.currentStock = payload;
        },
    },
    actions: {
        //Async
        // setCurrentStock(state, payload) {
        //     const stock = 
        // }
    },
    modules: {},
    getters: {
        getCurrentStock: (state) => state.currentStock,
    },
});
