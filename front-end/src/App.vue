<template>
	<section id="app" :class="{'limited':notLandingPage, 'no-scroll':loading}">
		<section class="loader" :class="{'show':loading}">
			<section class="graphic">
				<section>
					<svg class="fin" viewBox="0 0 55 38" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.228 1.28403C5.27702 5.26138 22.3052 35.7882 3 43.0314C8.39618 47.3052 13.5824 61.5 21 61.5C34.4682 61.5 74 64 52.1756 29.585C36.1686 16.1312 18.6971 -1.45071 13.228 1.28403Z" stroke-width="2"/>
					</svg>

					<svg class="wave" viewBox="0 0 122 17" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M106.234 8.5C98.6172 8.5 98.6172 1 91 1C83.6172 1 83.6172 8.5 76.2344 8.5C68.6172 8.5 68.6172 1 61 1C53.6172 1 53.6172 8.5 46.2344 8.5C38.6172 8.5 38.6172 1 31 1C23.6172 1 23.6172 8.5 16.2344 8.5C8.61719 8.5 8.61719 1 1 1V15.0227H121V1C113.617 1 113.617 8.5 106.234 8.5Z" stroke-width="2"/>
					</svg>
				</section>
			</section>
		</section>
		<Popups />
		<figure class="global-background"></figure>
		<section class="router">
			<Navbar v-if="notLandingPage" />
			<ColorBlast v-if="notLandingPage" />
			<transition :name="routeTransition" mode="out-in">
				<router-view />
			</transition>
		</section>

	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import Navbar from './components/Navbar';
	import ColorBlast from './components/svgs/ColorBlast';
	import Popups from './components/Popups';
	import {EventBus} from "./services/EventBus";

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
			document.documentElement.className = localStorage.getItem('theme') || 'light';
			document.documentElement.className = 'dark';
			document.addEventListener('click', this.clickAnywhere);
			EventBus.$on('opened-dropdown', this.openedDropdown);
		},
		destroyed(){
			document.removeEventListener('click', this.clickAnywhere);
			EventBus.$off('opened-dropdown', this.openedDropdown);
		},
		computed:{
			notLandingPage(){
				return !['/', '/register'].includes(this.$route.fullPath);
				// return true;
			},
			routeName(){
				return this.$route.name;
			}
		},
		methods:{
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
					}, 1500);
				}
			}
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
		transition-delay: 1.5s;

		&.no-scroll {
			overflow:hidden;
			height:100vh;
		}

		&.limited {
			max-width:var(--max-width);
			transition-delay:1.5s;
			padding:0 30px;
		}

		.loader {
			position: fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			z-index:999999999999;
			background:var(--background-color);
			color:var(--text-primary);
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 36px;
			font-weight: 300;

			opacity:0;
			visibility: hidden;

			transition: all 0.5s ease;
			transition-property: opacity, visibility;

			&.show {
				transition: all 0s ease;
				opacity:1;
				visibility: visible;
			}

			$loader:200px;
			.graphic {
				display:flex;
				width:$loader;
				height:$loader;
				border-radius: 50%;
				overflow: hidden;
				position: relative;
				box-shadow: var(--soft-shadow);
				padding:8px;

				> section {
					position: relative;
					width:100%;
					height:100%;
					border-radius: 50%;
					overflow: hidden;
				}

				svg.fin {
					animation-name: sharkfin;
					animation-duration: 2s;
					animation-iteration-count: infinite;
					animation-timing-function: linear;
					position: absolute;
					top:30%;
					width:100%;
					//stroke:var(--shark-fin);
					fill:var(--highlight);
					opacity:0.15;
				}

				svg.wave {
					animation-name: wave;
					animation-duration: 1.5s;
					animation-iteration-count: infinite;
					animation-timing-function: linear;
					position: absolute;
					height:50%;
					top:67%;
					width:200%;
					//stroke:var(--text-primary);
					fill:var(--highlight);
					transform:scaleY(0.8);
					margin-top:-1px;
				}


				@keyframes sharkfin {
					0%   {
						left:0%;
					}
					50% {
						left:-5%;
					}
					100% {
						left:0%;
					}
				}

				@keyframes wave {
					0%   {
						left:0;
					}
					100% {
						left:calc(-100% + 2px);
					}
				}
			}
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
			transition-delay: 1s;
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
