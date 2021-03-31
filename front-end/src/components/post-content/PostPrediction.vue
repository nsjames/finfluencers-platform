<template>
	<section class="post-prediction">
		<label>Asset and target</label>
		<section class="holder">
			<!--<DropdownInput style="flex:1;" :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" v-on:changed="x => content.data.price = x" />-->
			<DualInput style="flex:1;"
			           :value-b="content.data.asset" :placeholder-b="'ASSET'"
			           :value-a="content.data.price" :placeholder-a="'$100.00'"
			           v-on:changedb="x => content.data.asset = x"
			           v-on:changeda="x => content.data.price = x"
			/>
			<section class="target-date">
				<VueDatePicker v-model="content.data.date" attach=".target-date .picker-attach" :min-date="new Date()" />
				<div class="picker-attach"></div>
			</section>

		</section>
	</section>
</template>

<script>

	export default {
		props:['content'],
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
