<template>
	<section class="explore">
		<FeedSelect />

		<PostContent />

		<!--<SpreadBar />-->
		<!--<figure style="margin:80px 0;"></figure>-->
		<section class="breaker" v-if="feedType === 0">
			<span>Gather information</span>
			<p>
				Influential people post about their decisions every day
			</p>
		</section>
		<section class="breaker" v-if="feedType === 1">
			<span>Lend a helping hand</span>
			<p>
				Posts below are from users who need assistance.
			</p>
		</section>


		<Content :key="content.id" :content="content" v-for="content in contents" />
	</section>

</template>

<script>
	import ColorBlast from '../components/svgs/ColorBlast';
	import FeedSelect from '../components/FeedSelect';
	import PostContent from '../components/PostContent';
	import Content from '../components/Content';
	import {mapState} from "vuex";
	import * as ApiService from "../services/ApiService";
	import {EventBus} from "../services/EventBus";

	export default {
		components:{
			FeedSelect,
			ColorBlast,
			PostContent,
			Content,
		},
		computed:{
			...mapState([
				'contents',
				'feedType'
			])
		},
		beforeMount(){
			EventBus.$emit('loading', true);
		},
		async mounted(){
			EventBus.$on('refresh-explore', this.loadFeed);
			await this.loadFeed();
			EventBus.$emit('loading', false);
		},
		destroyed(){
			EventBus.$off('refresh-explore', this.loadFeed)
		},
		methods:{
			loadFeed(){
				return ApiService.setFeedContents();
			}
		},
		watch:{
			'feedType'(){
				this.loadFeed();
			}
		}
	}
</script>

<style lang="scss" scoped>

	.explore {
		padding-bottom:150px;

		.breaker {
			text-align: left;
			margin:60px 0 40px;

			span {
				font-size: 18px;
				font-weight: bold;
				color:var(--text-primary);
			}

			p {
				color:var(--text-secondary);
				font-size: 14px;
			}
		}

		.content-enter-active, .content-leave-active {
			transition: all 0.2s ease;
			transition-property: transform, opacity;
		}
		.content-enter, .content-leave-to /* .content-leave-active below version 2.1.8 */ {
			transform:translateY(50px);
			opacity:0;
		}
	}
</style>
