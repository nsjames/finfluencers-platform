<template>
	<section class="feed-select">
		<section class="options">
			<figure class="option" :class="{'active':feedType === 0}" @click="setFeedType(0)">
				<i class="fas fa-graduation-cap"></i>
				<span class="desktop-only">Learn</span>
				<p class="desktop-only">Develop your financial knowledge</p>
			</figure>
			<figure class="option" :class="{'active':feedType === 1}" @click="setFeedType(1)">
				<i class="fas fa-bullhorn" style="transform:rotateZ(-30deg);"></i>
				<span class="desktop-only">Influence</span>
				<p class="desktop-only">Share your financial knowledge</p>
			</figure>
		</section>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";

	export default {
		name: "FeedSelect",
		computed:{
			...mapState([
				'feedType'
			])
		},
		methods:{
			...mapActions([
				'setFeedType'
			])
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	$feedbackground:var(--feed-select-bg);
	$feedshadow:inset 0 -60px 60px -50px rgba(0,0,0,.02);
	.feed-select {
		background:$feedbackground;
		margin-top:-50px;
		position: relative;
		margin-bottom:20px;
		box-shadow:$feedshadow;
		border-bottom:1px solid var(--feed-select-bg-line);

		&:after, &:before {
			content:'';
			position: absolute;
			width:100%;
			top:0;
			bottom:-1px;
			background:$feedbackground;
			z-index:-1;
			box-shadow:$feedshadow;
			border-bottom:1px solid var(--feed-select-bg-line);
		}

		&:after {
			left:-100%;
		}

		&:before {
			right:-100%;
		}

		.options {
			display:flex;

			.option {
				flex:1;
				font-size: 13px;
				display:flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				padding:50px 0;
				border-bottom:1px solid transparent;
				margin-bottom:-1px;
				flex-direction: column;

				transition:all 0.2s ease;
				transition-property: color, background, border-bottom;

				color:var(--highlight-opaque);

				&.active {
					border-bottom:1px solid var(--highlight);
					color:var(--highlight);
				}

				i {
					font-size: 36px;
				}

				span {
					font-size: 18px;
					font-weight: bold;
				}

				p {
					font-size: 11px;
					font-family: var(--secondary-font);
					margin-top:4px;
				}

				@media only screen and (max-width:$breakpoint) {
					padding:30px 0;
					i {
						font-size: 24px;
					}
				}
			}
		}
	}
</style>
