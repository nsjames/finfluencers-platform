<template>
	<section class="post-portfolio">

		<section class="totals">
			<span>{{pnlToPrediction}}%</span>
			<span>Prediction quota</span>
			<span><i></i> Predicted price</span>
			<span><i></i> Actual {{prediction.asset.symbol}} price</span>
		</section>
		<section class="graphs">
			<Graph class="graph" :height="130" :data-arr="graphData" :data-arr-secondary="setPrice"  />
		</section>
		<section class="details">
			<section>
				<span>Price at creation</span>
				<span>${{priceAtStart}}</span>
			</section>
			<section>
				<span>Price at stop</span>
				<span>${{priceAtEnd}}</span>
			</section>
			<section>
				<span>Profit & Loss</span>
				<span>{{pnl}}%</span>
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
				const price = this.rawGraphData.find(x => x.date > (this.createdAt - 86400000) && x.date < (this.prediction.date + 86400000));
				if(!price) return this.rawGraphData[0].price;
				return price.price;
			},
			priceAtEnd(){
				return this.rawGraphData[this.rawGraphData.length-1].price;
			},
			pnl(){
				return parseFloat((this.priceAtEnd-this.priceAtStart)/this.priceAtEnd*100.0).toFixed(2);
			},
			pnlToPrediction(){
				return parseFloat((this.prediction.price-this.priceAtStart)/this.prediction.price*100.0).toFixed(2);
			},
		}
	}
</script>

<style lang="scss" scoped>
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

			span {
				display:block;
				font-family: var(--secondary-font);

				&:nth-child(1){
					font-size: 28px;
					font-weight: bold;
					color:var(--highlight);
				}

				&:nth-child(2){
					font-size: 18px;
					color:var(--text-primary);
					margin-top:5px;
				}

				&:nth-child(3){
					font-size: 11px;
					color:var(--text-secondary);
					font-weight: bold;
					margin-top:15px;
					display:flex;
					align-items: center;
					opacity:0.5;

					i {
						margin-right:10px;
						width:8%;
						border:2px dashed var(--text-secondary);
						position: relative;
						opacity:0.4;
					}
				}

				&:nth-child(4){
					font-size: 11px;
					color:var(--text-secondary);
					font-weight: bold;
					margin-top:15px;
					display:flex;
					align-items: center;
					opacity:0.5;

					i {
						margin-right:10px;
						width:8%;
						background:linear-gradient(90deg, var(--graph-line-0) 0%, var(--graph-line-1) 100%);
						height:4px;
						position: relative;
						opacity:1;
					}
				}
			}
		}

		.graphs {
			position: relative;
			height:130px;
			z-index:1;

			.graph {
				position:absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				height:130px;

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

			> section {
				padding-right:50px;

				&:last-child {
					text-align:right;
					padding-right:0;
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
