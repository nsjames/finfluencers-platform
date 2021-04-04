<template>
	<section class="graph-item">
		<canvas ref="graph" :height="small ? 50 : 240"></canvas>
	</section>
</template>

<script>
	import Chart from 'chart.js';
	import {mapState} from "vuex";
	import formatNumber from "../util/formatNumber";

	// Chart.defaults.global.legend.display = false;
	// Chart.defaults.global.tooltips.enabled = false;
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;


	export default {
		props:['small', 'dataA', 'dataB', 'updater'],
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
				var lightLine = style.getPropertyValue('--light-line');
				var tickColor = style.getPropertyValue('--text-secondary');
				var color0 = style.getPropertyValue('--highlight');
				var color1 = style.getPropertyValue('--highlight-opaque');


				const data = this.dataA;
				// const data = this.dataA || [20, 23, 40, 353, 2658, 2350, 2350, 5943, 4904, 3240, 5905, 6090, 7094, 5960];
				const dataSet1 = {
					data,
					lineTension: 0,
					fill: false,
					backgroundColor:color1,
					borderColor: this.small ? color1 : color0,
					spanGaps: true,
					pointRadius:this.small ? 0 : 2,
					pointHoverRadius:this.small ? 0 : 10,
					pointHitRadius:this.small ? 0 : 10,
					borderWidth:this.small ? 2 : 1,
					hoverBackgroundColor:color0,
				};
				const dataSet2 = this.dataB ? {
					data:this.dataB,
					lineTension: 0,
					fill: false,
					borderColor: color1,
					backgroundColor: 'transparent',
					spanGaps: true,
					pointRadius:0,
					borderWidth:2,
				} : null;
				this.chart = new Chart(this.$refs.graph, {
					type: 'line',
					data: {
						labels: data.map(x => null),
						datasets:[dataSet1, dataSet2].filter(x => !!x)
					},
					options: {
						legend:{
							display:false,
						},
						tooltips:{
							enabled:false,
							axis:'y',
							custom:(tooltip) => {
								if(!tooltip.dataPoints) return this.$emit('tooltip', null);
								this.$emit('tooltip', tooltip);
							},
						},
						animation: {
							duration: 800
						},
						responsive: true,
						maintainAspectRatio: false,
						layout: {
							padding: {
								left:-20,
								right:0,
								top:this.small ? 0 : 40,
								bottom:0,
							}
						},
						scales: {

							beginAtZero: false,
							scaleBeginAtZero: false,
							yAxes: [{
								ticks: {
									display: !this.small,
									fontColor:tickColor,
									callback: (label, index, labels) => {
										return '';
									},
									autoSkip: true,
									maxTicksLimit: 5,
									minTicksLimit: 5,
								},
								gridLines: {
									display:!this.small,
									drawTicks:false,
									color:lightLine,
									zeroLineColor: color1,
									drawBorder: false,
								}
							}],
							xAxes: [{
								ticks: {
									display: false,
								},
								gridLines: {
									display:false,
									color:lightLine,
									zeroLineColor: lightLine,
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
						this.chart.data.datasets[0].data = this.dataA;

						this.chart.update();
					}, 500);
				}
			},
		},
		watch:{
			'theme'(){
				this.setGraph();
			},
			'height'(){
				this.setGraph();
			},
			'updater'(){
				this.updateGraph();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.graph-item {
		position: relative;

		.graph {
			position: relative;
			z-index:1;
		}
	}

</style>
