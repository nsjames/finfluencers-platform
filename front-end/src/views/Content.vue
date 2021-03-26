<template>
	<section>
		<section class="content-page" v-if="content">
			<figure class="back" @click="$router.back()">
				<i class="fas fa-arrow-left"></i>
			</figure>
			<Content :key="content.id" :content="content" :hide-comments-button="true" />

			<SpreadBar />

			<PostComment :parent="`content:${content.id}`" :top-level-parent="`content:${content.id}`" v-on:posted="postedComment" />

			<Comment v-for="comment in comments" :comment="comment" :top-level-poster="content.user_id" :parent="`content:${content.id}`" />

		</section>
	</section>

</template>

<script>
	import ColorBlast from '../components/svgs/ColorBlast';
	import PostContent from '../components/PostContent';
	import Content from '../components/Content';
	import Comment from '../components/Comment';
	import {mapActions, mapState} from "vuex";
	import * as ApiService from "../services/ApiService";
	import CommentModel from '@finfluencers/shared/models/Comment.model';
	import {EventBus} from "../services/EventBus";

	export default {
		components:{
			Content,
			Comment,
		},
		data(){return {
			comment:null,
			comments:[],
		}},
		computed:{
			...mapState([
				'content',
			])
		},
		beforeMount(){
			EventBus.$emit('loading', true);
		},
		async mounted(){
			await this.load();
			EventBus.$emit('loading', false);
		},
		methods:{
			async load(){
				this.comment = new CommentModel();
				this.comment.parent_index = `content:${this.$route.params.id}`;
				await Promise.all([
					this.checkContent(),
					this.getComments()
				]);
			},
			async getComments(){
				const comments = await ApiService.getComments(`content:${this.$route.params.id}`);
				this.comments = comments;
			},
			async checkContent(){
				if(!this.content || !this.content.id !== this.$route.params.id){
					const content = await ApiService.getContent(this.$route.params.id);
					this.setContent(content);
				}

				if(!this.content){
					this.$router.replace('/404');
				}
			},
			async postedComment(comment){
				this.comments.unshift(comment);
			},
			...mapActions([
				'setContent',
			])
		},
		watch:{
			'$route.params.id'(){
				this.load();
			}
		}
	}
</script>

<style lang="scss" scoped>

	.content-page {
		padding-bottom:150px;

		.back {
			text-align: left;
			margin-bottom:10px;

			i {
				font-size: 24px;
				color:var(--text-secondary);
				opacity:0.2;
				padding:20px 20px 20px 0;
				cursor: pointer;
				transition: all 0.2s ease;
				transition-property: color, opacity;

				&:hover {
					color:var(--text-primary);
					opacity:1;
				}
			}
		}
	}
</style>
