<template>
	<section class="post-content">
		<transition name="switch-content-type" mode="out-in">
			<PostTrade v-if="selectedContentType.id === 'trade'" />
			<PostPrediction v-if="selectedContentType.id === 'predict'" />
			<ContentPortfolio v-if="selectedContentType.id === 'portfolio'" />
		</transition>

		<section class="post-text">
			<textarea :placeholder="textPlaceholder"></textarea>
		</section>

		<section class="actions">
			<section class="post-type">
				<Dropdown :transparent="true" :selected="selectedContentType" :options="contentTypes"
					v-on:selected="x => selectedContentType = x" />
			</section>
			<section class="post-details">
				<span>0/255</span>
				<button>Post</button>
			</section>
		</section>
	</section>
</template>

<script>

	const contentTypes = [
		{
			id:'text',
			text:'Spread your financial knowledge',
			image:'',
		},
		{
			id:'trade',
			text:'Share your latest trade',
			image:'',
		},
		{
			id:'predict',
			text:'Make a market prediction',
			image:'',
		},
		{
			id:'portfolio',
			text:'Show off your portfolio',
			image:'',
		},
	]

	export default {
		components:{
			ContentPortfolio:() => import('./ContentPortfolio'),
			PostTrade:() => import('./post-content/PostTrade'),
			PostPrediction:() => import('./post-content/PostPrediction'),
		},
		data(){return {
			contentTypes,
			selectedContentType:contentTypes[0],
		}},
		computed:{
			textPlaceholder(){
				if(this.selectedContentType.id === 'predict') return 'Why do you think so?';
				if(this.selectedContentType.id === 'trade') return 'What made you do this trade?';
				if(this.selectedContentType.id === 'portfolio') return `Give your portfolio some context...`;
				if(this.selectedContentType.id === 'text') return `Let them in on your secret sauce.`;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.post-content {


		.switch-content-type-enter-active, .switch-content-type-leave-active {
			transition: all 0.2s ease;
			transition-property: transform, opacity;
		}
		.switch-content-type-enter, .switch-content-type-leave-to /* .switch-content-type-leave-active below version 2.1.8 */ {
			transform:translateY(-20px);
			opacity:0;
		}

		.post-text {
			width:100%;
			min-height:140px;
			box-shadow:var(--soft-shadow);
			position: relative;
			margin:20px 0;
			border-radius:var(--radius);
			background:var(--background-color);


			transition: box-shadow 0.5s ease;

			textarea {
				background:transparent;
				position: absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				padding:30px;
				width:100%;
				resize: none;
				border:0;
				outline:0;
				font-size: 16px;
				color:var(--text-primary);
			}
		}

		.actions {
			display:flex;
			justify-content: space-between;
			align-items: center;

			.post-type {

			}

			.post-details {
				flex:1;
				justify-content: flex-end;

				display:flex;
				align-items: center;
				font-size: 14px;

				span {
					margin-right:20px;
					color:var(--text-secondary);
					font-size: 14px;
					font-family: var(--secondary-font);
				}

				button {
					cursor: pointer;
					outline:0;
					border:0;
					padding:10px 40px;
					font-size: 14px;
					font-weight: bold;
					color:#101010;
					background:var(--colorful-button);
					border-radius: var(--radius);

				}
			}
		}
	}
</style>
