<template>
	<section class="four-oh-four">
		<section>
			<Loader class="graphic" />
			<figure class="title">Uh Oh</figure>
			<figure class="text">
				Looks like you're somewhere where you're not supposed to be. Typical.
			</figure>
		</section>
	</section>
</template>

<script>

	export default {

	}
</script>

<style lang="scss" scoped>

	.four-oh-four {
		display:flex;
		align-items: center;
		justify-content: center;
		padding:100px 0;

		.graphic {
			margin:0 auto;
		}

		.title {
			margin-top:30px;
			font-size: 48px;
			font-weight: 300;
			color:var(--text-primary);
		}

		.text {
			margin-top:20px;
			font-size: 14px;
			color:var(--text-secondary);
		}
	}
</style>
