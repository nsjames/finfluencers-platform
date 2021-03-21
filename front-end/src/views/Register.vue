<template>
	<section class="register">

		<section class="colors">
			<svg width="633" height="439" viewBox="0 0 633 439" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.9" fill-rule="evenodd" clip-rule="evenodd" d="M0 0C41.8553 25.2769 59.2505 97.0506 78.2358 175.385C122.911 359.717 176.391 580.378 578.109 317C646.825 208.262 646.321 94.3826 599.441 0H0Z" fill="#B3B3FF" fill-opacity="0.7"/>
			</svg>

			<svg width="396" height="547" viewBox="0 0 396 547" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g style="mix-blend-mode:lighten" opacity="0.6">
					<path d="M378.931 298.229C339.847 453.844 219.048 564.177 109.121 544.665C-57.7819 485.809 4.32856 299.848 59.0605 186.813C142.206 15.0973 169.701 -14.0841 279.628 5.4276C389.555 24.9393 418.016 142.614 378.931 298.229Z" fill="#EEFFAA"/>
				</g>
			</svg>

			<svg width="472" height="397" viewBox="0 0 472 397" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path opacity="0.9" fill-rule="evenodd" clip-rule="evenodd" d="M471.892 0.000182996L17.2755 0.000182996C-21.6908 157.492 1.7681 351.11 123.568 388.035C266.98 431.512 358.242 309.776 422.711 175.455C445.682 127.595 465.754 66.7184 471.892 0.000182996Z" fill="#94FFB2" fill-opacity="0.5"/>
			</svg>

			<svg width="374" height="419" viewBox="0 0 374 419" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g style="mix-blend-mode:lighten" opacity="0.9">
					<path d="M83.9362 367.991C-4.94639 298.304 -26.3062 166.835 36.2277 74.3457C151.155 -59.4627 257.471 14.3894 310.244 88.2297C390.414 200.404 391.063 254.253 328.53 346.741C265.996 439.23 172.819 437.678 83.9362 367.991Z" fill="#EEFFAA"/>
				</g>
			</svg>




		</section>

		<section class="pop-over">
			<section class="panel">

				<transition name="state-switch" mode="out-in">
					<section class="container" key="STATES.LOADING" v-if="state === STATES.LOADING">
						<section class="loading">
							<i class="fas fa-spinner fa-spin"></i>
						</section>
					</section>

					<section class="container" key="STATES.ERROR" v-if="state === STATES.ERROR">
						<section class="title">Oh shit.</section>
						<section class="subtitle">
							{{error}}
						</section>
						<button class="black">Go Back</button>
					</section>

					<section class="container" key="STATES.ACCESS_CODE" v-if="state === STATES.ACCESS_CODE">
						<section class="title">VIP access only</section>
						<section class="subtitle">
							We're on a throttled launch, so you must have an un-used access code in order to create
							an account.
							<br />
							<br />
							We will be gradually sending out invites as we progress, so if you don't get a
							code right away just sit tight.
						</section>

						<input class="vip" placeholder="Access Code" />
						<section class="vip-access">
							<section>
								Think you deserve access? <a href="mailto:test@test.com">Email us and tell us why.</a>
							</section>
						</section>
						<SpreadBar :margin="40" />
						<button @click="validateAccessCode">Check access code</button>
					</section>

					<section class="container" key="STATES.BASIC_INFO" v-if="state === STATES.BASIC_INFO">
						<section class="title">You're in!</section>
						<section class="subtitle">
							Looks like you've found one of our lucky golden tickets. You're a single step away
							from an entire financial sandbox and playground.
						</section>

						<input placeholder="Choose your username" />
						<input placeholder="Enter your email" />
						<section class="split-inputs">
							<input placeholder="Password" type="password" />
							<input placeholder="Re-type password" type="password" />
						</section>
						<button @click="$router.push('/explore')">Create account</button>

						<figure class="or">OR</figure>

						<section class="socials">
							<button class="social">
								<i class="fab fa-google"></i>
							</button>
							<button class="social">
								<i class="fab fa-twitter"></i>
							</button>
						</section>
					</section>
				</transition>
			</section>
		</section>
	</section>

</template>

