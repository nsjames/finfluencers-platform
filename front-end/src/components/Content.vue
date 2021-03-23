<template>
	<section class="content" :id="`content_${content.id}`" :ref="`content_${content.id}`" @click="removeSelfPosted">
		<section class="header">
			<Profile :size="44" :user="content.user" />

			<section class="timestamp">
				{{timeAgo}} ago
			</section>
		</section>

		<section class="innards">
			<Labels :labels="labels" />

			<ContentPortfolio v-if="isPortfolio" class="portfolio" :portfolio="content.data"
				:wealth="parseFloat(content.data.wealth).toFixed(2)"
				:show-comparison="user && user.id !== content.user_id" />
			<ContentTrade v-if="isTrade" :trade="content.data" />
			<ContentPrediction v-if="isPrediction" :prediction="content.data" :created-at="content.created_at" />

			<section class="text">
				{{content.text.data}}
			</section>

			<section class="actions">
				<section>
					<i class="fas fa-chevron-up"></i>
					<span>16</span>
				</section>
				<section>
					<i class="fas fa-chevron-down"></i>
					<span>3</span>
				</section>
				<!--<section>-->
					<!--<i class="fas fa-retweet"></i>-->
					<!--<span>3</span>-->
				<!--</section>-->
				<section>
					<i class="far fa-comment"></i>
					<span>3</span>
				</section>
				<!--<section>-->
					<!--<i class="fas fa-money-bill"></i>-->
					<!--<span>tip</span>-->
				<!--</section>-->
			</section>
		</section>

	</section>
</template>

<script>
	import {CONTENT_TYPE} from "@finfluencers/shared/models/ContentType";
	import ago from '../util/ago'
	import {mapState} from "vuex";

	export default {
		props:['content'],
		components:{
			ContentPortfolio:() => import('./ContentPortfolio'),
			ContentTrade:() => import('./ContentTrade'),
			ContentPrediction:() => import('./ContentPrediction'),
		},
		computed:{
			...mapState([
				'user',
			]),
			timeAgo(){ return ago(this.content.created_at); },
			isTrade(){ return this.content.type === CONTENT_TYPE.TRADE; },
			isPrediction(){ return this.content.type === CONTENT_TYPE.PREDICTION; },
			isPortfolio(){ return this.content.type === CONTENT_TYPE.PORTFOLIO; },
			isSandboxed(){
				return this.content.data && this.content.data.hasOwnProperty('sandboxed') && this.content.data.sandboxed;
			},
			labels(){
				return (this.isSandboxed ? ['Sandboxed'] : []).concat(this.content.tags)
			},
		},
		methods:{
			removeSelfPosted(){
				const elem = this.$refs[`content_${this.content.id}`];
				elem.classList.remove('self-posted');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-bottom:80px;
		padding:20px 0;
		border-radius:var(--radius);

		transition:all 0.2s ease;
		transition-property: padding, box-shadow;

		&.self-posted {
			padding:20px;
			box-shadow:0 0 50px var(--posted-highlight);
		}

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
			position: relative;

			transition: box-shadow 0.5s ease;

			.text {
				font-size: 18px;
				font-family: var(--secondary-font);
				color:var(--text-primary);
				padding:10px;
			}

			.portfolio {
				margin-bottom:20px;
			}

			.actions {
				margin-top:20px;
				cursor: pointer;
				display:flex;
				align-items: center;

				> section {
					margin-right:40px;
					display:flex;
					align-items: center;
				}

				i {
					padding:10px;
					color:var(--text-secondary);
					margin-bottom:-10px;
					opacity:0.2;
					transition: all 0.1s ease;
					transition-property: opacity, color;
					font-size: 24px;

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
					padding-top:9px;
				}
			}
		}
	}
</style>