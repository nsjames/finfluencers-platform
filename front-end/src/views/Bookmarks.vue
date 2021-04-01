<template>
	<section class="bookmarks">
		<section class="feed-breaker">
			<span>Memory lane</span>
			<p>
				Your bookmarks are a way for you to keep track of financial information
			</p>
		</section>


		<Content :key="content.id" :content="content" v-for="content in contents" />
	</section>

</template>

<script>
	import Content from '../components/Content';
	import {mapState} from "vuex";
	import * as ApiService from "../services/ApiService";
	import {EventBus} from "../services/EventBus";

	export default {
		components:{
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
			await this.loadFeed();
			EventBus.$emit('loading', false);
		},
		methods:{
			loadFeed(){
				return ApiService.setFeedContents({bookmarks:true});
			}
		},
	}
</script>

<style lang="scss" scoped>

	.bookmarks {
		padding-bottom:150px;
	}
</style>
