<template>
	<section class="spread-bar" :style="{'margin-top':`${margin || 70}px`, 'margin-bottom':`${margin || 70}px`}">

	</section>
</template>

<script>
	export default {
		props:['margin']
	}
</script>

<style lang="scss" scoped>
	.spread-bar {
		margin:70px auto;
		height:8px;
		width:100%;

		border-radius: 20px;

	}

	.light {
		.spread-bar {
			background: linear-gradient(270deg, #E7E7FF 0.83%, #E5FDEC 100%);
		}
	}

	.dark {
		.spread-bar {
			background: linear-gradient(270deg, #1A1A32 0.83%, #232340 100%);
		}
	}
</style>
