<template>
	<section>
		<nav>
			<transition mode="out-in" name="slide-left">
				<section key="nav-logo" v-if="!searchMode" class="logo" @click="goToExplore">
					<Logo />
				</section>
				<section key="nav-searchbar" v-if="searchMode" class="search-bar">
					<i class="fas fa-search" v-if="!searching"></i>
					<i class="fas fa-spin fa-spinner" v-if="searching"></i>
					<input v-model="searchTerms" placeholder="What are you looking for?" />
				</section>
			</transition>
			<transition mode="out-in" name="slide-right">
				<section key="nav-actions" v-if="!searchMode" class="actions">
					<i class="fa-lightbulb desktop-only" :class="theme === 'dark' ? 'fas' : 'far'" @click="toggleTheme"></i>
					<!--<section class="alerts" @click="$router.push('/')">-->
						<!--<i class="fas fa-bell"></i>-->
						<!--<span class="desktop-only">10</span>-->
					<!--</section>-->
					<i v-tooltip="'Search'" class="fas fa-search" @click="searchMode = !searchMode"></i>
					<i v-tooltip="'Bookmarks'" class="fas fa-bookmark" @click="$router.push('/bookmarks')"></i>
					<Profile :navbar="true" v-if="user" :user="user" :size="36" />
				</section>
				<section key="nav-closesearch" v-if="searchMode" class="close-search" @click="searchMode = false">
					<i class="fas fa-times"></i>
				</section>
			</transition>

			<section class="search-results" v-if="searchResults.length">
				<figure class="header">Found {{searchResults.length}} results</figure>
				<section class="items">
					<section class="item" v-for="result in searchResults" @click="clickedSearchResult(result)">
						<figure class="type">{{result.type}}</figure>
						<figure class="text">{{result.text}}</figure>
					</section>
				</section>
			</section>
		</nav>
		<figure class="nav-placeholder"></figure>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import {EventBus} from "../services/EventBus";
	import * as ApiService from "../services/ApiService";
	import {CONTENT_TYPE} from '@finfluencers/shared/models/ContentType';

	let searchTimeout;
	export default {
		data(){return {
			searchMode:false,
			searching:false,
			searchTerms:'',
			searchResults:[],
		}},
		mounted(){
			this.setSpecificTheme(localStorage.getItem('theme') || 'light');
			EventBus.$on('toggle-theme', this.toggleTheme);
		},
		destroyed(){
			EventBus.$off('toggle-theme', this.toggleTheme);
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
			contentTypeLabel(content){
				switch(content.type){
					case CONTENT_TYPE.GET_HELP: return 'Help!';
					case CONTENT_TYPE.SET_GOAL: return 'Goal';
					case CONTENT_TYPE.TRADE: return 'Investment';
					case CONTENT_TYPE.KNOWLEDGE: return 'Advice';
					case CONTENT_TYPE.PREDICTION: return 'Prediction';
					case CONTENT_TYPE.PORTFOLIO: return null;
				}
			},
			async search(){
				const results = await ApiService.search(this.searchTerms.trim());
				if(!results) return;

				console.log(results);

				this.searchResults = results.users.map(x => {
					return {
						type:'Profile',
						text:x.name,
						url:`/profile/${encodeURIComponent(x.name)}`,
					}
				}).concat(results.content.map(x => {
					return {
						type:this.contentTypeLabel(x),
						text:x.text.data.substr(0,40),
						url:`/content/${x.id}`,
					}
				}));

				this.searching = false;
			},
			clickedSearchResult(result){
				this.$router.push(result.url);
				this.searchResults = [];
				this.searchMode = false;
				this.searchTerms = '';
			},
			...mapActions([
				'setTheme'
			])
		},
		watch:{
			searchTerms(){
				this.searchResults = [];
				if(!this.searchTerms || !this.searchTerms.trim().length) return;
				this.searching = true;
				clearTimeout(searchTimeout);
				searchTimeout = setTimeout(() => this.search(), 600);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	.nav-placeholder {
		height:68px;
		margin:20px 0 50px;
	}

	nav {
		position:fixed;
		top:20px;
		left:20px;
		right:20px;
		margin:0 auto;
		background:var(--nav-background);
		box-shadow:var(--nav-shadow);
		padding:0 20px 0 40px;
		height:68px;
		z-index:var(--nav-index);
		border-radius: 10px;

		display:flex;
		justify-content: space-between;
		align-items: center;

		color:var(--text-primary);

		.search-results {
			position:absolute;
			top:73px;
			left:0;
			right:0;
			border-radius: 10px;
			background:var(--content-bg);
			box-shadow:var(--nav-shadow);
			overflow: hidden;
			max-width:var(--max-width);
			margin:0 auto;

			> .header {
				font-size: 11px;
				background:var(--highlight);
				color:#fff;
				padding:4px 8px;
			}

			.items {
				max-height:300px;
				overflow-y: auto;

				> .item {
					padding:10px 10px;
					display:flex;
					font-size: 14px;
					cursor: pointer;

					.type {
						padding:5px 10px;
						background:var(--highlight);
						color:#fff;
						font-size: 11px;
						font-weight: bold;
						line-height: 11px;
						border-radius: 50px;
						margin-right:10px;
					}

					.text {

					}

					&:hover {
						background:var(--highlight-opaque);
					}
				}
			}
		}

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
				color:var(--text-primary);


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
