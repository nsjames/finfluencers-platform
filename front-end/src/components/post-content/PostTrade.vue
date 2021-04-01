<template>
	<section class="post-trade">
		<section>
			<label>From</label>
			<TokenInput :allow-dollar="true" :valuea="content.data.from.amount" v-on:asset="selectedFrom" v-on:valuea="x => content.data.from.amount = x" />
		</section>
		<section>
			<label>To</label>
			<TokenInput :allow-dollar="true" :valuea="content.data.to.amount" v-on:asset="selectedTo" v-on:valuea="x => content.data.to.amount = x" />
		</section>

	</section>
</template>

<script>
	export default {
		props:['content'],
		data(){return {

		}},
		methods:{
			selectedFrom(asset){
				this.content.data.from.id = asset.id;
				this.content.data.from.symbol = asset.symbol;
			},
			selectedTo(asset){
				this.content.data.to.id = asset.id;
				this.content.data.to.symbol = asset.symbol;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../styles/variables";

	.post-trade {
		display:flex;
		justify-content: space-between;
		height:90px;

		@media only screen and (max-width:$breakpoint) {
			flex-direction: column;
		}

		> section {
			flex:1;
			text-align:left;

			label {
				font-size: 14px;
				font-weight: bold;
				color:var(--text-primary);
				margin-bottom:10px;
				display: block;
				line-height:14px;
			}

			$margin:5px;
			&:first-child {
				margin-right:$margin;
			}

			&:last-child {
				margin-left:$margin;
			}

			@media only screen and (max-width:$breakpoint) {
				margin-right:0 !important;
				margin-left:0 !important;

				&:not(:last-child){
					margin-bottom:20px;
				}
			}

		}
	}
</style>
