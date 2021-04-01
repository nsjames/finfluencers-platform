<template>
	<section class="content-trade">

		<section class="assets">
			<Asset :symbol="trade.from.symbol" />
			<i class="fas fa-arrow-right"></i>
			<Asset :symbol="trade.to.symbol" />
		</section>

		<section class="conversion" v-if="!trade.sandboxed">
			I just traded <b>{{formatNumber(trade.from.amount)}} {{trade.from.symbol}}</b> for <b>{{trade.to.amount}} {{trade.to.symbol}}</b>
		</section>
		<section class="conversion" v-if="trade.sandboxed">
			I'm thinking about trading <b>{{formatNumber(trade.from.amount)}} {{trade.from.symbol}}</b> for <b>{{trade.to.amount}} {{trade.to.symbol}}</b>
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
		margin-bottom:30px;
		position: relative;

		.assets {
			display:flex;
			align-items: center;

			i {
				margin:0 10px;
				color:var(--text-secondary);
			}
		}

		.conversion {
			font-size: 14px;
			color:var(--text-primary);
			font-weight: 800;
			margin:15px 0 10px;
			border-radius:var(--radius);
			display:table;

			b {
				color:var(--highlight);
			}
		}
	}
</style>
