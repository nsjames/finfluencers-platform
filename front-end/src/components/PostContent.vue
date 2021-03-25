<template>
	<section class="post-content">

		<section class="actions">
			<section class="post-type">
				<Dropdown :transparent="true" :selected="contentTypes[content.type]" :options="contentTypes"
				          v-on:selected="x => content.type = x.id" />
			</section>
			<section class="post-details">
				<span><b :class="{'over-length':content.text.data.length > MAX_CHARS}">{{content.text.data.length}}</b> / {{MAX_CHARS}}</span>
				<button @click="post" v-if="!posting">Post</button>
				<button v-if="posting">
					<i class="fas fa-spin fa-spinner"></i>
				</button>
			</section>
		</section>

		<section class="post-text">
			<textarea v-model="content.text.data" :placeholder="contentTypes[content.type].placeholder"></textarea>
		</section>

		<transition name="switch-content-type" mode="out-in">
			<PostTrade v-if="content.type === CONTENT_TYPE.TRADE" :content="content" />
			<PostPrediction v-if="content.type === CONTENT_TYPE.PREDICTION" :content="content" />
			<PostPortfolio v-if="content.type === CONTENT_TYPE.PORTFOLIO" :content="content" />
		</transition>

		<transition-group name="sandbox" mode="out-in">
			<section key="sandbox" class="sandbox" v-if="canSandbox">
				<section>
					<input type="checkbox" v-model="content.data.sandboxed" />
					<span>Sandbox</span>
				</section>
				<p>
					Sandboxing is a way to train your financial decision making muscles without impacting your profile in any way.
					It is a way for you to experiment with different approaches to portfolio growth.
				</p>
			</section>
			<section key="CONTENT_TYPE.ADVICE" class="advice-warning" v-if="content.type === CONTENT_TYPE.ADVICE">
				<b>Advice on finfluencers is crowd-sourced</b>. Do your own research along with advice you are given,
				and make sure you are accepting advice from users who have proven track records. Asking for advice has no
				impact on your portfolio, influence, or findicator.
			</section>
			<section key="CONTENT_TYPE.KNOWLEDGE" class="advice-warning" v-if="content.type === CONTENT_TYPE.KNOWLEDGE">
				Sharing your knowledge only impacts your influence.
			</section>
			<section key="CONTENT_TYPE.PREDICTION" class="advice-warning" v-if="content.type === CONTENT_TYPE.PREDICTION">
				Predictions impact your findicator and influence scores but not your portfolio.
			</section>
			<section key="CONTENT_TYPE.TRADE" class="advice-warning" v-if="content.type === CONTENT_TYPE.TRADE && !content.data.sandboxed">
				Investments impact your findicator, and portfolio values.
			</section>
		</transition-group>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import ContentModel from '@finfluencers/shared/models/Content.model';
	import {CONTENT_TYPE} from '@finfluencers/shared/models/ContentType';
	import {PortfolioContent, PredictionContent, TextContent, TradeContent} from "@finfluencers/shared/models/ContentData.model";
	import * as ApiService from "../services/ApiService";

	const contentTypes = {
		[CONTENT_TYPE.KNOWLEDGE]:{
			id:CONTENT_TYPE.KNOWLEDGE,
			text:'Spread your knowledge',
			image:'',
			placeholder:'Show the world what you know about finance.',
		},
		[CONTENT_TYPE.ADVICE]:{
			id:CONTENT_TYPE.ADVICE,
			text:'Ask for advice',
			image:'',
			placeholder:'Want is it that you want help with?',
		},
		[CONTENT_TYPE.TRADE]:{
			id:CONTENT_TYPE.TRADE,
			text:'Share an investment',
			image:'',
			placeholder:'What made you do this investment/trade?',
		},
		// [CONTENT_TYPE.DECISION]:{
		// 	id:CONTENT_TYPE.DECISION,
		// 	text:'Share a decision',
		// 	image:'',
		// 	placeholder:'What have you decided to do that will make you wealthier?',
		// },
		[CONTENT_TYPE.PREDICTION]:{
			id:CONTENT_TYPE.PREDICTION,
			text:'Make a prediction',
			image:'',
			placeholder:'Why do you think so?',
		},
		[CONTENT_TYPE.PORTFOLIO]:{
			id:CONTENT_TYPE.PORTFOLIO,
			text:'Show off your portfolio',
			image:'',
			placeholder:'Give your portfolio some context...',
		},
	};

	const MAX_CHARS = 2000;

	export default {
		components:{
			PostTrade:() => import('./post-content/PostTrade'),
			PostPrediction:() => import('./post-content/PostPrediction'),
			PostPortfolio:() => import('./post-content/PostPortfolio'),
		},
		data(){return {
			contentTypes,
			MAX_CHARS,
			content:new ContentModel({
				type:CONTENT_TYPE.KNOWLEDGE,
				text:new TextContent()
			}),
			CONTENT_TYPE,
			posting:false,
		}},
		mounted(){

		},
		computed:{
			...mapState([
				'user',
			]),
			canSandbox(){
				switch(this.content.type){
					case CONTENT_TYPE.TRADE:
					case CONTENT_TYPE.DECISION:
						return true;
					default:
						return false;
				}
			}
		},
		methods:{
			async post(){
				if(this.user) {
					this.posting = true;
					this.content.user_id = this.user.id;

					if(this.content.data && this.content.data.hasOwnProperty('date')){
						this.content.data.date = +new Date(this.content.data.date);
					}

					await new Promise(r => setTimeout(r, 1000));
					const posted = await ApiService.postContent(this.content);
					console.log('content', this.content);
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
					case CONTENT_TYPE.ADVICE:
						this.content.data = null; break;
					case CONTENT_TYPE.TRADE:
						this.content.data = new TradeContent();
						this.content.data.from.asset = 'USD';
						break;
					case CONTENT_TYPE.PREDICTION:
						this.content.data = new PredictionContent();
						this.content.data.date = new Date();
						break;
					case CONTENT_TYPE.PORTFOLIO:
						this.content.data = new PortfolioContent();
						this.content.data.snapshot = this.user.snapshot;
						break;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.post-content {

		.over-length {
			color:red;
			font-weight: bold;
		}

		.advice-warning {
			text-align:left;
			font-size: 14px;
			color:var(--text-primary);
			border:2px solid var(--warning-shadow);
			padding:20px;
			border-radius:var(--radius);
			background:var(--warning-bg);
			margin-top:20px;
			margin-bottom:10px;

			transition: all 0.5s ease;
			transition-property: border, background;
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
			transition: all 0.2s ease;
			transition-property: transform, opacity;
		}
		.switch-content-type-enter, .switch-content-type-leave-to /* .switch-content-type-leave-active below version 2.1.8 */ {
			transform:translateY(-20px);
			opacity:0;
		}

		.sandbox-enter-active, .sandbox-leave-active {
			transition: all 0.2s ease;
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
			margin-bottom:20px;

			.post-type {

			}

			.post-details {
				flex:1;
				justify-content: flex-end;

				display:flex;
				align-items: center;
				font-size: 14px;

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
					color:#101010;
					background:var(--colorful-button);
					border-radius: var(--radius);
					min-width:120px;

				}
			}
		}
	}
</style>
