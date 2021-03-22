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
					<figure class="name">testing user</figure>
					<figure class="overview">
						<span>1.2m wealth</span>
						<span>2.3k followers</span>
						<span>+20% last 7 days</span>
					</figure>
				</section>
				<section>
					<i class="fas fa-cog"></i>
					<button>Follow</button>
				</section>
			</section>

			<section class="portfolio-container">
				<label>{{profile.name}}'s portfolio</label>
				<section class="portfolio">
					<ContentPortfolio :totals="['82%', 'Wealth Score']" :details="[
					['Saved versus earned','84%'],
				]" :show-comparison="user && user.id !== profile.id" />
				</section>
			</section>


			<SpreadBar />

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

	export default {
		components:{
			ColorBlast,
			PostContent,
			Content,
			ContentPortfolio,
		},
		data(){return {
			profile:null,
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
	}
</style>
