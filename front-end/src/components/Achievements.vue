<template>
	<section class="achievements">
		<section class="achievement" v-for="achievement in achievements" v-tooltip="achievement.description">
			<figure class="icon">
				<i :class="achievement.icon"></i>
			</figure>
			<figure class="text">{{achievement.title}}</figure>
		</section>
	</section>
</template>

<script>
	export default {
		name: "Achievements.vue",
		computed:{
			achievements(){
				return [
					{
						description:`Put 5% of monthly income into savings for 6 months in a row.`,
						icon:'fas fa-piggy-bank',
						title:`Savings II`
					},
					{
						description:`Put 10% of monthly income into savings for 6 months in a row.`,
						icon:'fas fa-piggy-bank',
						title:`Savings I`
					},
					{
						description:`Got 1000 positive feedback ratings from advice.`,
						icon:'fas fa-hands-helping',
						title:`Advice Novice`
					},
					{
						description:`Got 1st place in the bi-monthly financial advice tournament.`,
						icon:'fas fa-award',
						title:`First Place`
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.achievements {
		width:100%;
		margin-top:20px;
		text-align: left;
		flex-wrap: wrap;
		display:flex;

		.achievement {
			margin-right:5px;
			background:var(--highlight);
			color:#fff;
			height:30px;
			padding:0 15px;
			display:flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
			cursor: pointer;
			position: relative;
			border-radius:50px;
			box-shadow:inset 0px 3px 8px var(--highlight), inset 0px 12px 8px rgba(255,255,255,0.3);

			.icon {
				font-size: 16px;
				margin-right:5px;
			}

			.text {
				font-size: 11px;
			}
		}
	}
</style>
