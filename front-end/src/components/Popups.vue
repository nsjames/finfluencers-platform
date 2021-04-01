<template>
	<section class="popups">
		<section class="popup-container" v-if="nextPopup">
			<figure class="bg" @click="closeOpenPopup"></figure>

			<section class="popup"></section>
		</section>
	</section>
</template>

<script>
	import {mapState} from "vuex";

	export default {
		data(){return {

		}},
		components:{

		},
		computed:{
			...mapState([
				'popups',
			]),
			nextPopup(){
				// return true;
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
			z-index:var(--popup-index);

			.bg {
				position: fixed;
				top:0;
				bottom:0;
				left:0;
				right:0;
				background:var(--colorful-button);
				opacity: 0.9;
				z-index:-1;
			}

			.popup {
				padding:20px;
				background:var(--background-color);
				position: relative;
				z-index:1;
				border-radius:var(--radius);
				box-shadow:var(--soft-shadow);
				width:100%;
				margin:20px;
				max-width:500px;

				color:var(--text-primary);
			}
		}
	}
</style>
