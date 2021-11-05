<template>
  <div class="align-center">
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
export default {
  name: "LineChart",
  props: {
    chartData: Object,
  },
  data() {
    return {
      chartState: false,
    };
  },
  mounted() {
    const ctx = document.getElementById("line-chart");
    new Chart(ctx, this.chartData);
  },
};
</script>

<style scoped>
</style>