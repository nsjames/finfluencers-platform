<template>
	<section class="asset-bubble">
		<figure class="icon"></figure>
	</section>
</template>

<script>
	export default {

	}
</script>

<style lang="scss" scoped>
	$bubble:60px;
	$icon:32px;
	.asset-bubble {
		width:$bubble;
		height:$bubble;
		border-radius:50%;
		box-shadow:var(--soft-shadow);
		display:flex;
		align-items: center;
		justify-content: center;

		transition: all 0.8s ease;
		transition-property: box-shadow;

		.icon {
			width:$icon;
			height:$icon;
			border-radius:50%;
			overflow: hidden;
			background-size:cover;
			background-position: center;
			background:rgba(0,0,0,0.05);
		}

	}
</style>
