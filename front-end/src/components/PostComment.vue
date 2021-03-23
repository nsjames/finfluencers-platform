<template>
	<section class="post-comment">
		<section v-if="comment">
			<textarea v-model="comment.text" :disabled="posting" :placeholder="placeholder"></textarea>
			<i v-if="reply" class="cancel fas fa-times" @click="$emit('posted', null)"></i>
			<button @click="post" v-if="!posting">Post</button>
			<button v-if="posting">
				<i class="fas fa-spin fa-spinner"></i>
			</button>
		</section>
	</section>
</template>

<script>
	import CommentModel from '@finfluencers/shared/models/Comment.model';
	import * as ApiService from "../services/ApiService";

	export default {
		props:['parent', 'reply'],
		name: "PostComment",
		data(){return {
			comment:null,
			posting:false,
		}},
		mounted(){
			this.comment = new CommentModel();
			this.comment.parent_index = this.parent;
			this.comment.text = '';
			console.log('comment', this.comment);
		},
		computed:{
			placeholder(){
				return this.reply ? `Reply to the comment above` : 'What are you thinking?'
			}
		},
		methods:{
			async post(){
				if(!this.comment.text.length) return;
				this.posting = true;
				const posted = await ApiService.postComment(this.comment);
				if(posted) this.$emit('posted', posted);
				this.posting = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.post-comment {
		width:100%;
		text-align: right;

		textarea {
			background:transparent;
			padding:20px;
			width:100%;
			resize: vertical;
			outline:0;
			min-height:150px;
			font-size: 16px;
			color:var(--text-primary);
			border-radius:var(--radius);
			position: relative;
			border:1px solid var(--highlight-opaque);
		}

		button {
			cursor: pointer;
			outline:0;
			border:0;
			padding:10px 40px;
			font-size: 14px;
			font-weight: bold;
			color:#101010;
			background:var(--colorful-button);
			border-radius: var(--radius);
			min-width:120px;
			margin-top:5px;
		}

		.cancel {
			padding:10px;
			margin:0 10px;
			color:var(--text-secondary);
			opacity:0.4;
			cursor: pointer;

			&:hover {
				opacity:1;
				color:var(--text-primary);
			}
		}
	}
</style>
