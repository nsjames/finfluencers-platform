<template>
	<section class="feed-select">
		<figure class="option" :class="{'active':feedType === 0}" @click="setFeedType(0)">Learn</figure>
		<figure class="option" :class="{'active':feedType === 1}" @click="setFeedType(1)">Influence</figure>
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
	.feed-select {
		width:100%;
		background:var(--content-bg);
		max-width:var(--content-width);
		margin:-30px auto 40px;
		border-radius:20px;
		display:flex;
		overflow:hidden;

		.option {
			flex:1;
			font-size: 13px;
			height:44px;
			display:flex;
			align-items: center;
			justify-content: center;
			color:var(--text-primary);
			cursor: pointer;

			transition:all 0.2s ease;
			transition-property: color, background;

			&.active {
				background:var(--highlight);
				color:#fff;
			}

			&:not(.active){
				&:hover {
					background:var(--highlight-opaque);
					color:#fff;
				}
			}
		}
	}

	.light {
		.feed-select {
			.option {
				background:rgba(0,0,0,0.02);

				&.active {
					background:var(--highlight);
					color:#fff;
				}

				&:not(.active){
					&:hover {
						background:var(--highlight-opaque);
						color:#101010;
					}
				}
			}
		}
	}
</style>
