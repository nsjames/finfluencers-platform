<template>
	<section class="popups">
		<section class="popup-container" v-if="nextPopup">
			<figure class="bg" @click="closeOpenPopup"></figure>

			<section class="popup">
				<UnlockKey :popup="nextPopup" v-if="nextPopup.type === 'unlock-key'" />
			</section>
		</section>
	</section>
</template>

<script>
	import {mapState} from "vuex";

	export default {
		data(){return {

		}},
		components:{
			UnlockKey:() => import('./popups/UnlockKey'),
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
				padding:20px 30px;
				background:var(--content-bg);
				position: relative;
				z-index:1;
				border-radius:var(--radius);
				box-shadow:var(--soft-shadow), var(--nav-shadow);
				width:100%;
				margin:20px;
				max-width:500px;
				text-align: left;

				color:var(--text-primary);
			}
		}
	}
</style>
