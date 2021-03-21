<template>
	<section class="post-trade">
		<section>
			<label>From</label>
			<DropdownInput :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" />
		</section>
		<section>
			<label>To</label>
			<DropdownInput :options="[1,1,1]" :selected="'Hello'" :value="'1.0'" placeholder="1.0" />
		</section>

	</section>
</template>

<script>
	export default {

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
