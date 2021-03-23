<template>
	<section class="post-prediction">
		<label>Token and target</label>
		<section style="display:flex">
			<!--<DropdownInput style="flex:1;" :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" v-on:changed="x => content.data.price = x" />-->
			<DualInput style="flex:1;"
			           :value-b="content.data.asset" :placeholder-b="'TICKER'"
			           :value-a="content.data.price" :placeholder-a="'$100.00'"
			           v-on:changedb="x => content.data.asset = x"
			           v-on:changeda="x => content.data.price = x"
			/>
			<section class="target-date">
				<i class="far fa-calendar-alt"></i>
				<span>Select Date</span>
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
	.post-prediction {
		text-align:left;

		label {
			font-size: 14px;
			font-weight: bold;
			color:var(--text-primary);
			margin-bottom:10px;
			display: block;
		}

		.target-date {
			flex:0 0 auto;
			margin-left:10px;
			height:60px;
			background:var(--background-color);
			box-shadow:var(--soft-shadow);
			padding:0 20px;
			display:flex;
			align-items: center;
			border-radius:var(--radius);
			font-size: 20px;
			cursor: pointer;

			span {
				font-size: 14px;
				margin-left:20px;
				color:var(--text-secondary);
				font-weight: bold;
			}
		}
	}
</style>
