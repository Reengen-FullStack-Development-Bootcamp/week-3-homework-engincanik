<template>
	<div>
		<v-overlay :value="overlayStateChange">
			<v-progress-circular indeterminate size="64"></v-progress-circular>
		</v-overlay>
		<div class="chart" ref="chart"></div>
	</div>
</template>

<script>
import * as d3 from "d3";
export default {
	name: "CandlestickChart",
	computed: {
		formattedStockData() {
			let dataArray = [];
			if (this.$store.state.stockData) {
				let time = "";
				switch (this.$store.state.timeSelection) {
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
				const jsonArray = JSON.parse(
					JSON.stringify(this.$store.state.stockData)
				)["data"][time];
				for (let data in jsonArray) {
					let newObject = {
						Date: data,
						Open: jsonArray[data]["1. open"],
						High: jsonArray[data]["2. high"],
						Low: jsonArray[data]["3. low"],
						Close: jsonArray[data]["4. close"],
						Volume: jsonArray[data]["5. volume"],
					};
					dataArray.push(newObject);
				}
			}
			return dataArray.splice(0, 30).reverse();
		},
		overlayStateChange() {
			if (this.formattedStockData.length === 0) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		setChart() {
			if (document.getElementById("chartsvg")) {
				const chartsvg = document.getElementById("chartsvg");
				this.$refs.chart.removeChild(chartsvg);
			}

			let margin = { top: 70, right: 50, bottom: 50, left: 50 };
			let padding = { top: 30, right: 70, bottom: 50, left: 70 };
			let width = 1000;
			let height = 400;
			let space = 10;
			let volWidth = width;
			let volHeight = 200;
			let candlesHeight = height + margin.top;
			let chartHeight = candlesHeight + space + volHeight;
			let chartWidth = width + padding.left + padding.right;
			let svgWidth = chartWidth + margin.left + margin.right;
			let svgHeight = chartHeight + margin.top + margin.bottom;
			let maxList = [];
			let minList = [];
			this.formattedStockData.forEach((item) => {
				maxList.push(Math.max(item["Open"], item["Close"], item["High"]));
				minList.push(Math.min(item["Open"], item["Close"], item["Low"]));
			});

			this.formattedStockData.map((data) => data["Volume"]);
			let max_value = Math.max(...maxList);
			let min_value = Math.min(...minList);
			let maxVol = Math.max(
				...this.formattedStockData.map((data) => data["Volume"])
			);
			let minVol = Math.min(
				...this.formattedStockData.map((data) => data["Volume"])
			);
			const svg = d3
				.select(this.$refs.chart)
				.append("svg")
				.attr("id", "chartsvg")
				.attr("width", svgWidth)
				.attr("height", svgHeight);
			svg
				.append("rect")
				.attr("width", chartWidth)
				.attr("height", chartHeight)
				.attr("rx", 7)
				.attr("ry", 7)
				.attr("fill", "white")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			const vol = svg
				.append("g")
				.attr("width", volWidth)
				.attr("height", volHeight)
				.attr(
					"transform",
					"translate(" +
						(margin.left + padding.left) +
						"," +
						(margin.top + candlesHeight + space) +
						")"
				);

			const base = svg
				.append("g")
				.attr("width", width)
				.attr("height", height)
				.attr(
					"transform",
					"translate(" +
						(margin.left + padding.left) +
						"," +
						(margin.top + padding.top) +
						")"
				);

			const x = d3
				.scaleBand()
				.domain(this.formattedStockData.map((d) => d["Date"]))
				.range([0, width]);
			base
				.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x))
				.selectAll("text")
				.attr("transform", "rotate(-25)")
				.style("text-anchor", "end");
			const y = d3
				.scaleLinear()
				.domain([min_value, max_value])
				.range([height, 0]);

			base.append("g").call(d3.axisLeft(y));

			base
				.selectAll("candles")
				.data(this.formattedStockData)
				.enter()
				.append("rect")
				.attr("x", function (d) {
					return x(d["Date"]);
				})
				.attr("y", function (d) {
					return y(d3.max([parseFloat(d["Open"]), parseFloat(d["Close"])]));
				})
				.attr("width", 10)
				.attr("height", function (d) {
					return Math.abs(y(d["Open"]) - y(d["Close"]));
				})
				.attr("rx", 3)
				.classed("rise", function (d) {
					return d["Close"] > d["Open"];
				})
				.classed("fall", function (d) {
					return d["Open"] > d["Close"];
				})
				.attr(
					"transform",
					"translate(" +
						(width / this.formattedStockData.length / 2 - 5.5) +
						")"
				);

			base
				.selectAll("sticks")
				.data(this.formattedStockData)
				.enter()
				.append("rect")
				.attr("x", function (d) {
					return x(d["Date"]);
				})
				.attr("y", function (d) {
					if (parseFloat(d["High"]) > parseFloat(d["Low"])) {
						return y(d["High"]);
					} else {
						return y(d["Low"]);
					}
				})
				.attr("width", 2)
				.attr("height", function (d) {
					return y(d["Low"]) - y(d["High"]);
				})
				.classed("rise", function (d) {
					return d["Close"] > d["Open"];
				})
				.classed("fall", function (d) {
					return d["Open"] > d["Close"];
				})
				.attr(
					"transform",
					"translate(" +
						(width / this.formattedStockData.length / 2 - 1.5) +
						")"
				);

			const vy = d3
				.scaleLinear()
				.domain([minVol, maxVol])
				.range([volHeight, 0]);

			vol
				.append("g")
				.call(d3.axisRight(vy))
				.attr("transform", "translate(" + volWidth + ")");
			vol
				.selectAll("volBars")
				.data(this.formattedStockData)
				.enter()
				.append("rect")
				.attr("x", function (d) {
					return x(d["Date"]);
				})
				.attr("y", function (d) {
					return vy(d["Volume"]);
				})
				.attr("width", x.bandwidth())
				.attr("height", function (d) {
					return volHeight - vy(d["Volume"]);
				})
				.attr("fill", "rgb(140, 153, 180");
		},
	},
	watch: {
		formattedStockData() {
			// while (this.$refs.chart.firstChild) {
			// 	this.$refs.chart.firstChild.remove();
			// }
			this.setChart();
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.container {
	position: relative;
}
.rise {
	fill: rgb(1, 120, 1);
}
.fall {
	fill: rgb(198, 0, 0);
}
.butons-enter-active {
	animation-delay: 0.5s;
	animation: toUp 1s ease-in-out;
}
@keyframes toUp {
	from {
		transform: translateY(200%);
		opacity: 0;
		z-index: -2;
	}
	to {
		transform: translateY(0);
		opacity: 1;
		z-index: 2;
	}
}
</style>