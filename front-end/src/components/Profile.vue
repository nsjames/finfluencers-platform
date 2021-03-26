<template>
	<section class="profile">
		<figure class="avatar" @click="goToProfile" :style="{'width':`${size || 36}px`, 'height':`${size || 36}px`}">
			<img class="image" :src="`data:image/png;base64, ${identicon(user.name, (size || 36) - ((size || 36)/2))}`" />
		</figure>
		<section class="details">
			<figure class="name" @click="goToProfile">{{user ? user.name : 'No username'}}</figure>
			<figure class="potential">{{parseFloat(user ? user.snapshot.potential : 0).toFixed(2)}}</figure>
		</section>
	</section>
</template>

<script>
	import identicon from '../util/identicon';

	export default {
		props:['size', 'user'],
		methods:{
			goToProfile(){
				if(this.user) this.$router.push(`/profile/${this.user.name}`);
				else this.$router.replace('/404');
			},
			identicon,

		}
	}
</script>

<style lang="scss" scoped>
	.profile {
		display:flex;
		align-items: center;
		padding-right:20px;

		.avatar {
			background:var(--colorful-button);
			border-radius:50%;
			margin-right:15px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
			display:flex;
			align-items: center;
			justify-content: center;


			.image {
				transform:rotateZ(-30deg);
			}
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

			.potential {
				font-size: 11px;
				color:var(--text-secondary);
				font-weight: bold;
				font-family: var(--secondary-font);
				opacity:0.5;
				margin-top:2px;
			}
		}
	}
</style>
