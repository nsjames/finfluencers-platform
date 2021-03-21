<template>
	<section class="content">
		<section class="header">
			<Profile :size="44" />

			<section class="timestamp">
				10m ago
			</section>
		</section>

		<section class="innards">

			<ContentPortfolio v-if="isPortfolio" class="portfolio" :portfolio="content.data" />
			<ContentTrade v-if="isTrade" :trade="content.data" />
			<ContentPrediction v-if="isPrediction" :prediction="content.data" :created-at="content.created_at" />

			<section class="text">
				This is just some test text
			</section>

			<section class="actions">
				<section>
					<i class="far fa-heart"></i>
					<span>3</span>
				</section>
				<section>
					<i class="far fa-comment"></i>
					<span>3</span>
				</section>
			</section>
		</section>

	</section>
</template>

<script>
	import {CONTENT_TYPE} from "../models/Content";

	export default {
		props:['content'],
		components:{
			ContentPortfolio:() => import('./ContentPortfolio'),
			ContentTrade:() => import('./ContentTrade'),
			ContentPrediction:() => import('./ContentPrediction'),
		},
		computed:{
			isTrade(){ return this.content.type === CONTENT_TYPE.TRADE; },
			isPrediction(){ return this.content.type === CONTENT_TYPE.PREDICTION; },
			isPortfolio(){ return this.content.type === CONTENT_TYPE.PORTFOLIO; },
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-bottom:80px;
		padding:20px 0;
		border-radius:var(--radius);

		.header {
			display:flex;
			justify-content: space-between;
			align-items: flex-start;

			.profile {

			}

			.timestamp {
				font-size: 9px;
				padding-right:5px;
				color:var(--text-secondary);
				font-family: var(--secondary-font);
			}
		}

		.innards {
			margin-top:15px;
			border-radius:var(--radius);
			/*background:var(--content-bg);*/
			/*border-top-left-radius:0;*/
			text-align:left;
			box-shadow:var(--soft-shadow);
			padding:20px;

			transition: box-shadow 0.5s ease;

			.text {
				font-size: 16px;
				font-family: var(--secondary-font);
				color:var(--text-primary);
				padding:0 0 20px 0;
			}

			.portfolio {
				margin-bottom:20px;
			}

			.actions {
				margin-top:20px;
				font-size: 18px;
				cursor: pointer;
				display:flex;
				align-items: center;

				> section {
					margin-right:20px;
				}

				i {
					padding:10px;
					color:var(--text-secondary);
					margin-bottom:-10px;
					opacity:0.2;
					transition: all 0.1s ease;
					transition-property: opacity, color;

					&:first-child {
						margin-left:-10px;
					}

					&:hover {
						color:var(--highlight);
						opacity:1;
					}
				}

				span {
					font-size: 14px;
					font-weight: bold;
					color:var(--text-primary);
				}
			}
		}
	}
</style>
