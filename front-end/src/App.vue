<template>
	<section id="app" :class="{'limited':notLandingPage, 'no-scroll':loading}">
		<section class="main-loader" :class="{'show':loading}">
			<Loader />
		</section>
		<Popups />
		<figure class="global-background"></figure>
		<section class="router">
			<Navbar v-if="canShowNavbar" />
			<ColorBlast v-if="notLandingPage" />
			<transition :name="routeTransition" mode="out-in">
				<router-view />
			</transition>
		</section>

		<section class="snackbars">
			<section class="floater">
				<transition-group name="snackbar">
					<section :key="snackbar.id" class="snackbar" v-for="snackbar in snackbars" :class="`type-${snackbar.type}`" @click="snackbar.close()">
						{{snackbar.text}}
					</section>
				</transition-group>
			</section>
		</section>

	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import Navbar from './components/Navbar';
	import ColorBlast from './components/svgs/ColorBlast';
	import Popups from './components/Popups';
	import {EventBus} from "./services/EventBus";
	import * as ApiService from "./services/ApiService";

	export default {
		data(){return {
			lastDropdownId:null,
			routeTransition:'route-change',
			loading:false,
		}},
		components:{
			ColorBlast,
			Navbar,
			Popups,
		},
		async mounted(){
			ApiService.checkUser();
			document.documentElement.className = localStorage.getItem('theme') || 'light';
			document.documentElement.className = 'dark';
			document.addEventListener('click', this.clickAnywhere);
			EventBus.$on('opened-dropdown', this.openedDropdown);
			EventBus.$on('loading', this.catchLoading);
		},
		destroyed(){
			document.removeEventListener('click', this.clickAnywhere);
			EventBus.$off('opened-dropdown', this.openedDropdown);
			EventBus.$off('loading', this.catchLoading);
		},
		computed:{
			...mapState([
				'snackbars',
			]),
			notLandingPage(){
				return !['/', '/register'].includes(this.$route.fullPath);
				// return true;
			},
			canShowNavbar(){
				return this.notLandingPage && this.$route.name !== 'Test';
			},
			routeName(){
				return this.$route.name;
			}
		},
		methods:{
			catchLoading(loading){
				this.loading = loading;
			},
			openedDropdown(id){
				this.lastDropdownId = id;
			},
			clickAnywhere(e){
				const isOnDropdown = e.target.closest('.dropdown');
				if(!isOnDropdown || this.lastDropdownId !== isOnDropdown.id) EventBus.$emit('close-dropdowns', isOnDropdown ? this.lastDropdownId : null);
			},
			...mapActions([
				'setTheme'
			])
		},
		watch:{
			$route (to, from){
				const isFromLander = ['/', '/register'].includes(from.path);
				const isToLander = ['/', '/register'].includes(to.path);
				if((isFromLander && isToLander) || !isFromLander && !isToLander){
					this.routeTransition = 'route-change';
				} else {
					this.loading = true;
					this.routeTransition = 'route-change-landing';
					setTimeout(() => {
						this.loading = false;
					}, 500);
				}
			},
		}
	}
</script>

<style lang="scss">

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		min-height:100vh;

		position: relative;
		margin:0 auto;

		transition:all 1s ease;
		transition-property: max-width, padding;
		transition-delay: 0.5s;

		&.no-scroll {
			overflow:hidden;
			height:100vh;
		}

		&.limited {
			max-width:var(--max-width);
			transition-delay:0.5s;
			padding:0 30px;
		}

		.snackbars {
			position: fixed;
			bottom:20px;
			left:0;
			right:0;
			z-index:9999999999999999;
			display:flex;
			align-items: center;
			justify-content: center;

			.floater {


				.snackbar {
					cursor: pointer;
					padding:10px 40px;
					background:var(--highlight);
					color:#fff;
					border-radius:var(--radius);
					font-size: 14px;
					box-shadow:0 2px 10px rgba(0,0,0,0.2);
					margin-top:10px;

					&.type-1 {
						background:var(--error-snackbar);
					}
				}
			}
		}

		.main-loader {
			position: fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:var(--loader-index);
			background:var(--background-color);
			color:var(--text-primary);
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 36px;
			font-weight: 300;

			opacity:0;
			visibility: hidden;

			transition: all 0.8s ease;
			transition-property: opacity, visibility;

			&.show {
				transition: all 0s ease;
				opacity:1;
				visibility: visible;
			}


		}


		.snackbar-enter-active, .snackbar-leave-active {
			transition: all 0.1s ease;
			transition-property: transform, opacity;
		}
		.snackbar-enter, .snackbar-leave-to /* .snackbar-leave-active below version 2.1.8 */ {
			opacity:0;
			transform:translateY(20px);
		}

		.route-change-enter-active, .route-change-leave-active {
			transition: all 0.1s ease;
			transition-property: transform, opacity;
		}
		.route-change-enter, .route-change-leave-to /* .route-change-leave-active below version 2.1.8 */ {
			opacity:0;
		}

		.route-change-landing-enter-active, .route-change-landing-leave-active {
			transition: all 2s ease;
			transition-property: transform, opacity;
		}
		.route-change-landing-enter {
			opacity:0;
			transition-delay: 0.5s;
		}
		.route-change-landing-leave-to {
			transition: opacity 0s ease;
			opacity:0;
		}

		.global-background {
			position:fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;

			background:var(--background-color);
			z-index:-2;
		}

		.color-blast {


		}
	}

	.light {
		#app {
			.loader {
				.graphic {

					$finspace:8px;
					&:after {
						content:'';
						display:block;
						border-radius: 50%;
						overflow: hidden;
						box-shadow:inset 0 -5px 50px var(--background-color);
						z-index:2;
						position: absolute;
						top:$finspace;
						bottom:$finspace;
						left:$finspace;
						right:$finspace;
						opacity:0.8;
					}
				}
			}
		}
	}

	.dark {
		#app {
			.loader {
				.graphic {

					$finspace:8px;
					&:after {
						content:'';
						display:block;
						border-radius: 50%;
						overflow: hidden;
						box-shadow:inset 0 -5px 30px var(--background-color);
						z-index:2;
						position: absolute;
						top:$finspace;
						bottom:$finspace;
						left:$finspace;
						right:$finspace;
						opacity:0.8;
					}
				}

				> section {
					$spacing:8px;
					&:after {
						content:'';
						display:block;
						border-radius: 50%;
						overflow: hidden;
						box-shadow:inset 2px 5px 10px rgba(0,0,20,0.6), inset 30px 40px 40px rgba(155,155,255,0.1), inset 12px 10px 5px 1px rgba(155,155,255,0.08);
						z-index:2;
						position: absolute;
						top:$spacing;
						bottom:$spacing;
						left:$spacing;
						right:$spacing;
						opacity:0.8;
					}
				}
			}
		}
	}

	footer {
		display:flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin:250px;

		figure {
			&:nth-child(1){
				font-size: 28px;
				color:var(--text-primary);
				margin-bottom:20px;
			}
			&:nth-child(2){
				font-size: 12px;
				color:var(--highlight-color);
			}
			&:nth-child(3){
				font-size: 12px;
				color:var(--text-secondary);
				opacity:0.6;
			}
		}
	}
</style>
