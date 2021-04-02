<template>
	<section class="post-portfolio">

		<section class="totals">
			<span>{{pnlToPrediction}}%</span>
			<span>Predicted outcome</span>
			<section class="legend">
				<span class="line-1"><i></i> Prediction</span>
				<span class="line-2"><i></i> {{prediction.asset.symbol}}</span>
			</section>
		</section>
		<section class="graphs">
			<Graph class="graph" :height="80" :data-arr="graphData" :data-arr-secondary="setPrice"  />
		</section>
		<section class="details" v-if="!isComplete">
			<!-- Only show if there is rounding on the number -->
			<section class="desktop-only" v-if="prediction.price > 999">
				<span>Prediction</span>
				<span>{{formatPrice(prediction.price)}}</span>
			</section>
			<section class="desktop-only">
				<span>Starting price</span>
				<span>{{formatPrice(priceAtStart)}}</span>
			</section>
			<section>
				<span>Current price</span>
				<span>{{formatPrice(priceAtEnd)}}</span>
			</section>
			<section>
				<span>Current outcome</span>
				<span>{{pnl}}%</span>
			</section>
		</section>
		<section class="details" v-if="isComplete">
			<section class="desktop-only">
				<span>Starting price</span>
				<span>{{formatPrice(priceAtStart)}}</span>
			</section>
			<section class="desktop-only">
				<span>Final price</span>
				<span>{{formatPrice(priceAtEnd)}}</span>
			</section>
			<section>
				<span>Final outcome</span>
				<span>{{pnl}}%</span>
			</section>
			<section>
				<span>Success</span>
				<span v-if="successfulPrediction">
					<i class="fas fa-check"></i>
				</span>
				<span v-else>
					<i class="fas fa-times"></i>
				</span>
			</section>
		</section>

	</section>
</template>

<script>
	import {mapGetters, mapState} from "vuex";
	import {portfolioOptionToText} from "@finfluencers/shared/models/ContentData.model";

	export default {
		props:['prediction', 'createdAt'],
		computed:{
			isComplete(){
				return this.prediction.date <= +new Date();
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
			},
			priceAtStart(){
				if(!this.rawGraphData.length) return 0;
				return (this.rawGraphData.reduce((acc,x) => {
					if(x.date >= acc.date && acc.date <= this.createdAt) return x;
					return acc;
				})).price;
			},
			priceAtEnd(){
				if(!this.rawGraphData.length) return 0;
				return (this.rawGraphData.reduce((acc,x) => {
					if(x.date >= acc.date && acc.date <= this.prediction.date) return x;
					return acc;
				})).price;
			},
			pnl(){
				const val =parseFloat((this.priceAtEnd-this.priceAtStart)/this.priceAtEnd*100.0).toFixed(2);
				return val > 0 ? '+' + val : val;
			},
			pnlToPrediction(){
				const val = parseFloat((this.prediction.price-this.priceAtStart)/this.prediction.price*100.0).toFixed(2);
				return val > 0 ? '+' + val : val;
			},
			successfulPrediction(){
				if(!this.isComplete) return false;
				if(parseFloat(this.prediction.price) > parseFloat(this.priceAtStart)){
					return parseFloat(this.priceAtEnd) >= parseFloat(this.prediction.price);
				} else {
					return parseFloat(this.priceAtEnd) <= parseFloat(this.prediction.price);
				}
			}
		},
		methods:{
			formatPrice(price){
				return parseFloat(parseFloat(price).toFixed(8)).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.post-portfolio {
		//box-shadow:var(--soft-shadow);
		background:var(--graph-bg);
		border-radius:var(--radius);
		text-align:left;
		position: relative;
		margin-bottom:20px;

		.totals {
			padding:30px;
			position: relative;
			z-index:1;

			.legend {
				display:flex;
				align-items: flex-end;
				justify-content: flex-end;
				flex-direction: column;
				margin-top:-15px;
				margin-bottom:10px;
				position: absolute;
				top:30px;
				right:20px;
			}

			.line-1 {
				flex:0 0 auto;
				font-size: 11px;
				color:var(--text-secondary);
				font-weight: bold;
				display:flex;
				align-items: center;
				opacity:0.5;

				i {
					margin-right:10px;
					width:40px;
					border:3px dashed var(--text-secondary);
					position: relative;
					opacity:0.4;
				}
			}

			.line-2 {
				flex:1;
				font-size: 11px;
				color:var(--text-secondary);
				font-weight: bold;
				display:flex;
				align-items: center;
				opacity:0.5;
				margin-top:3px;

				i {
					margin-right:10px;
					width:40px;
					background:linear-gradient(90deg, var(--graph-line-0) 0%, var(--graph-line-1) 100%);
					height:6px;
					position: relative;
					opacity:1;
				}
			}

			> span {
				display:block;
				font-family: var(--secondary-font);

				&:nth-child(1){
					font-size: 28px;
					font-weight: bold;
					line-height:28px;
					margin-top:-6px;
					margin-bottom:5px;
					color:var(--highlight);
				}

				&:nth-child(2){
					font-size: 18px;
					color:var(--text-primary);
				}
			}
		}

		.graphs {
			position: relative;
			height:80px;
			z-index:1;
			margin-top:-10px;

			.graph {
				position:absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				height:80px;

				&:first-child {
					z-index:2;
				}
			}
		}

		.details {
			padding:30px;
			position: relative;
			z-index:3;

			display:flex;
			justify-content: space-between;

			@media only screen and (max-width:$breakpoint) {
				flex-direction: column;
			}

			> section {
				padding-right:50px;

				@media only screen and (max-width:$breakpoint) {
					&:not(:last-child){
						margin-bottom:20px;
					}
				}

				&:last-child {
					text-align:right;
					padding-right:0;

					@media only screen and (max-width:$breakpoint) {
						text-align:left;
					}
				}

				&:first-child {
					text-align:left;
					padding-right:50px;
				}

				span {
					display:block;

					&:nth-child(1){
						font-size: 11px;
						color:var(--text-secondary);
					}

					&:nth-child(2){
						font-size: 20px;
						color:var(--text-primary);
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
