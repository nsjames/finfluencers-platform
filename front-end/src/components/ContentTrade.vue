<template>
	<section class="content-trade">

		<section class="assets">
			<Asset />
			<i class="fas fa-arrow-right"></i>
			<Asset />
		</section>

		<section class="conversion">
			I just converted <b>{{trade.from.amount}} {{trade.from.asset}}</b> to <b>{{trade.to.amount}} {{trade.to.asset}}</b>
		</section>

	</section>
</template>

<script>
	export default {
		props:['trade'],
		computed:{

		}
	}
</script>

<style lang="scss" scoped>
	.content-trade {


		.assets {
			display:flex;
			align-items: center;
			padding:10px;

			i {
				margin:0 10px;
				color:var(--text-secondary);
			}
		}

		.conversion {
			font-size: 14px;
			color:var(--text-primary);
			font-weight: 800;
			margin:10px 0 20px;

			b {
				color:var(--highlight);
			}
		}
	}
</style>
