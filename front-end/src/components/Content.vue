<template>
	<section class="content-component"
	         :class="{'deleted':deleted}"
	         :id="`content_${content.id}`"
	         :ref="`content_${content.id}`"
	         @click="removeSelfPosted"
	>
		<section class="header">
			<Profile :size="44" :user="content.user" />

			<section class="timestamp">
				{{timeAgo}} ago
			</section>

			<Labels class="labels" :labels="labels" />
		</section>

		<section class="innards">

			<ContentPortfolio v-if="isPortfolio" class="portfolio" :portfolio="content.data"
				:show-comparison="user && user.id !== content.user_id" />
			<ContentTrade v-if="isTrade" :trade="content.data" />
			<ContentPrediction v-if="isPrediction" :prediction="content.data" :created-at="content.created_at" />

			<section class="text">
				<!--{{content.text.data}}-->
				<section class="markdown-content" :class="{'open':hideCommentsButton}" :style="{'max-height':`${maxHeight}px`}">
					<vue-simple-markdown :heading="true"
					                     :image="true"
					                     :inline-code="false"
					                     :table="false"
					                     :highlight="false"
					                     :source="content.text.data" />
				</section>

				<figure class="disclaimer" v-if="isAdvice">
					Influencers are not financial advisors.
				</figure>
			</section>

			<section class="actions">
				<!-- LEFT ACTIONS -->
				<section v-if="!isYours" @click="heart">
					<i class="fa-heart" :class="hasLiked ? 'fas' : 'far'" v-tooltip="'Appreciate'"></i>
					<span>{{(content.trackers ? content.trackers.hearts || 0 : 0) + (unhearting ? -1 : hearting ? 1 : 0)}}</span>
				</section>
				<section @click="goToContent" v-if="!hideCommentsButton">
					<i class="far fa-comment" v-tooltip="'Comment'"></i>
					<span>{{content.trackers ? content.trackers.comments || 0 : 0}}</span>
				</section>

				<!-- RIGHT ACTIONS -->
				<section style="flex:1; cursor: auto;"></section>
				<section @click="deleteContent" v-if="isYours" style="margin-right:10px;">
					<i class="far fa-trash-alt smaller" v-tooltip="'Delete'"></i>
				</section>
				<section v-if="!isYours" @click="bookmark" style="margin-right:10px;">
					<i class="fa-bookmark smaller" :class="hasBookmarked ? 'fas' : 'far'" v-tooltip="'Bookmark'"></i>
				</section>
				<section @click="share" style="margin-right:0;">
					<i class="far fa-share-square smaller" style="padding-right:0;" v-tooltip="'Share'"></i>
				</section>
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
			bookmarking:false,
			unbookmarking:false,
			maxHeight:230,
			deleted:false,
		}},
		mounted(){
			if(this.content.text.data.indexOf('![') === 0){
				this.maxHeight = 500;
			}
		},
		computed:{
			...mapState([
				'user',
			]),
			timeAgo(){ return ago(this.content.created_at); },
			needsHelp(){ return this.content.type === CONTENT_TYPE.GET_HELP; },
			isAdvice(){ return this.content.type === CONTENT_TYPE.KNOWLEDGE; },
			isTrade(){ return this.content.type === CONTENT_TYPE.TRADE; },
			isPrediction(){ return this.content.type === CONTENT_TYPE.PREDICTION; },
			isPortfolio(){ return this.content.type === CONTENT_TYPE.PORTFOLIO; },
			isSandboxed(){
				return this.content.data && this.content.data.hasOwnProperty('sandboxed') && this.content.data.sandboxed;
			},
			isYours(){
				return this.content.user_id === this.user.id;
			},
			contentTypeLabel(){
				switch(this.content.type){
					case CONTENT_TYPE.GET_HELP: return 'Help!';
					case CONTENT_TYPE.SET_GOAL: return 'Goal';
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
			},
			hasBookmarked(){
				if(this.bookmarking) return true;
				if(this.unbookmarking) return false;
				if(!this.content.interactions) return false;
				return !!this.content.interactions.find(x => {
					return x.type === INTERACTION_TYPE.BOOKMARK;
				});
			}
		},
		methods:{
			async deleteContent(){
				this.deleted = true;
				console.log('this.content', this.content);
				const deleted = await ApiService.deleteContent(this.content);
				if(!deleted) this.deleted = false;
			},
			async bookmark(){
				if(!this.hasBookmarked) this.bookmarking = true;
				if(!this.bookmarking && this.hasBookmarked) this.unbookmarking = true;
				const interaction = await ApiService.interactContent(this.content, INTERACTION_TYPE.BOOKMARK);
				this.bookmarking = false;
				this.unbookmarking = false;

				if(interaction){
					if(interaction.hasOwnProperty('id')){
						if(!this.content.interactions) this.content.interactions = [];
						this.content.interactions.push(interaction);
					} else {
						this.content.interactions = this.content.interactions.filter(x => x.type !== INTERACTION_TYPE.BOOKMARK);
					}

				}
			},
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
	@import "../styles/variables";

	.content-component {
		margin-bottom:80px;
		border-radius:var(--radius);
		background:var(--content-bg);
		padding:20px;
		box-shadow:var(--soft-shadow);

		transition:all 0.2s ease;
		transition-property: padding, box-shadow;

		&.deleted {
			cursor: not-allowed;
			opacity:0.2;
			pointer-events: none;
		}

		&.self-posted {
			padding:20px;
			box-shadow:var(--posted-highlight);
		}

		.header {
			display:flex;
			justify-content: space-between;
			align-items: flex-start;
			position: relative;

			.profile {

			}

			.timestamp {
				font-size: 9px;
				padding-right:5px;
				color:var(--text-secondary);
				font-family: var(--secondary-font);
				align-self: flex-start;
			}
		}

		.innards {
			margin-top:15px;
			border-radius:var(--radius);
			/*background:var(--content-bg);*/
			/*border-top-left-radius:0;*/
			text-align:left;
			position: relative;

			transition: box-shadow 0.5s ease;

			.labels {
				margin-top:-26px;
				margin-right:-5px;
			}

			.text {
				font-family: var(--secondary-font);
				color:var(--text-primary);

				.markdown-content {
					overflow-y:hidden;
					position: relative;
					padding-bottom:20px;

					&:after {
						content:'';
						display:block;
						position:absolute;
						bottom:0;
						left:0;
						right:0;
						height:80px;
						box-shadow:inset 0 -40px 20px -20px var(--content-bg);
						pointer-events: none;
					}

					&.open {
						max-height:none !important;

						&:after {
							display:none;
						}
					}
				}

				.disclaimer {
					font-size: 9px;
					font-weight: bold;
					padding:5px 10px;
					border-radius:var(--radius);
					background:var(--warning-bg);
					color:var(--text-primary);
					display:table;
					margin:10px 0 -20px auto;

					@media only screen and (max-width:$breakpoint) {
						font-size: 10px;
					}
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

						&.smaller {
							font-size: 16px;
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
