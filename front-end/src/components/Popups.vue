<template>
	<section class="popups">
		<section class="popup-container" v-if="nextPopup">
			<figure class="bg" @click="closeOpenPopup"></figure>

			<section class="popup">
				hi
			</section>
		</section>
	</section>
</template>

<script>
	import {mapState} from "vuex";

	export default {
		data(){return {
			show:false,
		}},
		computed:{
			...mapState([
				'popups',
			]),
			nextPopup(){
				return this.popups[0];
			}
		},
		methods:{
			closeOpenPopup(){
				this.popups[0].close();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popups {
		.popup-container {
			display:flex;
			position: fixed;
			top:0;
			bottom:0;
			left:0;
			right:0;
			justify-content: center;
			align-items: center;
			z-index:99;

			.bg {
				position: fixed;
				top:0;
				bottom:0;
				left:0;
				right:0;
				background:var(--risk-bg);
				opacity: 0.9;
				z-index:-1;
			}

			.popup {
				padding:30px;
				background:var(--background-color);
				position: relative;
				z-index:1;
				border-radius:20px;
				box-shadow:0 10px 20px rgba(0,0,0,0.1);

				color:var(--text-primary);
			}
		}
	}
</style>
