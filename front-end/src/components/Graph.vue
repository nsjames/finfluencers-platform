<template>
	<section class="graph-item">
		<canvas ref="graph" :height="height"></canvas>
	</section>
</template>

<script>
	import Chart from 'chart.js';
	import {mapState} from "vuex";

	Chart.defaults.global.legend.display = false;
	Chart.defaults.global.tooltips.enabled = false;
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;


	export default {
		props:['hovering', 'height', 'dataArr', 'secondary', 'dataArrSecondary', 'ticks', 'labels'],
		data(){return {
			chart:null,
			graphSet:false,
		}},
		computed:{
			...mapState([
				'theme'
			])
		},
		mounted(){
			setTimeout(() => {
				this.setGraph();
			}, 1);
		},
		methods:{
			async setGraph(){
				var style = getComputedStyle(document.body);
				var tickColor = style.getPropertyValue('--text-secondary');
				var color0 = style.getPropertyValue('--graph-line-0');
				var color1 = style.getPropertyValue('--graph-line-1');
				var color2 = style.getPropertyValue('--graph-line-mine');

				var gradientStroke = this.$refs.graph.getContext("2d").createLinearGradient(500, 0, 100, 0);
				gradientStroke.addColorStop(0, color1);
				gradientStroke.addColorStop(1, color0);

				const data = this.dataArr || [10, 180, 20, 100, 50, 120, 80, 123, 148, 180, 160, 210, 190, 250, 280, 210, 320, 390, 450, 500, 290, 390, 412];

				const both = data.concat(this.dataArrSecondary ? this.dataArrSecondary : []);
				let highest = both.sort()[both.length-1];
				let lowest = both.sort()[0];

				const dataSet1 = {
					data,
					lineTension: 0.4,
					fill: false,
					borderColor: this.secondary ? color2 : gradientStroke,
					backgroundColor: 'transparent',
					spanGaps: true,
					pointRadius:0,
					borderWidth:5,
					borderDash:this.secondary ? [5,2] : null
				};
				const dataSet2 = this.dataArrSecondary ? {
					data:this.dataArrSecondary,
					lineTension: 0.4,
					fill: false,
					borderColor: color2,
					backgroundColor: 'transparent',
					spanGaps: true,
					pointRadius:0,
					borderWidth:5,
					borderDash:[6,4]
				} : null;
				this.chart = new Chart(this.$refs.graph, {
					type: 'line',
					data: {
						labels: this.labels ? this.labels : data.map(x => null),
						datasets:[dataSet1, dataSet2].filter(x => !!x)
					},
					options: {
						animation: {
							duration: 0
						},
						responsive: true,
						maintainAspectRatio: false,
						layout: {
							padding: {
								left:-10,
								right:0,
								top:0,
								bottom:0,
							}
						},
						scales: {

							beginAtZero: false,
							scaleBeginAtZero: false,
							yAxes: [{
								ticks: {
									display: !!this.ticks,
									fontColor:tickColor,
									beginAtZero: false,
								},
								gridLines: {
									display:false
								}
							}],
							xAxes: [{
								ticks: {
									display: !!this.labels,
									fontColor:tickColor,

									beginAtZero: false,
									scaleBeginAtZero: false
								},
								gridLines: {
									display:false,
								}
							}],
						}
					}
				});
				await new Promise(r => setTimeout(r, 500));
				this.graphSet = true;
			},
			updateGraph(){
				if(this.chart && this.graphSet) {
					setTimeout(() => {
						this.chart.data.datasets[0].data = this.dataArr;

						this.chart.update();
					}, 500);
				}
			},
		},
		watch:{
			'hovering'(){
				this.setGraph();
			},
			'theme'(){
				this.setGraph();
			},
			'height'(){
				this.setGraph();
			},
			'dataArr'(){
				this.updateGraph();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.graph-item {

		canvas {

		}
	}

</style>
