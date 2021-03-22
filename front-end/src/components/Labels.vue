<template>
	<section class="labels">
		<section class="label" v-for="label in labels">
			{{label}}
		</section>
	</section>
</template>

<script>
	export default {
		props:['labels'],
	}
</script>

<style lang="scss" scoped>
	.labels {
		display:flex;
		position:absolute;
		top:15px;
		right:15px;
		justify-content: flex-end;
		flex-wrap: wrap;

		.label {
			padding:5px 10px;
			font-size: 9px;
			background:var(--highlight);
			color:#fff;
			border-radius:4px;
			margin-left: 10px;
			margin-bottom:5px;
		}
	}
</style>
