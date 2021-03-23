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
	Chart.scaleService.updateScaleDefaults('linear', {
		ticks: {
			min: 0
		}
	});


	export default {
		props:['hovering', 'height', 'dataArr', 'noAnimations', 'secondary'],
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
				var color0 = style.getPropertyValue('--graph-line-0');
				var color1 = style.getPropertyValue('--graph-line-1');
				var color2 = style.getPropertyValue('--graph-line-mine');

				var gradientStroke = this.$refs.graph.getContext("2d").createLinearGradient(500, 0, 100, 0);
				gradientStroke.addColorStop(0, color1);
				gradientStroke.addColorStop(1, color0);

				const data = this.dataArr || [10, 180, 20, 100, 50, 120, 80, 123, 148, 180, 160, 210, 190, 250, 280, 210, 320, 390, 450, 500, 290, 390, 412];
				this.chart = new Chart(this.$refs.graph, {
					type: 'line',
					data: {
						labels: data.map(x => null),
						datasets:[{
							data,
							lineTension: 0.4,
							fill: false,
							borderColor: this.secondary ? color2 : gradientStroke,
							backgroundColor: 'transparent',
							spanGaps: false,
							pointRadius:0,
							borderWidth:this.secondary ? 2 : 5,
						}]
					},
					options: {
						animation: {
							duration: this.noAnimations ? 0 : 800
						},
						responsive: true,
						maintainAspectRatio: false,
						layout: {
							padding: {
								left:-10,
								right:-10,
								top:0,
								bottom:0,
							}
						},
						scales: {
							yAxes: [{
								stacked: true,
								ticks: {
									display: false,

									beginAtZero: true,
									scaleBeginAtZero: true
								},
								gridLines: {
									display:false
								}
							}],
							xAxes: [{
								stacked: true,
								ticks: {
									display: false,

									beginAtZero: true,
									scaleBeginAtZero: true
								},
								gridLines: {
									display:false
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
