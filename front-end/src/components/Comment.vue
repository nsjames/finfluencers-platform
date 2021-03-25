<template>
	<section class="comment" :class="{'child':child}">
		<section class="header">
			<Profile :user="comment.user" />
			<section class="ago">{{timeAgo}} ago</section>
			<section class="op" v-if="topLevelPoster === user.id">OP</section>
		</section>
		<section class="details">
			<figure class="line"><figure></figure></figure>
			<section class="innards">
				<figure class="text">{{comment.text}}</figure>

				<section class="actions">
					<section @click="commenting = !commenting">
						<i class="fas fa-reply"></i>
						<span style="font-weight: 400;">Reply</span>
					</section>
				</section>

				<PostComment class="reply" v-if="commenting" :parent="asParent" :top-level-parent="parent" v-on:posted="postedComment" :reply="true" />

				<Comment v-for="child in comment.comments" :key="child.id" :comment="child" :child="true" :parent="parent" />

			</section>
		</section>
	</section>
</template>

<script>
	import {mapState} from "vuex";
	import ago from '../util/ago'
	import CommentModel from '@finfluencers/shared/models/Comment.model'
	import Comment from './Comment';

	export default {
		props:['comment', 'child', 'topLevelPoster', 'parent'],
		name: "Comment",
		components:{
			Comment
		},
		data(){return {
			commenting:false,
		}},
		computed:{
			...mapState([
				'user'
			]),
			timeAgo(){
				return ago(this.comment.created_at);
			},
			asParent(){
				return `comment:${this.comment.id}`
			}
		},
		methods:{
			postedComment(comment){
				this.commenting = false;
				if(comment) {
					if(!this.comment.comments) this.comment.comments = [];
					this.comment.comments.unshift(comment);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment {

		&.child {
			margin-left:-10px;
			margin-top:30px;
		}

		&:not(.child){
			margin-bottom:50px;
		}

		.header {
			display:flex;
			align-items: center;

			.ago {
				margin-left:20px;
				font-size: 11px;
				color:var(--text-secondary);
			}

			.op {
				border-radius:20px;
				background:var(--highlight);
				padding:2px 8px;
				color:#fff;
				font-size: 11px;
				margin-left:10px;
				box-shadow:inset 4px 5px 5px rgba(255,255,255,0.5);
			}
		}

		.details {
			margin-top:10px;
			display:flex;

			.line {
				width:35px;
				margin-right:15px;
				display:flex;
				align-items: center;
				justify-content: center;

				> figure {
					width:1px;
					height:100%;
					background:linear-gradient(180deg, var(--highlight) 20%, transparent 100%);
					opacity:0.3;
					position: relative;
				}


			}

			> .innards {

				.text {
					text-align:left;
					color:var(--text-primary);
					font-size: 14px;

				}

				.actions {
					margin-top:30px;
					cursor: pointer;
					display:flex;
					align-items: center;

					> section {
						margin-right:40px;
						display:flex;
						align-items: center;
						color:var(--text-secondary);
						opacity:0.2;

						transition: all 0.2s ease;
						transition-property: opacity, color;

						&:hover {
							color:var(--highlight);
							opacity:1;

						}
					}

					i {
						padding:10px;
						margin-bottom:-10px;
						transition: all 0.1s ease;
						transition-property: opacity, color;
						font-size: 16px;

						&:first-child {
							margin-left:-10px;
						}
					}

					span {
						font-size: 11px;
						font-weight: bold !important;
						padding-top:9px;
					}
				}
			}
		}

		.reply {
			margin-left:15px;
			margin-top:20px;

		}
	}
</style>
