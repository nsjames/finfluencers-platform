<template>
	<section class="content-trade">

		<section class="assets">
			<Asset :symbol="trade.from.asset" />
			<i class="fas fa-arrow-right"></i>
			<Asset :symbol="trade.to.asset" />
		</section>

		<section class="conversion" v-if="!trade.sandboxed">
			I just traded <b>{{trade.from.amount}} {{trade.from.asset}}</b> for <b>{{trade.to.amount}} {{trade.to.asset}}</b>
		</section>
		<section class="conversion" v-if="trade.sandboxed">
			I thought about trading <b>{{trade.from.amount}} {{trade.from.asset}}</b> for <b>{{trade.to.amount}} {{trade.to.asset}}</b>
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

		position: relative;

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
			background:var(--graph-bg);
			padding:10px;
			border-radius:var(--radius);
			display:table;
			margin-left:10px;

			b {
				color:var(--highlight);
			}
		}
	}
</style>
