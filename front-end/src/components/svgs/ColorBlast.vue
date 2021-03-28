<template>
	<section class="color-blast">
		<svg width="675" height="525" viewBox="0 0 675 525" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path opacity="0.9" d="M460.972 35.8215C635.768 113.491 757.773 312.901 604 441.091C261.891 726.285 183.24 186.485 0 166.466C118.079 9.06123 286.176 -41.8484 460.972 35.8215Z" fill="#B3B3FF" fill-opacity="0.7"/>
		</svg>

		<svg width="440" height="427" viewBox="0 0 440 427" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g style="mix-blend-mode:lighten" opacity="0.6">
				<path d="M63.9361 396.968C-24.9465 343.784 -19.8165 213.549 75.3942 106.079C242.024 -54.4015 350.534 -0.515764 395.811 64.2991C464.594 162.763 452.927 217.761 357.716 325.231C262.505 432.701 152.819 450.152 63.9361 396.968Z" fill="#fff"/>
			</g>
		</svg>

		<svg width="730" height="581" viewBox="0 0 730 581" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path opacity="0.9" d="M67.3064 216.692C176.062 92.146 350.318 -50.8633 534.027 19.2639C805.142 152.619 743.224 315.762 650.856 411.151C551.592 513.662 411.074 606.569 190.26 573.388C-30.5546 540.208 -41.4491 341.237 67.3064 216.692Z" fill="#94FFB2" fill-opacity="0.5"/>
		</svg>



	</section>
</template>

<style lang="scss" scoped>
	.color-blast {
		position:absolute;
		left:0;
		right:0;
		top:130px;
		z-index:-1;

		svg {

			&:nth-child(1){
				position:absolute;
				top:-350px;
				left:calc(-40%);
				opacity:0.2;
				z-index:1;
			}

			&:nth-child(2){
				position:absolute;
				top:-120px;
				left:-100px;
				opacity: 0.99;
				mix-blend-mode: hard-light;
				z-index: 2;

			}

			&:nth-child(3){
				position:absolute;
				top:-590px;
				right:calc(-50%);
				opacity:0.3;
			}
		}
	}

	.dark {
		.color-blast {
			svg {
				display:none;
			}
		}
	}
</style>
