<template>
	<section class="onboarding">

		<section class="back-button" v-if="canGoBack" @click="goBack">
			<i class="fas fa-chevron-left"></i>
		</section>
		<transition name="onboarding" mode="out-in">

			<!-- ACCESS CODE -->
			<section class="limiter" key="STATES.CODE" v-if="state === STATES.CODE">
				<h4>Are you really</h4>
				<h1>supposed to be here?</h1>
				<p>
					You must be invited to <b>finfluencers</b> before you can access the platform.
					Enter your access code to check if you're allowed in.
				</p>

				<section class="account-details">
					<input v-model="code" class="big" placeholder="ACCESS CODE" />
					<section class="vip-access">
						<section>
							Think you deserve access? <a href="mailto:test@test.com">Email us and tell us why.</a>
						</section>
					</section>
				</section>

				<button :disabled="loading" @click="validateAccessCode">Check <b>Code</b></button>
			</section>

			<!-- THEME -->
			<section class="limiter" key="STATES.THEME" v-if="state === STATES.THEME">
				<h4>Before we start, you have to</h4>
				<h1>choose your theme</h1>
				<p>
					The most exciting moment when selecting a new car, is choosing the color.
					Changing this later won't cost you an arm and a leg though.
				</p>

				<section class="select-options two">
					<!-- PRO Theme -->
					<section class="option">
						<section class="graphic">
							<i class="far fa-lightbulb"></i>
						</section>
						<button @click="selectTheme('light')" @mouseenter="setNewTheme('light')">Select <b>Light</b></button>
					</section>
					<!-- DARK Theme -->
					<section class="option">
						<section class="graphic">
							<i class="fas fa-lightbulb"></i>
						</section>
						<button @click="selectTheme('dark')" @mouseenter="setNewTheme('dark')">Select <b>Midnight</b></button>
					</section>
				</section>
			</section>

			<!-- TYPE -->
			<section class="limiter" key="STATES.TYPE" v-if="state === STATES.TYPE">
				<h4>Do you want to</h4>
				<h1>learn, or influence?</h1>
				<p>
					You can use this setting to tailor your Finfluencers experience to your current needs.
					You can change this whenever you like.
				</p>

				<section class="select-options two">
					<!-- PRO Theme -->
					<section class="option">
						<section class="graphic">
							<i class="fas fa-graduation-cap"></i>
						</section>
						<h2>Learn</h2>
						<p>
							If you are struggling to take hold of your finances,
							or just want some great tips, this is for you.
						</p>
						<button @click="() => {state = STATES.FINANCIAL_INFO; defaultAccountType = 0}">I want to <b>learn</b></button>
					</section>
					<!-- DARK Theme -->
					<section class="option">
						<section class="graphic">
							<i class="fas fa-bullhorn" style="transform:rotateZ(-20deg);"></i>
						</section>
						<h2>Influence</h2>
						<p>
							Step up to the plate and take your shot at proving yourself a true financial influencer.
						</p>
						<button @click="() => {state = STATES.STRENGTHS; defaultAccountType = 1}">I am a <b>finfluencer</b></button>
					</section>
				</section>
			</section>

			<!-- FINANCIAL INFO -->
			<section class="limiter" key="STATES.FINANCIAL_INFO" v-if="state === STATES.FINANCIAL_INFO">
				<h4>You have to be honest about</h4>
				<h1>a few things</h1>
				<p>
					This platform is engineered to help you make better financial decisions. However, this only
					works well when you actually open up about your financial situation.
				</p>

				<section class="financial-details">
					<label>How are you doing month to month?</label>
					<br />
					<br />

					<section class="income-expense">
						<section class="range">
							<figure class="title">INCOME</figure>
							<section class="slider">
								<b-field>
									<b-slider v-model="monthlyIncome" :tooltip="false" :min="200" :max="20000" :step="100" rounded>
										<b-slider-tick :value="0" v-if="monthlyIncome > 1000">$200</b-slider-tick>
										<b-slider-tick :value="monthlyIncome"><b>${{formatNumber(monthlyIncome)}}{{monthlyIncome === 20000 ? '+' : ''}}</b></b-slider-tick>
									</b-slider>
								</b-field>
							</section>
						</section>

						<section class="range">
							<figure class="title">EXPENSES</figure>
							<section class="slider">
								<b-field>
									<b-slider v-model="monthlyExpenses" :tooltip="false" :min="200" :max="20000" :step="100" rounded>
										<b-slider-tick :value="monthlyExpenses"><b>${{formatNumber(monthlyExpenses)}}{{monthlyExpenses === 20000 ? '+' : ''}}</b></b-slider-tick>
										<b-slider-tick :value="20000" v-if="monthlyExpenses < 19000">${{formatNumber(20000)}}+</b-slider-tick>
									</b-slider>
								</b-field>
							</section>
						</section>
					</section>

					<section class="checklist">
						<b-field>
							<b-checkbox>I have <span class="highlight">${{monthlyIncome / 10}}+</span> in savings</b-checkbox>
						</b-field>
						<b-field>
							<b-checkbox>I have investments</b-checkbox>
						</b-field>
						<b-field>
							<b-checkbox>I have real-estate</b-checkbox>
						</b-field>
						<b-field>
							<b-checkbox>I have a pension</b-checkbox>
						</b-field>
					</section>

					<button @click="state = STATES.GOALS">Go to <b>Goals</b></button>
				</section>

			</section>

			<!-- GOALS -->
			<section class="limiter" key="STATES.GOALS" v-if="state === STATES.GOALS">
				<h4>Okay then</h4>
				<h1>what are your goals?</h1>
				<p>
					There's an entire world of help at your fingertips, but it's going to be useless unless
					you share what it is you're looking for. Select all relevant goals below.
				</p>

				<section class="select-options three">
					<!-- Personal Finance -->
					<section class="option clickable" @click="toggleGoal('personal')">
						<section class="graphic" :class="{'opaque':!goals['personal']}">
							<i class="fas fa-wallet"></i>
						</section>
						<h2 :class="{'highlight':strengths['personal']}">Personal Finance</h2>
						<p>
							Budgets, savings, loans, taxes, credit scores, and everything in between.
						</p>
					</section>

					<!-- Investing -->
					<section class="option clickable" @click="toggleGoal('investing')">
						<section class="graphic" :class="{'opaque':!goals['investing']}">
							<i class="fas fa-chart-line"></i>
						</section>
						<h2 :class="{'highlight':strengths['investing']}">Investing</h2>
						<p>
							Follow trends in stocks, crypto, forex, real estate, and more.
						</p>
					</section>

					<!-- Funding -->
					<section class="option clickable" @click="toggleGoal('funding')">
						<section class="graphic" :class="{'opaque':!goals['funding']}">
							<i class="fas fa-dollar-sign"></i>
						</section>
						<h2 :class="{'highlight':strengths['funding']}">Funding</h2>
						<p>
							Learn how people are getting investments for their ideas and start-ups.
						</p>
					</section>
				</section>

				<br />
				<button :disabled="Object.keys(goals).length === 0" @click="state = STATES.ACCOUNT">Finish <b>registration</b></button>
			</section>

			<!-- STRENGTHS -->
			<section class="limiter" key="STATES.STRENGTHS" v-if="state === STATES.STRENGTHS">
				<h4>Oooh, a fancy pants.</h4>
				<h1>Select your strengths</h1>
				<p>
					This helps us pair you up with people who want to hear what you've got to say, as well as
					your peers who will.
				</p>

				<section class="select-options">
					<!-- Personal Finance -->
					<section class="option clickable" @click="toggleStrength('personal')">
						<section class="graphic" :class="{'opaque':!strengths['personal']}">
							<i class="fas fa-wallet"></i>
						</section>
						<h2 :class="{'highlight':strengths['personal']}">Personal Finance</h2>
						<p>
							Are you a whiz at making money look easy? Spread that love.
						</p>
					</section>

					<!-- Stocks -->
					<section class="option clickable" @click="toggleStrength('stocks')">
						<section class="graphic" :class="{'opaque':!strengths['stocks']}">
							<i class="fas fa-chart-line"></i>
						</section>
						<h2 :class="{'highlight':strengths['stocks']}">Wall Street</h2>
						<p>
							Stocks and all things banking. If you know it, you better show it.
						</p>
					</section>

					<!-- Cryptocurrency -->
					<section class="option clickable" @click="toggleStrength('crypto')">
						<section class="graphic" :class="{'opaque':!strengths['crypto']}">
							<i class="fas fa-chart-line"></i>
						</section>
						<h2 :class="{'highlight':strengths['crypto']}">Cryptocurrency</h2>
						<p>
							Got blockchain fever? Shill your bags, but make sure you're right.
						</p>
					</section>

					<!-- Funding -->
					<section class="option clickable" @click="toggleStrength('funding')">
						<section class="graphic" :class="{'opaque':!strengths['funding']}">
							<i class="fas fa-dollar-sign"></i>
						</section>
						<h2 :class="{'highlight':strengths['funding']}">Startups & Funding</h2>
						<p>
							Learn how people are getting investments for their ideas.
						</p>
					</section>
				</section>

				<br />
				<button :disabled="Object.keys(strengths).length === 0" @click="state = STATES.ACCOUNT">Finish <b>registration</b></button>
			</section>

			<!-- ACCOUNT -->
			<section class="limiter" key="STATES.ACCOUNT" v-if="state === STATES.ACCOUNT">
				<h4>Almost there, let's just</h4>
				<h1>save our progress</h1>
				<p>
					Fill out a name you'd like to be known by, your email, and a password.
					Remember that everything on finfluencers is public, so you might want to use an alias for privacy.
				</p>

				<section class="account-details">
					<input v-model="name" class="big" autocomplete="off" placeholder="Choose a username" />
					<input v-model="email" autocomplete="off" placeholder="Your email" />
					<section class="password">
						<input v-model="password" autocomplete="new-password" type="password" placeholder="Password" />
						<input v-model="passwordConfirm" autocomplete="new-password" type="password" placeholder="Password Confirmation" />
					</section>
				</section>

				<button :disabled="loading" @click="register">I am <b>ready</b></button>
			</section>
		</transition>
	</section>
