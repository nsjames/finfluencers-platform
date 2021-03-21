<template>
	<section class="post-portfolio">

		<section class="totals">
			<span>$1,234,567.89</span>
			<span>6 assets</span>
		</section>
		<Graph :height="130" />
		<section class="details">
			<section>
				<span>Best performer</span>
				<span>UNI</span>
			</section>
			<section>
				<span>Worst performer</span>
				<span>EOS</span>
			</section>
			<section>
				<span>P/L</span>
				<span>+$3,010</span>
			</section>
		</section>

	</section>
</template>

<script>
	export default {

	}
</script>

<style lang="scss" scoped>
	.post-portfolio {
		//box-shadow:var(--soft-shadow);
		background:var(--graph-bg);
		border-radius:var(--radius);
		text-align:left;

		.totals {
			padding:30px;

			span {
				display:block;
				font-family: var(--secondary-font);

				&:nth-child(1){
					font-size: 20px;
					color:var(--text-primary);
				}

				&:nth-child(2){
					font-size: 14px;
					color:var(--text-secondary);
					margin-top:5px;
				}
			}
		}

		.graph {
		}

		.details {
			padding:30px;

			display:flex;

			> section {
				padding-right:50px;

				span {
					display:block;

					&:nth-child(1){
						font-size: 11px;
						color:var(--text-secondary);
					}

					&:nth-child(2){
						font-size: 20px;
						color:var(--text-primary);
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
