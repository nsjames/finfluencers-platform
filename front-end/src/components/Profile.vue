<template>
	<section class="profile">
		<figure class="avatar" @click="goToProfile" :style="{'width':`${size || 36}px`, 'height':`${size || 36}px`}"></figure>
		<section class="details">
			<figure class="name" @click="goToProfile">{{user ? user.name : 'No username'}}</figure>
			<figure class="wealth">{{parseFloat(user ? user.wealth : 0).toFixed(2)}}% WS</figure>
		</section>
	</section>
</template>

<script>
	export default {
		props:['size', 'user'],
		methods:{
			goToProfile(){
				this.$router.replace(this.user ? `/profile/${this.user.name}` : '/404');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.profile {
		display:flex;
		align-items: center;
		padding-right:20px;

		.avatar {
			background:var(--graph-bg);
			border-radius:50%;
			margin-right:15px;
			cursor: pointer;
		}

		.details {
			text-align:left;


			.name {
				font-size: 14px;
				font-weight: bold;
				cursor: pointer;
				color:var(--text-primary);

				&:hover {
					color: var(--highlight);
				}
			}

			.wealth {
				font-size: 13px;
				color:var(--text-secondary);
				font-weight: bold;
				font-family: var(--secondary-font);
			}
		}
	}
</style>
