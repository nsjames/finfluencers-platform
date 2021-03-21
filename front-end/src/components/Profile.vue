<template>
	<section class="profile">
		<figure class="avatar" @click="$router.push('/profile/1234')" :style="{'width':`${size || 36}px`, 'height':`${size || 36}px`}"></figure>
		<section class="details">
			<figure class="name">testing</figure>
			<figure class="wealth">$14.4m</figure>
		</section>
	</section>
</template>

<script>
	export default {
		props:['size']
	}
</script>

<style lang="scss" scoped>
	.profile {
		display:flex;
		align-items: center;
		padding-right:20px;

		.avatar {
			background:red;
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
