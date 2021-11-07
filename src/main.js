import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store/index";

Vue.config.productionTip = false;

router.beforeEach((to,from,next)=>{
    let obj = new Object({
      id:store.state.logCount,
      name:`User Role: ${store.state.userRole} - redirect - ${new Date().toUTCString()}`,
      from:from.fullPath,
      to:to.fullPath
    })
    localStorage.setItem(`Log: ${store.state.logCount}`,JSON.stringify(obj))
    store.state.logCount++
  
    next()
  })

new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
