<template>
	<section>
		<section class="post-content" v-if="contentTypes[content.type]">
			<section class="select-post-type">
				<Dropdown :transparent="true" :selected="contentTypes[content.type]" :options="contentTypes"
				          v-on:selected="x => content.type = x.id" />
			</section>

			<section class="post-text">
				<textarea :class="{'extended-height':!hasExtendedPostFields}" v-model="content.text.data" :placeholder="contentTypes[content.type].placeholder"></textarea>
			</section>

			<PostTrade v-if="content.type === CONTENT_TYPE.TRADE" :content="content" />
			<PostPrediction v-if="content.type === CONTENT_TYPE.PREDICTION" :content="content" v-on:price="x => content.data.price = x" />
			<PostPortfolio v-if="content.type === CONTENT_TYPE.PORTFOLIO" :content="content" />

			<!--<transition name="sandbox" mode="out-in">-->
				<!--<section key="CONTENT_TYPE.GET_HELP" class="advice-warning" v-if="content.type === CONTENT_TYPE.GET_HELP">-->
					<!--<b>Advice on finfluencers is crowd-sourced</b>. Do your own research along with advice you are given,-->
					<!--and make sure you are accepting advice from users who have proven track records.-->
				<!--</section>-->
				<!--<section key="CONTENT_TYPE.SET_GOAL" class="advice-warning" v-if="content.type === CONTENT_TYPE.SET_GOAL">-->
					<!--Setting goals allows finfluencers to track your progress and help you. It also unlocks <b>profile trophies.</b>-->
				<!--</section>-->
				<!--<section key="CONTENT_TYPE.KNOWLEDGE" class="advice-warning" v-if="content.type === CONTENT_TYPE.KNOWLEDGE">-->
					<!--Sharing your knowledge grows your <b>influence</b> and unlocks <b>profile trophies</b>. But be careful, if you give bad advice your influence will suffer.-->
				<!--</section>-->
				<!--<section key="CONTENT_TYPE.PREDICTION" class="advice-warning" v-if="content.type === CONTENT_TYPE.PREDICTION || content.type === CONTENT_TYPE.TRADE">-->
					<!--<b>Predictions</b> and <b>Investments</b> help create your track record that backs up your influence.-->
				<!--</section>-->
			<!--</transition>-->



			<section class="actions">
				<section class="post-details">
					<span v-if="content.text.data.length > MAX_CHARS"><b class="over-length">{{MAX_CHARS - content.text.data.length}}</b></span>
					<button @click="post" v-if="!posting">
						<i class="fas fa-plus"></i>
					</button>
					<button v-if="posting">
						<i class="fas fa-spin fa-spinner"></i>
					</button>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import ContentModel from '@finfluencers/shared/models/Content.model';
	import {CONTENT_TYPE} from '@finfluencers/shared/models/ContentType';
	import {PortfolioContent, PredictionContent, TextContent, TradeContent} from "@finfluencers/shared/models/ContentData.model";
	import * as ApiService from "../services/ApiService";
	import {Snackbar} from '../models/Snackbar'

	const MAX_CHARS = 5000;

	export default {
		components:{
			PostTrade:() => import('./post-content/PostTrade'),
			PostPrediction:() => import('./post-content/PostPrediction'),
			PostPortfolio:() => import('./post-content/PostPortfolio'),
		},
		data(){return {
			MAX_CHARS,
			content:new ContentModel({
				type:CONTENT_TYPE.KNOWLEDGE,
				text:new TextContent()
			}),
			CONTENT_TYPE,
			posting:false,
		}},
		mounted(){
			this.setContentTypeDefault();
		},
		computed:{
			...mapState([
				'user',
				'feedType',
			]),
			hasExtendedPostFields(){
				return [CONTENT_TYPE.TRADE, CONTENT_TYPE.PREDICTION].includes(this.content.type);
			},
			canSandbox(){
				return false;

				switch(this.content.type){
					case CONTENT_TYPE.TRADE:
					case CONTENT_TYPE.SET_GOAL:
						return true;
					default:
						return false;
				}
			},
			contentTypes(){
				if(this.feedType === 0){
					return {
						[CONTENT_TYPE.GET_HELP]:{
							id:CONTENT_TYPE.GET_HELP,
							text:'Ask a question',
							icon:'',
							placeholder:'You can ask for help with anything related to finances',
						},
						[CONTENT_TYPE.SET_GOAL]:{
							id:CONTENT_TYPE.SET_GOAL,
							text:'Set a goal',
							icon:'',
							placeholder:`Talk about why you are setting this goal`,
						},
					}
				} else {
					return {
						[CONTENT_TYPE.KNOWLEDGE]:{
							id:CONTENT_TYPE.KNOWLEDGE,
							text:'Spread your knowledge',
							icon:'',
							placeholder:'Show the world what you know about finance',
						},
						[CONTENT_TYPE.TRADE]:{
							id:CONTENT_TYPE.TRADE,
							text:'Share an investment',
							icon:'',
							placeholder:'Explain your reasoning behind this investment, so that others can learn',
						},
						[CONTENT_TYPE.PREDICTION]:{
							id:CONTENT_TYPE.PREDICTION,
							text:'Make a prediction',
							icon:'',
							placeholder:'Back up your prediction with some science',
						}
					}
				}
			}
		},
		methods:{
			setContentTypeDefault(){
				this.content.type = this.feedType === 0 ? CONTENT_TYPE.GET_HELP : CONTENT_TYPE.KNOWLEDGE;
			},
			async post(){
				if(this.user) {
					this.content.user_id = this.user.id;

					if(this.content.data && this.content.data.hasOwnProperty('date')){
						this.content.data.date = +new Date(this.content.data.date);
					}

					if(this.content.type === CONTENT_TYPE.PREDICTION){
						if(parseInt(this.content.data.asset.id) < 1) return Snackbar.error("Select an asset from the dropdown first.");
					}

					this.posting = true;

					await new Promise(r => setTimeout(r, 1000));
					const posted = await ApiService.postContent(this.content);
					console.log('posted', posted);
					if(posted) {
						await this.prependContent(new ContentModel(posted));
						this.$nextTick(() => {
							const elem = document.getElementById(`content_${posted.id}`);

							if(elem) elem.classList.add('self-posted')
						})

						this.content = new ContentModel({
							type:CONTENT_TYPE.KNOWLEDGE,
							text:new TextContent()
						});
						this.setContentTypeDefault();

					}

					this.posting = false;
				}


			},
			...mapActions([
				'prependContent',
			])
		},
		watch:{
			['content.type'](){
				switch(this.content.type){
					case CONTENT_TYPE.KNOWLEDGE:
					case CONTENT_TYPE.GET_HELP:
						this.content.data = null; break;
					case CONTENT_TYPE.TRADE:
						this.content.data = new TradeContent();
						this.content.data.from.asset = 'USD';
						break;
					case CONTENT_TYPE.PREDICTION:
						this.content.data = new PredictionContent();
						this.content.data.date = new Date(+new Date() + 86400000);
						break;
					case CONTENT_TYPE.PORTFOLIO:
						this.content.data = new PortfolioContent();
						this.content.data.snapshot = this.user.snapshot;
						break;
				}
			},
			'feedType'(){
				this.setContentTypeDefault();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.post-content {
		margin-top:40px;

		.extended-height {
			min-height:calc(150px + 90px + 20px);
		}

		.collapse-enter-active, .collapse-leave-active {
			width: inherit;
			transition: all 0.3s ease;
			transition-property: max-height;
			max-height: 100px;
			overflow:hidden;
		}
		.collapse-enter, .collapse-leave-to /* .collapse-leave-active below version 2.1.8 */ {
			max-height:0;
			opacity: 0;
		}

		.over-length {
			font-weight: bold;
			padding:4px 8px;
			background:var(--error-snackbar);
			color:#fff;
			border-radius:6px;
			font-size: 11px;
		}

		.advice-warning {
			text-align:left;
			font-size: 13px;
			color:var(--text-primary);
			border:2px solid var(--warning-shadow);
			padding:10px 15px;
			border-radius:var(--radius);
			background:var(--warning-bg);
			font-family: var(--secondary-font);
			margin-top:20px;
			margin-bottom:10px;


		}

		.select-post-type {
			display:flex;
			align-items: flex-start;
			margin-left:-15px;
			margin-bottom:-10px;
		}

		.sandbox {
			text-align:left;
			padding:20px;
			border-radius:var(--radius);
			background:var(--hint-bg);
			box-shadow:var(--soft-shadow);
			margin-top:20px;
			margin-bottom:10px;


			transition: all 0.5s ease;
			transition-property: box-shadow, color;

			p {
				color:var(--text-secondary);
				font-size: 12px;
				margin-top:10px;
			}

			> section {

				&:first-child {
					display:flex;
					align-items: center;

					span {
						margin-left:10px;
						color:var(--text-primary);
						font-size: 16px;
					}
				}
			}

		}

		.switch-content-type-enter-active, .switch-content-type-leave-active {
			width: inherit;
			transition: all 0.3s ease;
			transition-property: transform, opacity;
		}
		.switch-content-type-enter, .switch-content-type-leave-to /* .switch-content-type-leave-active below version 2.1.8 */ {
			transform:translateY(20px);
			opacity:0;
		}

		.sandbox-enter-active, .sandbox-leave-active {
			transition: all 0.3s ease;
			transition-property: transform, opacity;
		}
		.sandbox-enter, .sandbox-leave-to /* .sandbox-leave-active below version 2.1.8 */ {
			transform:translateY(20px);
			opacity:0;
		}

		.post-text {
			width:100%;
			position: relative;
			margin:20px 0;


			transition: box-shadow 0.5s ease;
		}

		.actions {
			display:flex;
			justify-content: space-between;
			align-items: center;
			margin-top:20px;

			@media only screen and (max-width:$breakpoint) {
				flex-direction: column;
			}

			.post-details {
				position: relative;
				flex:1;
				justify-content: flex-end;

				padding-bottom:40px;

				display:flex;
				align-items: center;
				font-size: 14px;
				width:100%;

				@media only screen and (max-width:$breakpoint) {
					flex-direction: column;
				}

				span {
					margin-right:20px;
					color:var(--text-secondary);
					font-size: 14px;
					font-family: var(--secondary-font);
				}

				button {
					cursor: pointer;
					outline:0;
					border:0;
					padding:10px 40px;
					font-size: 14px;
					font-weight: bold;
					color:var(--background-color);
					background:var(--text-primary);
					border-radius: 100px;
					min-width:120px;
					position: absolute;
					top:0;
					right:0;


					@media only screen and (max-width:$breakpoint) {
						min-width:100%;
						flex:1;
						padding:20px 40px;
						font-size: 22px;
						position: relative;
					}
				}
			}
		}
	}
</style>
