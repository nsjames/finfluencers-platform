<template>
	<section class="profile" :class="{'nav-only':navbar}">
		<figure class="avatar" @click="goToProfile" :style="{'width':`${size || 36}px`, 'height':`${size || 36}px`}">
			<img class="image" :src="`data:image/png;base64, ${identicon(user.name, (size || 36) - ((size || 36)/2))}`" />
		</figure>
		<section class="details" :class="{'desktop-only':navbar}">
			<figure class="name" @click="goToProfile">{{user ? user.name : 'No username'}}</figure>
			<figure class="potential">
				{{parseInt(user ? user.snapshot.influence : 0)}} Influence
			</figure>
		</section>
	</section>
</template>

<script>
	import identicon from '../util/identicon';

	export default {
		props:['size', 'user', 'navbar'],
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
	@import "../styles/variables";

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
				display:table;
			}
		}


		@media only screen and (max-width:$breakpoint) {
			&.nav-only {
				padding-right:0;

				.avatar {
					margin-right:0;
				}
			}
		}
	}
</style>
