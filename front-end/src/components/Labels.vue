<template>
	<section class="labels" :class="{'important':important}">
		<section class="label" v-for="label in labels">
			{{label}}
		</section>
	</section>
</template>

<script>
	export default {
		props:['labels', 'important'],
	}
</script>

<style lang="scss" scoped>
	.labels {
		display:flex;
		position:absolute;
		top:20px;
		right:0;
		justify-content: flex-end;
		flex-wrap: wrap;

		.label {
			padding:3px 8px;
			font-size: 11px;
			border:none;
			background:var(--highlight-opaque);
			color:var(--text-primary);
			border-radius:4px;
			margin-left: 10px;
			margin-bottom:5px;
		}

		&.important {
			.label {
				background:var(--highlight);
				color:#fff;
			}
		}
	}
</style>
