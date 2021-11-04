<template>
  <div>
    <v-card rounded="xl">
      <v-card-title class="justify-center"> Stock Market </v-card-title>
      <chart/>
    </v-card>
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";
export default {
  components: { Chart },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>