</template>

<script>
	import ColorBlast from './svgs/ColorBlast'
	import {mapActions, mapState} from "vuex";
	import {Snackbar} from '../models/Snackbar'
	import * as ApiService from "../services/ApiService";

	const ACCOUNT_TYPE = {
		STUDENT:0,
		INFLUENCER:1,
	}

	const STATES = {
		CODE:1,
		THEME:2,
		TYPE:3,
		FINANCIAL_INFO:4,
		GOALS:5,
		STRENGTHS:6,
		ACCOUNT:7,
	};

	export default {
		name: "Onboarding",
		components:{
			ColorBlast,
		},
		data(){return {
			STATES,
			state:STATES.CODE,

			code:'',
			defaultAccountType:0,
			monthlyIncome:0,
			monthlyExpenses:0,
			goals:{},
			strengths:{},
			name:'',
			email:'',
			password:'',
			passwordConfirm:'',

			loading:false,

		}},
		mounted(){
			document.documentElement.className = 'light';
		},
		computed:{
			...mapState([
				'theme',
			]),
			canGoBack(){
				return this.state > STATES.THEME;
			},
		},
		methods:{
			goBack(){
				if(this.state === STATES.ACCOUNT){
					if(this.defaultAccountType === ACCOUNT_TYPE.STUDENT) return this.state = STATES.GOALS;
					if(this.defaultAccountType === ACCOUNT_TYPE.INFLUENCER) return this.state = STATES.STRENGTHS;
				}
				if(this.state === STATES.STRENGTHS) return this.state = STATES.TYPE;
				this.state -= 1;
			},
			async validateAccessCode(){
				if(!this.code || !this.code.length){
					return Snackbar.error("Invalid activation code");
				}

				this.loading = true;
				await new Promise(r => setTimeout(r, 500));
				const found = await ApiService.checkActivationCode(this.code);
				if(found){
					this.state = STATES.THEME;
				} else {
					Snackbar.error("The activation code you entered is either invalid, or already consumed.")
					this.error = "The activation code you entered is either invalid, or already consumed.";
				}
				this.loading = false;
			},
			setNewTheme(theme){
				document.documentElement.className = theme;
				this.setTheme(theme);
			},
			selectTheme(theme){
				this.setTheme(theme);
				localStorage.setItem('theme', theme);
				document.documentElement.className = theme;
				this.state = STATES.TYPE;
			},
			toggleGoal(goal){
				if(this.goals[goal]) delete this.goals[goal];
				else this.goals[goal] = true;
				this.$forceUpdate();
			},
			toggleStrength(strength){
				if(this.strengths[strength]) delete this.strengths[strength];
				else this.strengths[strength] = true;
				this.$forceUpdate();
			},
			async register(){
				if(this.password !== this.passwordConfirm)
					return Snackbar.error("Password confirmation does not match password");

				const data = {
					defaultType:this.defaultAccountType,
					monthlyIncome:this.monthlyIncome,
					monthlyExpenses:this.monthlyExpenses,
					goals:Object.keys(this.goals),
					strengths:Object.keys(this.strengths),
				}

				const result = await ApiService.register(this.name, this.email, this.password, this.code, data);
				if(result) this.$router.push('/explore');
			},
			...mapActions([
				'setTheme'
			])
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.onboarding {
		z-index:var(--top-most-index);
		padding:150px 0;
		position: relative;


		@media only screen and (max-width:$breakpoint) {
			padding:50px 0;
		}

		.back-button {
			position: fixed;
			top:10px;
			left:10px;
			font-size: 36px;
			color:var(--text-secondary);
			cursor: pointer;
			padding:20px;
		}

		.onboarding-enter-active, .onboarding-leave-active {
			transition: all 0.2s ease;
			transition-property: transform, opacity;
		}
		.onboarding-enter, .onboarding-leave-to /* .onboarding-leave-active below version 2.1.8 */ {
			opacity:0;
			//transform:translateX(-200px);
		}

		$side-padding:20px;
		.limiter {
			max-width:960px;
			margin:0 auto;
			padding:0 $side-padding;
		}

		h4 {
			color:var(--text-secondary);
			font-size: 16px;
			font-weight: bold;
			margin:0;
		}

		h1 {
			color:var(--text-primary);
			font-size: 32px;
			font-weight: bold;
			margin:0 0 30px;
		}

		h2 {
			margin:0 0 10px 0;
			font-size: 22px;
			color:var(--text-primary);
			font-family: var(--secondary-font);

			&.highlight {
				color:var(--highlight);
			}
		}

		p {
			font-size: 20px;
			line-height: 32px;
			color:var(--text-secondary);
			max-width:600px;
			margin:0 auto;
		}

		button {
			background:var(--landing-button);
			border:0;
			outline:0;
			cursor: pointer;
			color:var(--background-color);
			border-radius:100px;
			padding:0 50px;
			height:44px;
			font-weight: 300;
			font-family: var(--secondary-font);
			margin:30px auto 0;
			font-size: 16px;
			transition: backround 0.2s ease, color 0.2s ease, opacity 0.15s ease;

			b {
				font-weight: 800;
			}

			&:disabled {
				opacity:0.1;
				cursor: not-allowed;
			}
		}

		input {
			border:2px solid var(--light-line);
			border-radius:var(--radius);
			height:44px;
			padding:0 20px;
			margin-bottom:10px;
			color:var(--text-primary);
			width:100%;
			outline:0;
			background:transparent;

			transition:border 0.2s ease;

			&:focus {
				border:2px solid var(--text-primary);
			}

			&.big {
				height:80px;
				text-align:center;
				font-size: 20px;
				font-weight: 300;
			}
		}

		.vip-access {
			box-shadow:0 0 0 1px var(--highlight);
			background: var(--highlight-opaque);
			padding:10px;
			border-radius:var(--radius);
			color:var(--text-primary);

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

		.select-options {
			display:flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: flex-start;
			margin-top:40px;

			.option {
				flex: 0 0 calc(25% - 20px);

				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				&.clickable {
					cursor: pointer;
				}

				.graphic {
					width:100%;
					padding-top:15%;
					padding-bottom:15%;
					text-align:center;
					border-radius:8px;
					margin-bottom:20px;
					color:#fff;
					transition: color 0.2s ease;
					font-size: 80px;
					background: linear-gradient(0deg, var(--highlight-opaque) 40%, transparent 150%);

					&.opaque {
						opacity:0.2;
						transition: opacity 0.2s ease;
					}
				}

				&:hover {
					.graphic {
						&.opaque {
							opacity:1;
						}
					}
				}

				p {
					color:var(--text-secondary);
					font-size: 13px;
					line-height: 20px;
					transition: color 0.2s ease;
					max-width:300px;
					text-align: center;
				}
			}

			&.two {
				.option {
					flex: 0 0 calc(50% - 20px);
				}
			}

			&.three {
				.option {
					flex: 0 0 calc(33.3% - 20px);
				}
			}


			@media only screen and (max-width:$breakpoint) {
				.option {
					flex:0 0 100% !important;
					margin-bottom:40px;
				}
			}

		}

		.financial-details {
			margin-top:60px;
			text-align: center;

			label {
				font-size: 13px;
				color:var(--text-primary);
				font-weight: 800;
				font-family: var(--secondary-font);

			}

			.income-expense {
				display:flex;
				max-width:600px;
				margin:0 auto;
			}

			.range {
				flex: 0 0 50%;

				.title {
					font-size: 11px;
					color:var(--text-secondary);
				}
				.slider {
					flex:1;
				}

				&:nth-child(1){
					.title {
						text-align:left;
					}
				}

				&:nth-child(2){
					.title {
						text-align:right;
					}
				}
			}

			.checklist {
				max-width:600px;
				margin:80px auto 0;
				text-align:left;
				display:flex;
				flex-wrap: wrap;
				justify-content: space-between;

				label {
					font-size: 14px;
				}

				> .field {
					border:1px solid var(--light-line);
					padding:10px 10px 5px 10px;
					width:calc(50% - 20px);
					margin:0 auto;
					margin-bottom:20px;
					border-radius:var(--radius);
				}

				.highlight {
					padding:3px 8px;
					background:var(--highlight);
					color:#fff;
					border-radius:4px;
					margin:0 4px;
				}
			}
		}

		.account-details {
			display:flex;
			flex-direction: column;
			max-width:600px;
			margin:80px auto 20px;

			.password {
				display:flex;
				justify-content: space-between;

				input {
					width:calc(50% - 5px);
				}
			}
		}
	}
</style>
