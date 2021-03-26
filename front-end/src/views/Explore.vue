<template>
	<section class="explore">

		<PostContent />

		<SpreadBar />

		<Content :key="content.id" :content="content" v-for="content in contents" />
	</section>

</template>

<script>
	import ColorBlast from '../components/svgs/ColorBlast';
	import PostContent from '../components/PostContent';
	import Content from '../components/Content';
	import {mapState} from "vuex";
	import * as ApiService from "../services/ApiService";
	import {EventBus} from "../services/EventBus";

	export default {
		components:{
			ColorBlast,
			PostContent,
			Content,
		},
		computed:{
			...mapState([
				'contents',
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
		}
	}
</script>

<style lang="scss" scoped>

	.explore {
		padding-bottom:150px;

	}
</style>
