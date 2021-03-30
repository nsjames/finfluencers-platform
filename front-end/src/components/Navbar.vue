<template>
	<section>
		<nav>
			<transition mode="out-in" name="slide-left">
				<section key="nav-logo" v-if="!searching" class="logo" @click="goToExplore">
					<Logo />
				</section>
				<section key="nav-searchbar" v-if="searching" class="search-bar">
					<i class="fas fa-search"></i>
					<input placeholder="What are you looking for?" />
				</section>
			</transition>
			<transition mode="out-in" name="slide-right">
				<section key="nav-actions" v-if="!searching" class="actions">
					<i class="fa-lightbulb desktop-only" :class="theme === 'dark' ? 'fas' : 'far'" @click="toggleTheme"></i>
					<section class="alerts" @click="$router.push('/')">
						<i class="fas fa-bell"></i>
						<span class="desktop-only">10</span>
					</section>
					<i class="fas fa-search" @click="searching = !searching"></i>
					<Profile :navbar="true" v-if="user" :user="user" :size="36" />
				</section>
				<section key="nav-closesearch" v-if="searching" class="close-search" @click="searching = false">
					<i class="fas fa-times"></i>
				</section>
			</transition>
		</nav>
		<figure class="nav-placeholder"></figure>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import {EventBus} from "../services/EventBus";

	export default {
		data(){return {
			searching:false,
		}},
		mounted(){
			this.setSpecificTheme(localStorage.getItem('theme') || 'light');
		},
		computed:{
			...mapState([
				'theme',
				'user',
			]),
		},
		methods:{
			toggleTheme(){
				const theme = this.theme === 'light' ? 'dark' : 'light';
				this.setSpecificTheme(theme);
			},
			setSpecificTheme(theme){
				this.setTheme(theme);
				localStorage.setItem('theme', theme);
				document.documentElement.className = theme;
			},
			goToExplore(){
				if(this.$route.name === 'Explore') EventBus.$emit('refresh-explore');
				else this.$router.push('/explore');
			},
			...mapActions([
				'setTheme'
			])
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.nav-placeholder {
		height:48px;
		margin:20px 0 50px;
	}

	nav {
		position:fixed;
		top:0;
		left:0;
		right:0;
		margin:0 auto;
		background:var(--nav-background);
		box-shadow:var(--nav-shadow);
		padding:0 20px 0 40px;
		height:68px;
		z-index:var(--nav-index);

		display:flex;
		justify-content: space-between;
		align-items: center;

		color:var(--text-primary);

		.slide-right-enter-active, .slide-right-leave-active,
		.slide-left-enter-active, .slide-left-leave-active{
			transition: all 0.1s ease;
			transition-property: transform, opacity;
		}
		.slide-right-enter, .slide-right-leave-to /* .slide-right-leave-active below version 2.1.8 */ {
			transform:translateX(-20px);
			opacity:0;
		}

		.slide-left-enter, .slide-left-leave-to /* .slide-left-leave-active below version 2.1.8 */ {
			transform:translateX(20px);
			opacity:0;
		}

		.logo {
			font-weight: bold;
			font-size: 18px;
			cursor: pointer;
			margin-left:-23px;
			margin-top:0px;
			display:flex;
			align-items: center;


			transition:all 0.1s ease;
			transition-property: transform, opacity;

			$logo:40px;
			svg {
				width:auto;
				height:$logo;
				fill:var(--shark-fin);
				transition: all 0.5s ease;
			}
		}

		.actions {
			display:flex;
			align-items: center;

			i, .alerts {
				cursor: pointer;
				padding:5px 10px;
				margin-right:10px;


				@media only screen and (max-width:$breakpoint) {
					margin-right:0;
				}

				&:hover {
					color:var(--highlight);
				}
			}

			.alerts {
				span {
					margin-left:-5px;
					font-weight: bold;
					font-size: 14px;
				}
			}

			.profile {
				margin-left:20px;

			}
		}

		.search-bar {
			display:flex;
			align-items: center;

			i {
				color:var(--text-secondary);
			}

			input {
				background: transparent;
				margin-left:20px;
				border:0;
				outline:0;
				color:var(--text-primary);
				font-weight: bold;
				width:100%;
				height:30px;
			}
			flex:1;
		}

		.close-search {
			padding:15px;
			cursor: pointer;
			font-size: 18px;

			&:hover {
				color:var(--highlight);
			}
		}



	}
</style>
