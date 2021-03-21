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
		background:var(--background-color);
		box-shadow:var(--soft-shadow);
		display:flex;
		align-items: center;
		justify-content: center;

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
