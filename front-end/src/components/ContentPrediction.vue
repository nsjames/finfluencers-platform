<template>
	<section class="content-prediction">

		<section class="details">
			<Asset :symbol="prediction.asset.symbol" />
			<section class="info">
				<figure class="asset">{{prediction.asset.symbol}}</figure>
				<figure class="price">${{formatNumber(prediction.price)}}</figure>
				<figure class="duration">{{duration}} day prediction ({{new Date(prediction.date).toLocaleDateString()}})</figure>
			</section>
		</section>

		<!--<section class="graphs" :style="{'height':`${fullSize ? 120 : 50}px`}" v-if="graphData.length">-->
			<!--<Graph class="graph" :height="fullSize ? 120 : 50" :data-arr="graphData" :data-arr-secondary="setPrice"  />-->
		<!--</section>-->

	</section>
</template>

<script>
	import Portfolio from '../components/ContentPortfolio';

	export default {
		props:['prediction', 'createdAt', 'fullSize'],
		components:{
			Portfolio
		},
		computed:{
			duration(){
				const date1 = new Date(this.createdAt);
				const date2 = new Date(this.prediction.date);
				return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
			},
			rawGraphData(){
				if(this.prediction.historical_prices.length === 1){
					return [this.prediction.historical_prices[0], this.prediction.historical_prices[0]];
				}
				return this.prediction.historical_prices;
			},
			graphData(){
				return this.rawGraphData.map(x => x.price);
			},
			labels(){
				return this.rawGraphData.map(x => new Date(x.date).toLocaleString().split(',')[0])
			},
			setPrice(){
				return [...Array(this.graphData.length).keys()].map(() => parseFloat(this.prediction.price));
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.content-prediction {
		position: relative;
		z-index:1;

		.graphs {
			position: relative;
			height:40px;
			z-index:1;
			padding:10px;
			border-radius:var(--radius);
			margin-bottom:20px;

			.graph {
				position:absolute;
				top:0;
				bottom:0;
				left:-10px;
				right:0;

				&:first-child {
					z-index:2;
				}
			}
		}

		.details {
			display:flex;
			align-items: center;
			margin-bottom:20px;
			position: relative;
			z-index:2;

			.info {
				margin-left:20px;

				.asset, .price {
					display:inline-block;
					font-size: 20px;
					font-family: var(--secondary-font);
					color:var(--text-primary);
				}

				.price {
					color:var(--highlight);
					font-weight: bold;
					margin-left:10px;
				}

				.asset {
					font-weight: bold;
				}

				.duration {
					color:var(--text-secondary);
					font-size: 14px;
					margin-top:3px;
				}
			}
		}
	}
</style>
