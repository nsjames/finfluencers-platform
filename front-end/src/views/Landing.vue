<template>
	<section class="landing">
		<section class="info">
			<section class="limiter">
				<section>
					<!--<section class="pre-title">Welcome!</section>-->
					<Logo class="logo" />
					<section class="title">finfluencers</section>
					<section class="subtitle">
						This is where money <b>lives.</b> Everyone here has the same goal,
						and no-one is hiding it. Feel free to do the same and let it all out.
					</section>

					<section class="checklist">
						<figure :key="item" v-for="(item,i) in checklist">
							<div></div>
							<b v-if="i === checklist.length-1">{{item}}</b>
							<span v-else>{{item}}</span>
						</figure>
					</section>

					<button @click="$router.push('/register')">Oh, hell yes.</button>
				</section>
			</section>
		</section>
		<section class="colors">
			<svg width="558" height="535" viewBox="0 0 558 535" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.9" d="M379.038 44.4998C518.699 125.133 613.686 259.589 519.341 423C344.949 667.055 313.162 449.376 229.341 351C102.006 201.552 0.599964 309 0.59996 153.973C94.9451 -9.43771 239.376 -36.1338 379.038 44.4998Z" fill="#B3B3FF" fill-opacity="0.7"/>
			</svg>

			<svg width="331" height="568" viewBox="0 0 331 568" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g style="mix-blend-mode:lighten" opacity="0.8">
					<path d="M325.501 236.852C353.504 395.669 267.646 543.558 133.73 567.171C-83.1926 575.973 27.198 409.345 36.7719 284C51.3159 93.5815 -57.3968 27.156 76.5187 3.54307C210.434 -20.0699 297.497 78.0352 325.501 236.852Z" fill="#EEFFAA"/>
				</g>
			</svg>

			<svg width="583" height="700" viewBox="0 0 583 700" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.9" d="M528.8 438.811C442.117 588.951 303.226 761.35 156.8 676.811C-59.2924 516.051 -9.94063 319.381 63.6814 204.389C142.8 80.8109 254.8 -31.1887 430.8 8.81082C606.801 48.8103 615.484 288.67 528.8 438.811Z" fill="#94FFB2" fill-opacity="0.5"/>
			</svg>
		</section>
		<section class="side-panel">
			<section class="panel">
				<label>Sign in</label>
				<input placeholder="Your email" v-model="email" />
				<input placeholder="Password" type="password" v-model="password" />
				<button @click="login">Log in</button>

				<figure class="secondary-action">
					Want to <router-link tag="span" to="/register">create an account</router-link> instead?
				</figure>

				<!--<figure class="or">OR</figure>-->

				<!--<section class="socials">-->
					<!--<button class="social">-->
						<!--<i class="fab fa-google"></i>-->
					<!--</button>-->
					<!--<button class="social">-->
						<!--<i class="fab fa-twitter"></i>-->
					<!--</button>-->
				<!--</section>-->
			</section>
		</section>
	</section>

</template>

<script>

	import * as ApiService from "../services/ApiService";

	const checklist = [
		'Join like-minded people just learning how to grow their portfolios',
		'Track investing trends from all financial worlds',
		'Share and gather financial intelligence',
		'Become a financial influencer',
	]

	export default {
		components:{

		},
		data(){return {
			checklist,
			email:'',
			password:'',
		}},
		mounted(){
			document.documentElement.className = 'light';
		},
		destroyed(){
			if(this.$route.path === '/register') return;
			document.documentElement.className = localStorage.getItem('theme') || 'light';
		},
		methods:{
			async login(){
				const login = await ApiService.login(this.email, this.password);

				if(login) this.$router.push('/explore');
			},
		}
	}
</script>

<style lang="scss" scoped>

	.landing {
		display:flex;
		flex-direction: row;
		height:100vh;
		max-width:1366px;
		margin:0 auto;
		padding:0 30px;
		overflow-x: hidden;
		position: relative;

		.info {
			height:100vh;
			flex:1;
			margin-right:-50px;
			z-index:1;
			position: relative;
			text-align:left;
			padding-right:80px;

			.limiter {
				display:flex;
				flex-direction: column;
				justify-content: center;
				height:100vh;
			}

			.pre-title {
				font-size: 16px;
				color:var(--text-secondary);
				font-weight: bold;
			}

			.logo {
				fill:var(--shark-fin);
				width:80px;
				height:auto;
			}

			.title {
				font-size: 32px;
				color:var(--text-primary);
				font-weight: bold;
				margin:0 0 30px 0;
			}

			.subtitle {
				font-size: 20px;
				color:var(--text-primary);
				max-width:600px;
			}

			.checklist {
				margin-top:40px;

				figure {
					display:flex;
					align-items: center;
					margin-bottom:20px;
					max-width:450px;

					font-size: 14px;
					color:var(--text-secondary);

					$circle:12px;
					div {
						flex:0 0 auto;
						display:inline-block;
						margin-right:20px;
						height:$circle;
						width:$circle;
						box-shadow:0 0 0 4px var(--highlight);
						border-radius:50%;
						opacity:0.2;
					}
				}
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

		.colors {
			position:absolute;
			right:370px;
			top:0;
			bottom:0;
			left:0;
			overflow:hidden;
			z-index:-1;
			background:var(--background-color);


			svg {
				position:absolute;

				&:nth-child(1){
					right:-20px;
					top:-200px;
					opacity:0.8;
				}

				&:nth-child(2){
					top:120px;
					right:-140px;
					mix-blend-mode: lighten;
					z-index:2;
				}

				&:nth-child(3){
					top:500px;
					right:-90px;
					opacity:.8;
				}
			}
		}

		.side-panel {
			flex:0 0 auto;
			max-width:440px;
			width:100%;
			height:100vh;
			box-shadow:var(--soft-shadow);
			border-radius:50px;
			border-bottom-right-radius:0;
			border-top-right-radius:0;
			z-index:2;
			position: relative;
			background:var(--background-color);
			display:flex;
			align-items: center;
			justify-content: center;

			&:after {
				content:'';
				display:block;
				position:absolute;
				top:0;
				bottom:0;
				left:200px;
				width:100vh;
				background:var(--background-color);
				z-index:-1;
			}

			.panel {
				display:flex;
				flex-direction: column;
				text-align:left;
				width:100%;
				margin:0 80px;
				position: relative;
				z-index:2;

				label {
					font-size: 16px;
					font-weight: bold;
					margin-bottom:20px;
				}

				input {
					border:2px solid var(--graph-bg);
					border-radius:var(--radius);
					height:44px;
					padding:0 20px;
					margin-bottom:10px;
					color:var(--text-primary);
				}

				button {
					background:var(--colorful-button);
					color:var(--text-primary);
					border-radius:50px;
					padding:14px 40px;
					outline:0;
					border:0;
					font-size: 14px;
					font-weight: bold;
					margin-top:10px;
					cursor: pointer;
					display:flex;
					align-items: center;
					justify-content: center;

					&.social {
						background:#F6F6F6;
					}
				}

				.secondary-action {
					text-align:center;
					margin-top:20px;
					font-size: 13px;

					span {
						text-decoration: underline;
						cursor: pointer;
					}
				}

				.or {
					margin-top:20px;
					margin-bottom:10px;
					display:flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					color:var(--text-secondary);
				}

				.socials {
					display:flex;

					button {
						font-size: 20px;
						flex:1;
						display:flex;
						align-items: center;
						justify-content: center;

						&:first-child {
							margin-right:10px;
						}

						&:last-child {
							margin-left:10px;
						}
					}
				}

			}
		}
	}
</style>
