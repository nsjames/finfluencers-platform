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
		}
	}
</script>

<style lang="scss" scoped>

	.home {

	}
</style>
