<template>
	<section class="asset-bubble">
		<figure class="icon">
			<span v-if="symbol">{{(symbol).slice(0, 7)}}</span>
		</figure>
	</section>
</template>

<script>
	export default {
		props:['symbol']
	}
</script>

<style lang="scss" scoped>
	$bubble:80px;
	$icon:60px;
	.asset-bubble {
		width:$bubble;
		height:$bubble;
		border-radius:50%;
		box-shadow:var(--soft-shadow);
		display:flex;
		align-items: center;
		justify-content: center;
		background:rgba(255,255,255,0.06);

		transition: all 0.8s ease;
		transition-property: box-shadow;

		.icon {
			width:$icon;
			height:$icon;
			border-radius:50%;
			overflow: hidden;
			background-size:cover;
			background-position: center;
			background:var(--highlight-opaque);

			display:flex;
			align-items: center;
			justify-content: center;
			color:var(--text-primary);
			font-weight: bold;
			font-size: 11px;
		}

	}
</style>
