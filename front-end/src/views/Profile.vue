<template>
	<section>
		<section class="profile" v-if="profile"> <!-- :class="{'editable':isYourProfile}" -->

			<section class="banner">
				<figure class="image" :style="`background-image:url(${bannerImage})`"></figure>
				<section class="corners">
					<div></div>
					<div></div>
				</section>
				<!--<figure class="edit" v-if="isYourProfile">-->
					<!--<div>-->
						<!--<i class="fas fa-image"></i> Click your header or profile image to edit it-->
					<!--</div>-->
				<!--</figure>-->
			</section>
			<figure class="banner-placeholder"></figure>

			<figure class="avatar">
				<!--<figure class="image" :style="`background-image:url(${bannerImage})`"></figure>-->
				<img class="image" :src="`data:image/png;base64, ${identicon(profile.name)}`" />
			</figure>

			<section class="header">
				<section>
					<figure class="name">{{profile.name}}</figure>
					<figure class="overview">
						<!--<span>Potential <b>{{parseFloat(profile.snapshot.potential).toFixed(2)}}</b></span>-->
						<span>Influence <b>{{parseInt(profile.snapshot.influence)}}</b></span>
						<span>Subscribers <b>{{parseInt(profile.snapshot.subscribers)}}</b></span>
					</figure>
				</section>
				<section>
					<i class="fa-lightbulb" :class="theme === 'dark' ? 'fas' : 'far'" @click="toggleTheme"></i>
					<!--<i v-if="isYourProfile" class="fas fa-cog"></i>-->
					<i v-if="isYourProfile" @click="logout" class="fas fa-power-off"></i>
					<button v-if="!isYourProfile" @click="subscribe">
						<span v-if="!isSubscribed && !subscribing">Subscribe</span>
						<span v-if="isSubscribed && !subscribing">Unsub</span>
						<i class="fas fa-spin fa-spinner" v-if="subscribing"></i>
					</button>
				</section>
			</section>

			<!--<section class="portfolio-container">-->
				<!--&lt;!&ndash;<label>{{isYourProfile ? 'Your' : `${profile.name}'s`}} current portfolio</label>&ndash;&gt;-->
				<!--<section class="portfolio">-->
					<!--<ContentPortfolio :portfolio="{snapshot:profile.snapshot}" :details="[-->
					<!--// ['Saved versus earned','84%'],-->
				<!--]" :show-comparison="!isYourProfile" />-->
				<!--</section>-->
			<!--</section>-->

			<Achievements :user-id="profile.id" />

			<!--<section class="edit-portfolio" v-if="isYourProfile">-->
				<!--<section class="how-to-edit">-->
					<!--<label>Manage your portfolio</label>-->
					<!--<p>-->
						<!--The more information you add to your portfolio, the better the advice you will get from-->
						<!--users on finfluencers. We also use your portfolio data to show you content which is slightly-->
						<!--above your current potential score, so that you can progress gradually.-->
						<!--<br />-->
						<!--<br />-->
						<!--<b>-->
							<!--<u>Automation is key to financial stability.</u>-->
							<!--Consider linking your Bank and Blockchain accounts so that you don't have to track-->
							<!--them manually.-->
						<!--</b>-->
					<!--</p>-->
				<!--</section>-->
				<!--<section class="portfolio-actions">-->
					<!--<section class="action" v-for="action in PORTFOLIO_ACTIONS">-->
						<!--<i :class="action.icon"></i>-->
						<!--<span>{{action.text}}</span>-->
					<!--</section>-->
				<!--</section>-->

			<!--</section>-->

			<SpreadBar />

			<Content :key="content.id" :content="content" v-for="content in contents" />
		</section>
	</section>

</template>

