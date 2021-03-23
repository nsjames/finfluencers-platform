<template>
	<section>
		<section class="profile" v-if="profile">

			<section class="banner" :style="`background-image:url(${bannerImage})`">
				<section class="corners">
					<div></div>
					<div></div>
				</section>
			</section>
			<figure class="banner-placeholder"></figure>

			<figure class="avatar" :style="`background-image:url(${bannerImage})`"></figure>

			<section class="header">
				<section>
					<figure class="name">{{profile.name}}</figure>
					<figure class="overview">
						<span>{{parseFloat(profile.wealth).toFixed(2)}}% WS</span>
						<span>2.3k followers</span>
						<span>1.1m posts</span>
					</figure>
				</section>
				<section>
					<i v-if="isYourProfile" class="fas fa-cog"></i>
					<button v-if="!isYourProfile">Follow</button>
				</section>
			</section>

			<section class="portfolio-container">
				<label class="feed-title">{{isYourProfile ? 'Your' : `${profile.name}'s`}} feed</label>
				<section class="portfolio">
					<ContentPortfolio :wealth="parseFloat(profile.wealth).toFixed(2)" :details="[
					['Saved versus earned','84%'],
				]" :show-comparison="!isYourProfile" />
				</section>
			</section>

			<section class="edit-portfolio" v-if="isYourProfile">
				<section class="how-to-edit">
					<label>Manage your portfolio</label>
					<p>
						The more information you add to your portfolio, the better the advice you will get from
						users on finfluencers. We also use your portfolio data to show you content which is slightly
						above your current wealth score, so that you can progress gradually.
						<br />
						<br />
						<b>
							<u>Automation is key to financial stability.</u>
							Consider linking your Bank and Blockchain accounts so that you don't have to track
							them manually.
						</b>
					</p>
				</section>
				<section class="portfolio-actions">
					<section class="action" v-for="action in PORTFOLIO_ACTIONS">
						<i :class="action.icon"></i>
						<span>{{action.text}}</span>
					</section>
				</section>

			</section>

			<SpreadBar :margin="isYourProfile ? 150 : 70" />

			<Content :key="content.id" :content="content" v-for="content in contents" />
		</section>
	</section>

</template>

<script>
	import ColorBlast from '../components/svgs/ColorBlast';
	import ContentPortfolio from '../components/ContentPortfolio';
	import PostContent from '../components/PostContent';
	import Content from '../components/Content';
	import {mapState} from "vuex";
	import * as ApiService from "../services/ApiService";

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
		},
		data(){return {
			profile:null,
			PORTFOLIO_ACTIONS,
		}},
		async mounted(){
			this.profile = await ApiService.getUser(this.$route.params.user);
			if(!this.profile) return this.$router.push('/404');
			ApiService.setFeedContents({profile:this.$route.params.user})
		},
		computed:{
			...mapState([
				'contents',
				'user',
			]),
			isYourProfile(){
				return this.user && this.user.id === this.profile.id;
			},
			bannerImage(){
				return `
				https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80
				`.trim();
			}
		},
	}
</script>

<style lang="scss" scoped>

	.profile {
		$avatar:150px;
		$banner:300px;
		$corner:60px;

		.banner {
			height:#{$banner + $corner*2};
			position:absolute;
			top:-20px;
			left:-50%;
			right:-50%;
			background-position: center;
			background-size: cover;
			z-index:-1;

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
			height:#{$banner};
		}

		.avatar {

			border-radius:50%;
			width:$avatar;
			height:$avatar;
			margin-top:-#{$avatar/2 + $banner/4};
			margin-left:-#{$avatar/3};
			background-position: center;
			background-size: cover;
		}

		.header {
			text-align: left;
			margin-top:20px;
			display:flex;
			justify-content: space-between;
			align-items: center;

			section {
				&:last-child {
					justify-self: flex-end;

					i {
						font-size: 22px;
						padding:10px;
						margin-top:5px;
						display:inline-block;
						margin-right:10px;
						cursor: pointer;
					}

					button {
						background:var(--landing-button);
						color:var(--background-color);
						border-radius:50px;
						padding:14px 40px;
						outline:0;
						border:0;
						font-size: 14px;
						font-weight: bold;
						margin-top:30px;
						cursor: pointer;
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
				}
			}
		}

		.portfolio-container {
			margin-top:40px;
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
</style>
