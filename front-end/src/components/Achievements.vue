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
						description:`You have achieved the beginner rank. The more you do on finfluencers, the more achievements you will unlock.`,
						icon:'fas fa-graduation-cap',
						title:`Beginner`
					},
					{
						description:`You joined Finfluencers right as we launched. You must be smart.`,
						icon:'fas fa-umbrella-beach',
						title:`Open Beta`
					},
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
			margin-bottom:5px;

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
