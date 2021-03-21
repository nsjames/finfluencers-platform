<template>
	<section class="post-prediction">
		<label>Token and target</label>
		<section style="display:flex">
			<DropdownInput style="flex:1;" :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" />
			<section class="target-date">
				<i class="far fa-calendar-alt"></i>
				<span>Select Date</span>
			</section>
		</section>
	</section>
</template>

<script>
	export default {

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