<script>
	import ColorBlast from '../components/svgs/ColorBlast';
	import ContentPortfolio from '../components/ContentPortfolio';
	import PostContent from '../components/PostContent';
	import Achievements from '../components/Achievements';
	import Content from '../components/Content';
	import {mapActions, mapState} from "vuex";
	import * as ApiService from "../services/ApiService";
	import {INTERACTION_TYPE} from "@finfluencers/shared/models/InteractionType";
	import {EventBus} from "../services/EventBus";
	import identicon from '../util/identicon';

	const PORTFOLIO_ACTIONS = [
		{
			id:0,
			text:'Link Bank',
			icon:'fas fa-university'
		},
		{
			id:0,
			text:'Link Crypto',
			icon:'fas fa-coins'
		},
		{
			id:1,
			text:'Manage Income',
			icon:'fas fa-money-bill-wave'
		},
		{
			id:1,
			text:'Manage Expenses',
			icon:'fas fa-receipt'
		},
		{
			id:1,
			text:'Manage Savings',
			icon:'fas fa-piggy-bank'
		},
		{
			id:1,
			text:'Manage Investments',
			icon:'fas fa-chart-line'
		},
	];

	export default {
		components:{
			ColorBlast,
			PostContent,
			Content,
			ContentPortfolio,
			Achievements,
		},
		data(){return {
			profile:null,
			PORTFOLIO_ACTIONS,
			subscribing:false,
		}},
		beforeMount(){
			EventBus.$emit('loading', true);
		},
		async mounted(){
			await this.load();
			EventBus.$emit('loading', false);
		},
		computed:{
			...mapState([
				'contents',
				'user',
				'theme',
			]),
			isYourProfile(){
				return this.user && this.user.id === this.profile.id;
			},
			isSubscribed(){
				return this.profile.interactions.find(x => x.type === INTERACTION_TYPE.SUBSCRIBE)
			},
			bannerImage(){
				return null;
				return `
				https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80
				`.trim();
			}
		},
		methods:{
			toggleTheme(){
				EventBus.$emit('toggle-theme');
			},
			async load(){
				this.profile = await ApiService.getUser(this.$route.params.user);
				console.log('profile', this.profile);
				if(!this.profile) return this.$router.replace('/404');
				await ApiService.setFeedContents({profile:this.profile.id})
			},
			logout(){
				this.setUser(null);
				ApiService.clearToken();
				this.$router.push('/');
			},
			async subscribe(){
				this.subscribing = true;
				const subscribed = await ApiService.subscribe(this.profile.id);
				if(subscribed) this.profile = await ApiService.getUser(this.$route.params.user);
				this.subscribing = false;
			},
			identicon,
			...mapActions([
				'setUser',
			])
		},
		watch:{
			'$route.params.user'(){
				this.load();
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.profile {
		padding-bottom:150px;

		$avatar:150px;
		$banner:200px;
		$corner:60px;

		.banner, .avatar {

			.image {
				width:100%;
				height:100%;
				background-position: center;
				background-size: cover;
				opacity:1;
				transition: opacity 0.2s ease;
			}
		}

		.avatar {
			background:var(--colorful-button);
			.image {
				width:50%;
				height:50%;
			}
		}


		&.editable {
			.banner, .avatar {
				background-color:rgba(0,0,0,0.2);
				.image {
					cursor: pointer;


					&:hover {
						opacity:0;
					}
				}
			}
		}

		.banner {
			height:#{$banner + $corner*2};
			position:absolute;
			top:-20px;
			left:-50%;
			right:-50%;
			box-shadow:inset 0 -80px 120px rgba(0,0,0,0.06);
			z-index:0;
			overflow: hidden;

			.edit {
				position:absolute;
				bottom:80px;
				left:0;
				right:0;
				font-size: 14px;
				pointer-events: none;

				transition: color 0.2s ease;

				div {
					background:var(--highlight);
					color:#fff;
					display:table;
					margin:0 auto;
					padding:10px 20px;
					border-radius:50px;
					box-shadow:0 3px 10px rgba(0,0,0,0.2);

					i {
						margin-right:15px;
					}
				}

			}

			&:after {
				content:'';
				display:block;
				position: absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				//background:linear-gradient(0deg, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0) 60%);
				z-index:-1;
			}

			.corners {
				position:absolute;
				bottom:0;
				left:$corner;
				right:$corner;
				height:$corner;
				background:var(--background-color);
				z-index:2;

				div {
					border-radius:50%;
					height:#{$corner*2};
					width:#{$corner*2};
					position:absolute;
					background:var(--background-color);
					bottom:-$corner;

					&:first-child {
						left:-$corner;
					}

					&:last-child {
						right:-$corner;
					}
				}
			}
		}
		.banner-placeholder {
			height:#{$banner - 22px};
		}

		.avatar {
			position: relative;
			z-index:2;

			border-radius:50%;
			width:$avatar;
			height:$avatar;
			margin-top:-#{$avatar/2 + $banner/4};
			margin-left:-#{$avatar/3};

			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 48px;
			color:var(--text-primary);
			overflow: hidden;

			transform:rotateZ(-30deg);

			@media only screen and (max-width:$breakpoint) {
				margin-left:0;
			}
		}

		.header {
			text-align: left;
			margin-top:20px;
			display:flex;
			justify-content: space-between;
			align-items: center;

			@media only screen and (max-width:$breakpoint) {
				align-items: flex-start;
			}

			section {
				&:last-child {
					justify-self: flex-end;

					i {
						font-size: 22px;
						padding:10px;
						margin-top:5px;
						vertical-align: sub;
						display:inline-block;
						margin-right:10px;
						cursor: pointer;
						color:var(--text-secondary);
						opacity:0.5;

						transition: all 0.2s ease;
						transition-property: opacity, color;

						&:hover {
							opacity:1;
							color:var(--text-primary);
						}
					}

					button {
						background:var(--text-primary);
						color:var(--background-color);
						border-radius:50px;
						padding:0 10px;
						height:40px;
						width:150px;
						outline:0;
						border:0;
						font-size: 14px;
						font-weight: bold;
						margin-top:30px;
						cursor: pointer;

						@media only screen and (max-width:$breakpoint) {
							justify-self: flex-start;
							margin-top:0;
						}

						i {
							font-size: 14px;
						}
					}
				}
			}

			.name {
				font-size: 20px;
				font-weight: bold;
				color:var(--text-primary);
				margin-bottom:10px;
			}

			.overview {

				span {
					margin-right:40px;
					color:var(--text-secondary);
					font-size: 14px;

					@media only screen and (max-width:$breakpoint) {
						display:table;
						margin-bottom:2px;
					}

					b {
						margin-left:3px;
						padding:4px 2px 5px;
						border-radius:50px;
						color:var(--highlight);
						font-size: 18px;
						font-weight: 800;

						@media only screen and (max-width:$breakpoint) {
							padding:4px 8px 5px;
							border:0;
						}
					}
				}
			}
		}

		.portfolio-container {
			margin:20px 0 30px;
			text-align:left;

			label {
				font-size: 13px;
				font-weight: bold;
				color:var(--text-secondary);
			}

			.portfolio {
				margin-top:10px;
				padding:20px;
				box-shadow:var(--soft-shadow);
				border-radius:var(--radius);
				background:var(--content-bg);
			}
		}

		.edit-portfolio {
			margin-top:70px;
			display:flex;
			align-items: center;

			.how-to-edit {
				text-align:left;
				flex:1;
				position: relative;
				padding-right:50px;

				> label {
					font-size: 18px;
					font-weight: 300;
					color:var(--text-primary);
				}

				> p {
					font-size: 13px;
					max-width:500px;
					margin-top:10px;
					color:var(--text-secondary);
				}
			}

			.portfolio-actions {
				display:flex;
				flex-wrap: wrap;
				flex:1;
				position: relative;
				z-index:2;
				justify-content: center;
				padding-left:10px;

				&:after {
					content:'';
					display:block;
					position:absolute;
					left:0;
					top:0;
					bottom:0;
					width:1px;
					background:var(--text-secondary);
					opacity:0.2;
				}

				$action:calc(33.3% - 10px);
				.action {
					cursor: pointer;
					display:flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding:18px;
					margin:20px 5px;
					width:$action;
					height:$action;
					border-radius:var(--radius);


					i {
						font-size: 16px;
						color:var(--text-primary);
						opacity:0.1;

						transition: all 0.2s ease;
						transition-property: color, opacity;
					}

					span {
						font-size: 13px;
						margin-top:10px;
						color:var(--text-primary);

						transition: all 0.2s ease;
						transition-property: color, opacity;
					}

					&:hover {
						i {
							opacity:1;
						}

						span {
							color:var(--text-primary);
						}
					}
				}
			}
		}

	}

	.dark {
		.banner {
			background:rgba(0,0,0,0.25);
		}
	}
</style>
