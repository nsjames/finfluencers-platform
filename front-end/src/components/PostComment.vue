<template>
	<section class="post-comment">
		<section v-if="comment">
			<textarea v-model="comment.text" :disabled="posting" :placeholder="placeholder"></textarea>
			<section class="actions">
				<section v-if="canApplyResult">
					This {{resultType}} <Dropdown :options="['helped', 'hurt', 'did nothing for']" :selected="comment.resolution" v-on:selected="x => comment.resolution = x" /> me.
				</section>
				<section v-else></section>
				<section>
					<i v-if="reply" class="cancel fas fa-times" @click="$emit('posted', null)"></i>
					<button @click="post" v-if="!posting">Comment</button>
					<button v-if="posting">
						<i class="fas fa-spin fa-spinner"></i>
					</button>
				</section>
			</section>
		</section>
	</section>
</template>

<script>
	import CommentModel from '@finfluencers/shared/models/Comment.model';
	import * as ApiService from "../services/ApiService";
	import {CONTENT_TYPE} from '@finfluencers/shared/models/ContentType';
	import {mapState} from "vuex";

	export default {
		props:['parent', 'topLevelParent', 'reply', 'content'],
		name: "PostComment",
		data(){return {
			comment:null,
			posting:false,
		}},
		mounted(){
			this.setNewComment();
		},
		computed:{
			...mapState([
				'user',
			]),
			placeholder(){
				return this.reply ? `Reply to the comment above` : 'Let it all out.'
			},
			canApplyResult(){
				if(this.content && this.content.user_id === this.user.id) return false;
				if(this.topLevelParent !== this.parent) return false;
				if(this.content){
					switch(this.content.type){
						case CONTENT_TYPE.PREDICTION:
						case CONTENT_TYPE.KNOWLEDGE:
						case CONTENT_TYPE.TRADE:
							return true;
					}
				}
				return false;
			},
			resultType(){
				if(this.content){
					switch(this.content.type){
						case CONTENT_TYPE.PREDICTION: return 'prediction';
						case CONTENT_TYPE.KNOWLEDGE: return 'advice';
						case CONTENT_TYPE.TRADE: return 'trade';
					}
				}

				return '';
			}
		},
		methods:{
			setNewComment(){
				this.comment = new CommentModel();
				this.comment.parent_index = this.parent;
				this.comment.top_level_parent_index = this.topLevelParent;
				this.comment.text = '';
				if(this.canApplyResult) this.comment.resolution = 'did nothing for';
			},
			async post(){
				if(!this.comment.text.length) return;
				this.posting = true;
				const comment = JSON.parse(JSON.stringify(this.comment));
				if(comment.resolution === 'did nothing for') comment.resolution = '';
				const posted = await ApiService.postComment(comment);
				if(posted) {
					this.$emit('posted', posted);
					this.setNewComment();
				}
				this.posting = false;
			}
		}
	}
</script>

<style lang="scss">
	@import "../styles/variables";

	.post-comment {
		width:100%;
		text-align: right;

		button {
			cursor: pointer;
			outline:0;
			border:0;
			height:44px;
			padding:10px 40px;
			font-size: 11px;
			font-weight: bold;
			color:#101010;
			background:var(--colorful-button);
			border-radius: var(--radius);
			min-width:120px;
			margin-top:5px;

		}

		.actions {
			display:flex;
			align-items: center;

			@media only screen and (max-width:$breakpoint) {
				flex-direction: column;
			}

			> section {
				flex:1;
				display:flex;
				align-items: center;
				color:var(--text-primary);

				.dropdown {
					margin:0 10px;


					> .selected {
						height:32px;

						.option {
							color:var(--highlight) !important;
							font-weight: bold;
						}
					}

					> .options {

						top:38px;
					}
				}

				&:nth-child(2){
					justify-content: flex-end;
				}
			}
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
