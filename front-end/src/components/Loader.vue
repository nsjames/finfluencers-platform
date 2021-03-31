<template>
	<section class="graphic">
		<section>
			<svg class="fin" viewBox="0 0 55 38" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M13.228 1.28403C5.27702 5.26138 22.3052 35.7882 3 43.0314C8.39618 47.3052 13.5824 61.5 21 61.5C34.4682 61.5 74 64 52.1756 29.585C36.1686 16.1312 18.6971 -1.45071 13.228 1.28403Z" stroke-width="2"/>
			</svg>

			<svg class="wave" viewBox="0 0 122 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M106.234 8.5C98.6172 8.5 98.6172 1 91 1C83.6172 1 83.6172 8.5 76.2344 8.5C68.6172 8.5 68.6172 1 61 1C53.6172 1 53.6172 8.5 46.2344 8.5C38.6172 8.5 38.6172 1 31 1C23.6172 1 23.6172 8.5 16.2344 8.5C8.61719 8.5 8.61719 1 1 1V15.0227H121V1C113.617 1 113.617 8.5 106.234 8.5Z" stroke-width="2"/>
			</svg>
		</section>
	</section>
</template>

<style lang="scss" scoped>
	$loader:200px;
	.graphic {
		display:flex;
		width:$loader;
		height:$loader;
		border-radius: 50%;
		overflow: hidden;
		position: relative;
		box-shadow: var(--soft-shadow);
		padding:8px;
		background:var(--content-bg);

		> section {
			position: relative;
			width:100%;
			height:100%;
			border-radius: 50%;
			overflow: hidden;
			background:var(--background-color);
		}

		svg.fin {
			animation-name: sharkfin;
			animation-duration: 2s;
			animation-iteration-count: infinite;
			animation-timing-function: linear;
			position: absolute;
			top:30%;
			width:100%;
			//stroke:var(--shark-fin);
			fill:var(--highlight);
			opacity:0.15;
		}

		svg.wave {
			animation-name: wave;
			animation-duration: 1.5s;
			animation-iteration-count: infinite;
			animation-timing-function: linear;
			position: absolute;
			height:50%;
			top:67%;
			width:200%;
			//stroke:var(--text-primary);
			fill:var(--highlight);
			transform:scaleY(0.8);
			margin-top:-1px;
		}


		@keyframes sharkfin {
			0%   {
				left:0%;
			}
			50% {
				left:-5%;
			}
			100% {
				left:0%;
			}
		}

		@keyframes wave {
			0%   {
				left:0;
			}
			100% {
				left:calc(-100% + 2px);
			}
		}
	}
</style>
