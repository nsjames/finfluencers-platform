<template>
	<section class="post-portfolio">

		<section class="totals">
			<span>{{parseInt(portfolio.snapshot.potential)}} / {{parseInt(portfolio.snapshot.influence)}}</span>
			<span>Potential / Influence</span>
			<span v-if="showComparison"><i></i> your comparison</span>
		</section>
		<section class="graphs">
			<Graph class="graph" :height="130" :data-arr="viewedPortfolio"  />
			<Graph class="graph" v-if="showComparison" :secondary="true" :height="130" :data-arr="userPortfolioGraphData"  />
		</section>
		<section class="details" v-if="detailsOrPortfolioData">
			<section v-for="detail in detailsOrPortfolioData">
				<span>{{detail[0]}}</span>
				<span>{{detail[1]}}</span>
			</section>
		</section>

	</section>
</template>

<script>
	import {mapGetters, mapState} from "vuex";
	import {portfolioOptionToText} from "@finfluencers/shared/models/ContentData.model";

	export default {
		props:['portfolio', 'details', 'showComparison'],
		computed:{
			...mapState([
				'user',
				'theme',
			]),
			viewedPortfolio(){
				return [...Array(20).keys()].map((i) => Math.round(Math.random() * 180 * i) + 500 * i)
			},
			...mapGetters([
				'userPortfolioGraphData',
			]),
			detailsOrPortfolioData(){
				if(this.details) return this.details;
				if(!this.portfolio.options) return [];
				return this.portfolio.options.map(id => {
					if(id === 0) return null;
					let value;
					switch(id){
						// TODO:
						case 1: value = '$1.2m'; break;
						case 2: value = '$480k'; break;
					}

					return [portfolioOptionToText(id), value]
				}).filter(x => !!x);
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
						width:15%;
						border:2px dashed var(--text-secondary);
						position: relative;
						opacity:0.4;
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
