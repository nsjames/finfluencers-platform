<template>
	<section class="content-prediction">

		<section class="details">
			<Asset :symbol="prediction.asset" />
			<section class="info">
				<figure class="asset">{{prediction.asset}}</figure>
				<figure class="price">${{prediction.price}}</figure>
				<figure class="duration">{{duration}} day prediction</figure>
			</section>
		</section>

	</section>
</template>

<script>
	export default {
		props:['prediction', 'createdAt'],
		computed:{
			duration(){
				const date1 = new Date(this.createdAt);
				const date2 = new Date(this.prediction.date);
				return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-prediction {
		position: relative;
		z-index:1;

		.details {
			display:flex;
			align-items: center;
			margin-bottom:20px;
			padding:10px;
			position: relative;
			z-index:2;

			.info {
				margin-left:20px;

				.asset, .price {
					display:inline-block;
					font-size: 20px;
					font-family: var(--secondary-font);
					color:var(--text-primary);
				}

				.price {
					color:var(--highlight);
					font-weight: bold;
					margin-left:10px;
				}

				.asset {
					font-weight: bold;
				}

				.duration {
					color:var(--text-secondary);
					font-size: 14px;
					margin-top:3px;
				}
			}
		}
	}
</style>
