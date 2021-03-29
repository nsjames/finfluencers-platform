<template>
	<section class="content-component" :id="`content_${content.id}`" :ref="`content_${content.id}`" @click="removeSelfPosted">
		<section class="header">
			<Profile :size="44" :user="content.user" />

			<section class="timestamp">
				{{timeAgo}} ago
			</section>
		</section>

		<section class="innards">
			<Labels :labels="labels" />

			<ContentPortfolio v-if="isPortfolio" class="portfolio" :portfolio="content.data"
				:show-comparison="user && user.id !== content.user_id" />
			<ContentTrade v-if="isTrade" :trade="content.data" />
			<ContentPrediction v-if="isPrediction" :prediction="content.data" :created-at="content.created_at" />

			<section class="text">
				{{content.text.data}}

				<figure class="disclaimer" v-if="isAdvice">
					<b>Influencers are not financial advisers.</b>
					You should get as many opinions as possible before taking any financial actions.
					You should also make sure that the influencers you're taking advice from have high influence scores.
				</figure>
			</section>

			<section class="actions">
				<section @click="heart">
					<i class="fa-heart" :class="hasLiked ? 'fas' : 'far'"></i>
					<span>{{(content.trackers ? content.trackers.hearts || 0 : 0) + (unhearting ? -1 : hearting ? 1 : 0)}}</span>
				</section>
				<!--<section>-->
					<!--<i class="fas fa-retweet"></i>-->
					<!--<span>3</span>-->
				<!--</section>-->
				<section @click="goToContent" v-if="!hideCommentsButton">
					<i class="far fa-comment"></i>
					<span>{{content.trackers ? content.trackers.comments || 0 : 0}}</span>
				</section>
				<section style="flex:1; cursor: auto;"></section>
				<section @click="share" style="margin:0;">
					<i class="far fa-share-square" style="padding-right:0;"></i>
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
	import {INTERACTION_TYPE} from "@finfluencers/shared/models/InteractionType";
	import ago from '../util/ago'
	import {mapActions, mapState} from "vuex";
	import * as ApiService from "../services/ApiService";

	export default {
		props:['content', 'hideCommentsButton'],
		components:{
			ContentPortfolio:() => import('./ContentPortfolio'),
			ContentTrade:() => import('./ContentTrade'),
			ContentPrediction:() => import('./ContentPrediction'),
		},
		data(){return {
			hearting:false,
			unhearting:false,
		}},
		computed:{
			...mapState([
				'user',
			]),
			timeAgo(){ return ago(this.content.created_at); },
			isAdvice(){ return this.content.type === CONTENT_TYPE.KNOWLEDGE; },
			isTrade(){ return this.content.type === CONTENT_TYPE.TRADE; },
			isPrediction(){ return this.content.type === CONTENT_TYPE.PREDICTION; },
			isPortfolio(){ return this.content.type === CONTENT_TYPE.PORTFOLIO; },
			isSandboxed(){
				return this.content.data && this.content.data.hasOwnProperty('sandboxed') && this.content.data.sandboxed;
			},
			contentTypeLabel(){
				switch(this.content.type){
					case CONTENT_TYPE.ADVICE: return 'Seeking Advice';
					case CONTENT_TYPE.DECISION: return 'Decision';
					case CONTENT_TYPE.TRADE: return 'Investment';
					case CONTENT_TYPE.KNOWLEDGE: return 'Advice';
					case CONTENT_TYPE.PREDICTION: return 'Prediction';
					case CONTENT_TYPE.PORTFOLIO: return null;
				}
			},
			labels(){
				return [this.contentTypeLabel].concat((this.isSandboxed ? ['Sandboxed'] : [])).concat(this.content.tags).filter(x => !!x);
			},
			hasLiked(){
				if(this.hearting) return true;
				if(this.unhearting) return false;
				if(!this.content.interactions) return false;
				return !!this.content.interactions.find(x => {
					return x.type === INTERACTION_TYPE.HEART;
				});
			}
		},
		methods:{
			share(){

			},
			removeSelfPosted(){
				const elem = this.$refs[`content_${this.content.id}`];
				if(elem) elem.classList.remove('self-posted');
			},
			goToContent(){
				this.setContent(this.content);
				this.$router.push(`/content/${this.content.id}`);
			},
			async heart(){
				if(!this.hasLiked) this.hearting = true;
				if(!this.hearting && this.hasLiked) this.unhearting = true;
				const interaction = await ApiService.interactContent(this.content, INTERACTION_TYPE.HEART);
				this.hearting = false;
				this.unhearting = false;
				console.log('interaction', interaction);
				if(interaction){
					if(interaction.hasOwnProperty('id')){
						if(!this.content.interactions) this.content.interactions = [];
						this.content.interactions.push(interaction);
						this.content.trackers.hearts += 1;
					} else {
						this.content.interactions = this.content.interactions.filter(x => x.type !== INTERACTION_TYPE.HEART);
						this.content.trackers.hearts -= 1;
					}

				}
			},
			...mapActions([
				'setContent'
			])
		}
	}
</script>

<style lang="scss" scoped>
	.content-component {
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
			background:var(--background-color);

			transition: box-shadow 0.5s ease;

			.text {
				font-size: 18px;
				font-family: var(--secondary-font);
				color:var(--text-primary);
				padding:10px;

				.disclaimer {
					font-size: 11px;
					margin-top:30px;
					margin-bottom:-20px;
					margin-left:-10px;
					padding:10px 15px;
					border-radius:4px;
					background:var(--warning-bg);
					color:var(--text-primary);
					display:table;
					border:1px solid var(--warning-shadow);
				}
			}

			.portfolio {
				margin-bottom:20px;
			}

			.actions {
				margin-top:20px;
				cursor: pointer;
				display:flex;

				> section {
					margin-right:40px;
					display:flex;
					align-items: center;

					i {
						&.fa-heart {
							&.fas {
								color:var(--highlight);
								opacity:0.3;
							}
						}
					}

					&:hover {
						i {
							color:var(--highlight);
							opacity:1 !important;
						}
					}
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
