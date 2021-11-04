<template>
  <div>
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import planetChartData from "@/assets/planet-data.js";
export default {
  name: "LineChart",
  data() {
    return {
        planetChartData: planetChartData
    };
  },
  mounted() {
      const ctx = document.getElementById('line-chart');
      new Chart(ctx, this.planetChartData)
  }
};
</script>

<style scoped>
</style>