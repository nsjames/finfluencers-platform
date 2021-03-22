<template>
	<section class="home">

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
		mounted(){
			ApiService.setFeedContents()
		}
	}
</script>

<style lang="scss" scoped>

	.home {

	}
</style>
