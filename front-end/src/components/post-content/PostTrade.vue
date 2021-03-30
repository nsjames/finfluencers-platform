<template>
	<section class="post-trade">
		<section>
			<label>From</label>
			<!--<DropdownInput :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" v-on:changed="x => content.data.from.amount = x" />-->
			<DualInput type-a="number" :value-b="content.data.from.asset" :placeholder-b="'ASSET'" :value-a="content.data.from.amount" placeholder-a="100.00"
			           v-on:changeda="x => content.data.from.amount = x"
			           v-on:changedb="x => content.data.from.asset = x"
			/>
		</section>
		<section>
			<label>To</label>
			<!--<DropdownInput :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" v-on:changed="x => content.data.to.amount = x" />-->
			<DualInput type-a="number" :value-b="content.data.to.asset" :placeholder-b="'ASSET'" :value-a="content.data.to.amount" placeholder-a="100.00"
			           v-on:changeda="x => content.data.to.amount = x"
			           v-on:changedb="x => content.data.to.asset = x"
			/>
		</section>

	</section>
</template>

<script>
	export default {
		props:['content']
	}
</script>

<style lang="scss" scoped>
	@import "../../styles/variables";

	.post-trade {
		display:flex;
		justify-content: space-between;

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
