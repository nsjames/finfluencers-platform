<template>
	<section class="post-trade">
		<section>
			<label>From</label>
			<!--<DropdownInput :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" v-on:changed="x => content.data.from.amount = x" />-->
			<DualInput :value-b="content.data.from.asset" :placeholder-b="'TICKER'" :value-a="content.data.from.amount" placeholder-a="100.00"
			           v-on:changeda="x => content.data.from.amount = x"
			           v-on:changedb="x => content.data.from.asset = x"
			/>
		</section>
		<section>
			<label>To</label>
			<!--<DropdownInput :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" v-on:changed="x => content.data.to.amount = x" />-->
			<DualInput :value-b="content.data.to.asset" :placeholder-b="'TICKER'" :value-a="content.data.to.amount" placeholder-a="100.00"
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
	.post-trade {
		display:flex;
		justify-content: space-between;

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

		}
	}
</style>
