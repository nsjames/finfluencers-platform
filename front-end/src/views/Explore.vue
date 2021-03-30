<template>
	<section class="explore">

		<PostContent />

		<SpreadBar />
		<!--<figure style="margin:80px 0;"></figure>-->

		<FeedSelect />

		<transition-group name="content" mode="out-in">
			<Content :key="content.id" :content="content" v-for="content in contents" />
		</transition-group>
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


		.content-enter-active, .content-leave-active {
			transition: all 0.2s ease;
			transition-property: transform, opacity;
		}
		.content-enter, .content-leave-to /* .content-leave-active below version 2.1.8 */ {
			transform:translateY(-50px);
			opacity:0;
		}
	}
</style>