<script>

	const STATES = {
		ACCESS_CODE:0,
		BASIC_INFO:1,
		ERROR:98,
		LOADING:99,

	};

	export default {
		components:{
		},
		data(){return {
			STATES,
			state:STATES.ACCESS_CODE,
			error:null,
		}},
		mounted(){
			document.documentElement.className = 'light';
		},
		destroyed(){
			if(this.$route.path === '/') return;
			document.documentElement.className = localStorage.getItem('theme') || 'light';
		},
		methods:{
			async validateAccessCode(){
				this.state = STATES.LOADING;
				await new Promise(r => setTimeout(r, 1500));
				this.state = STATES.BASIC_INFO;
			}
		}
	}
</script>

<style lang="scss" scoped>

	.register {
		display:flex;
		flex-direction: row;
		min-height:100vh;
		max-width:1366px;
		margin:0 auto;
		padding:0 30px;
		overflow-x: hidden;
		position: relative;
		justify-content: center;


		.state-switch-enter-active, .state-switch-leave-active {
			transition: all 0.1s ease;
			transition-property: transform, opacity;
		}
		.state-switch-enter, .state-switch-leave-to /* .state-switch-leave-active below version 2.1.8 */ {
			transform:translateY(10px);
			opacity:0;
		}

		.colors {
			position:absolute;
			right:0;
			top:0;
			bottom:0;
			left:0;
			z-index:-1;
			background:var(--background-color);
			//overflow:hidden;


			svg {
				position:absolute;

				&:nth-child(1){
					left:80px;
					top:-20px;
					opacity:0.9;
				}

				&:nth-child(2){
					top:200px;
					left:230px;
					mix-blend-mode: lighten;
					z-index:2;
				}

				&:nth-child(3){
					top:0;
					right:100px;
					opacity:.8;
				}

				&:nth-child(4){
					top:200px;
					right:300px;
					mix-blend-mode: lighten;
					z-index:2;
				}
			}
		}

		.pop-over {
			flex:0 0 auto;
			max-width:650px;
			width:100%;
			height:100vh;
			box-shadow:var(--soft-shadow);
			border-radius:50px;
			border-bottom-right-radius:0;
			border-bottom-left-radius:0;
			z-index:2;
			position: relative;
			background:var(--background-color);
			display:flex;
			align-items: center;
			justify-content: center;

			.loading {
				display:flex;
				align-items: center;
				justify-content: center;
				font-size: 48px;
				color:var(--highlight);
				opacity:0.2;
			}

			label {
				font-size: 16px;
				font-weight: bold;
				margin-bottom:10px;
			}

			.panel {
				display:flex;
				flex-direction: column;
				text-align:left;
				width:100%;
				margin:0 100px;
				position: relative;
				z-index:2;

				.container {
					display:flex;
					flex-direction: column;
					width:100%;
					position: relative;
					z-index:2;
				}

				.vip-access {
					box-shadow:0 0 0 1px #CFFFDC;
					background: rgba(222, 255, 231, 0.5);
					padding:10px;
					border-radius:var(--radius);

					> section {
						background:var(--background-color);
						padding:20px 30px;
						display:flex;
						font-size: 12px;

						a {
							margin-left:5px;
							color:var(--highlight);
							font-weight: bold;
							text-decoration: underline;
							cursor: pointer;
						}
					}
				}


				.title {
					font-size: 32px;
					color:var(--text-primary);
					font-weight: bold;
					margin:10px 0;
				}

				.subtitle {
					font-size: 16px;
					color:var(--text-primary);
					max-width:600px;
					margin-bottom:50px;
				}

				input {
					border:2px solid var(--graph-bg);
					border-radius:var(--radius);
					height:44px;
					padding:0 20px;
					margin-bottom:10px;
					color:var(--text-primary);
					flex:1 0 auto;

					&:nth-child(2){
						margin-left:10px;
					}

					&.vip {
						height:80px;
						text-align:center;
						font-size: 20px;
						font-weight: 300;
					}
				}

				.split-inputs {
					display:flex;
					justify-content: space-between;
					align-items: center;
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
					height:50px;
					margin-top:10px;
					cursor: pointer;
					display:flex;
					align-items: center;
					justify-content: center;

					&.social {
						background:#F6F6F6;
					}

					&.black {
						background:var(--landing-button);
						color:var(--background-color);
						border-radius:50px;
						padding:14px 40px;
						outline:0;
						border:0;
						font-size: 14px;
						font-weight: bold;
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
					max-width:400px;
					margin:0 auto;

					button {
						font-size: 20px;
						height:50px;
						display:flex;
						align-items: center;
						justify-content: center;
						flex:0 0 auto;
						padding:0 60px;

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
