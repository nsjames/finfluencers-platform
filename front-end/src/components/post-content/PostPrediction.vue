<template>
	<section class="post-prediction">
		<label>Price and asset</label>
		<section class="holder">
			<section class="asset-input">
				<TokenInput :valuea="content.data.price" v-on:asset="selectedAsset" v-on:valuea="x => $emit('price', x)" />
			</section>
			<section class="target-date">
				<VueDatePicker v-model="content.data.date" attach=".target-date .picker-attach" :min-date="new Date(+new Date() + 86400000)" />
				<div class="picker-attach"></div>
			</section>

		</section>
	</section>
</template>

<script>

	import * as ApiService from "../../services/ApiService";

	export default {
		props:['content'],
		methods:{
			selectedAsset(asset){
				this.content.data.asset.id = asset.id;
				this.content.data.asset.symbol = asset.symbol;
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import "../../styles/variables";

	.post-prediction {
		text-align:left;
		height:90px;


		.holder {
			display:flex;
			@media only screen and (max-width:$breakpoint) {
				display:block;
			}
		}


		label {
			font-size: 14px;
			font-weight: bold;
			color:var(--text-primary);
			margin-bottom:10px;
			display: block;
			line-height:14px;
		}

		.asset-input {
			flex:1;
			position: relative;
		}

		.target-date {
			flex:0 0 auto;
			margin-left:10px;
			height:60px;
			background:var(--background-color);

			border:1px solid var(--light-line);
			padding:0 20px;
			display:flex;
			align-items: center;
			border-radius:var(--radius);
			font-size: 20px;
			cursor: pointer;
			position: relative;
			color:var(--text-primary);

			@media only screen and (max-width:$breakpoint) {
				margin:0;
				margin-top:10px;
			}

			.picker-attach {
				position: absolute;
				left:0;
				top:35px;
			}
		}
	}
</style>
