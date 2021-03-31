<template>
	<section class="feed-select">
		<section class="options">
			<figure class="option" :class="{'active':feedType === 0}" @click="setFeedType(0)">
				<section class="icon-container">
					<FeedSelectBg class="feed-select-bg" />
					<figure class="icon">
						<svg viewBox="0 0 32 27" xmlns="http://www.w3.org/2000/svg">
							<path d="M30.8592 5.38086L15.9109 0.0419609C15.7543 -0.013987 15.5829 -0.013987 15.4263 0.0419609L0.478039 5.38086C0.188775 5.48419 -0.00324022 5.75968 4.1415e-05 6.06688C0.00324301 6.37407 0.201021 6.64548 0.492446 6.74265L6.54682 8.76134V15.7968C6.54682 16.118 6.75932 16.4003 7.06804 16.4891L15.4695 18.9065C15.5346 18.9252 15.6016 18.9346 15.6686 18.9346C15.7357 18.9346 15.8028 18.9253 15.8678 18.9065L18.5132 18.1454C18.8955 18.0353 19.1163 17.6362 19.0063 17.2539C18.8962 16.8715 18.4974 16.6506 18.1148 16.7608L15.6686 17.4646L7.98753 15.2545V9.24166L15.4408 11.7267C15.5887 11.776 15.7486 11.7761 15.8964 11.7267L17.2347 11.2806C17.2349 11.2806 17.2349 11.2805 17.2351 11.2804L18.3623 10.9046C18.7397 10.7788 18.9437 10.3709 18.8178 9.99339C18.6919 9.616 18.284 9.4119 17.9065 9.53788L15.6686 10.284L8.97042 8.05066L2.9275 6.03582L15.6686 1.48524L28.4098 6.03582L23.8424 7.55874C23.8423 7.55874 23.8423 7.55874 23.8423 7.55874L23.2786 7.74667L22.8139 7.90163H22.8138L22.0933 8.14183C21.7158 8.26765 21.5119 8.67561 21.6378 9.05308C21.7636 9.43047 22.1714 9.63417 22.549 9.50859L23.3498 9.24158V15.2544L22.4519 15.5128C22.0696 15.6228 21.8488 16.0219 21.9588 16.4043C22.0497 16.7201 22.3377 16.9256 22.6508 16.9256C22.7167 16.9256 22.7838 16.9166 22.8503 16.8974L24.2693 16.489C24.5779 16.4003 24.7905 16.1178 24.7905 15.7968V8.76126L30.8449 6.74257C31.1364 6.6454 31.3341 6.37407 31.3373 6.0668C31.3405 5.7596 31.1485 5.48419 30.8592 5.38086Z" />
							<path d="M21.2084 9.41701C21.2079 9.40036 21.2075 9.38363 21.2059 9.36698C21.2047 9.3549 21.2026 9.34313 21.2008 9.33121C21.1991 9.32 21.1979 9.30888 21.1958 9.29783C21.1932 9.28454 21.1897 9.27158 21.1864 9.25861C21.1839 9.24901 21.1818 9.23932 21.179 9.2298C21.1751 9.21699 21.1706 9.20466 21.1661 9.19218C21.1626 9.18249 21.1594 9.17281 21.1554 9.16328C21.1508 9.15192 21.1454 9.14103 21.1403 9.12999C21.1354 9.11966 21.1308 9.10918 21.1253 9.09901C21.1202 9.08925 21.1144 9.07996 21.1089 9.0706C21.1025 9.05979 21.0962 9.04891 21.0892 9.03834C21.0834 9.02954 21.0769 9.02113 21.0706 9.01249C21.0631 9.00224 21.0558 8.99184 21.0478 8.98191C21.04 8.97247 21.0317 8.96358 21.0235 8.95462C21.016 8.9463 21.0089 8.93781 21.001 8.92981C20.9882 8.91684 20.9746 8.90475 20.9609 8.89283C20.957 8.88947 20.9537 8.88587 20.9497 8.88258L20.948 8.88106C20.9476 8.88074 20.9471 8.88034 20.9466 8.87994L16.1293 4.87195C15.8237 4.6175 15.3694 4.65912 15.1148 4.96496C14.8604 5.27079 14.9021 5.72501 15.2079 5.97946L19.7686 9.77399V22.5448C18.9692 22.7091 18.3661 23.4181 18.3661 24.2654V25.2438C18.3661 26.2123 19.154 27.0002 20.1224 27.0002H21.101C22.0695 27.0002 22.8573 26.2122 22.8573 25.2438V24.2654C22.8573 23.3333 22.1274 22.5689 21.2093 22.5127V9.43982C21.2093 9.43966 21.2093 9.43942 21.2093 9.43918V9.43622C21.2094 9.42982 21.2086 9.42349 21.2084 9.41701ZM21.4166 24.2654V25.2438C21.4166 25.4179 21.275 25.5594 21.101 25.5594H20.1224C19.9484 25.5594 19.8068 25.4178 19.8068 25.2438V24.2654C19.8068 24.0913 19.9484 23.9498 20.1224 23.9498H21.101C21.2751 23.9498 21.4166 24.0913 21.4166 24.2654Z" />
						</svg>
					</figure>
				</section>
				<span class="desktop-only">Learn</span>
				<p class="desktop-only">Develop your financial knowledge</p>
			</figure>
			<figure class="option" :class="{'active':feedType === 1}" @click="setFeedType(1)">
				<section class="icon-container">
					<FeedSelectBg class="feed-select-bg" />
					<figure class="icon">
						<svg viewBox="0 0 20 33" xmlns="http://www.w3.org/2000/svg">
							<path d="M10.0008 0C4.48616 0 0 4.52865 0 10.0934C0 12.2719 0.678764 14.3489 1.93883 16.0593L2.40198 16.7522C3.84333 18.8848 5.8173 21.8093 5.70631 23.8557L5.66637 24.5969L13.6006 24.5921L14.3017 24.5792L14.2953 23.8718C14.2953 23.8493 14.3129 21.5233 17.693 16.5959L18.0013 16.1423C18.2991 15.7467 18.5706 15.3197 18.803 14.883C18.9523 14.6083 19.0857 14.3312 19.2062 14.0363C19.7333 12.7891 20 11.4622 20 10.0934C20 4.52865 15.5138 0 10.0008 0ZM17.923 13.4933C17.8208 13.7454 17.7082 13.9775 17.5821 14.2111C17.376 14.5906 17.1428 14.9572 16.8753 15.3197L16.5472 15.7999C13.892 19.6711 13.1662 22.0672 12.9729 23.1886L7.07578 23.1927C6.83064 20.8143 4.95727 18.0412 3.55186 15.9602L3.08232 15.2609C1.97716 13.7543 1.39025 11.9698 1.39025 10.0934C1.39025 5.30369 5.25433 1.40751 10.0008 1.40751C14.7465 1.40751 18.6089 5.30369 18.6089 10.0934C18.6089 11.2704 18.379 12.4121 17.923 13.4933Z" />
							<path d="M12.0601 31.5964H7.9397V32.9999H12.0601V31.5964Z" />
							<path d="M14.1747 28.825H5.82605V30.23H14.1747V28.825Z" />
							<path d="M12.6518 5.07328C12.3164 4.94841 11.9244 5.13612 11.803 5.47048C11.6768 5.81771 11.8533 6.20039 12.1967 6.32689C13.0319 6.63304 13.4104 7.46208 13.5829 8.10096C13.9199 9.36022 13.6883 10.8869 13.2539 11.4122C13.0223 11.6934 13.0607 12.1156 13.3418 12.3524C13.4599 12.4523 13.6109 12.5055 13.765 12.5055C13.8129 12.5055 13.86 12.4999 13.9071 12.491C14.0509 12.458 14.1802 12.379 14.2729 12.2662C15.0339 11.3422 15.2902 9.36022 14.8606 7.7513C14.5044 6.41631 13.7195 5.46563 12.6518 5.07328Z" />
							<path d="M14.1747 26.0535H5.82605V27.4585H14.1747V26.0535Z" />
						</svg>
					</figure>
				</section>
				<span class="desktop-only">Influence</span>
				<p class="desktop-only">Share your financial knowledge</p>
			</figure>
		</section>
	</section>
</template>

<script>
	import {mapActions, mapState} from "vuex";
	import FeedSelectBg from './svgs/FeedSelectBg';

	export default {
		name: "FeedSelect",
		components:{
			FeedSelectBg
		},
		computed:{
			...mapState([
				'feedType'
			])
		},
		methods:{
			...mapActions([
				'setFeedType'
			])
		}
	}
</script>

<style lang="scss" scoped>
	@import "../styles/variables";

	$feedbackground:var(--feed-select-bg);
	$feedshadow:inset 0 -60px 60px -50px rgba(0,0,0,.02);
	.feed-select {
		background:$feedbackground;
		margin-top:-50px;
		position: relative;
		box-shadow:$feedshadow;
		border-bottom:1px solid var(--feed-select-bg-line);

		&:after, &:before {
			content:'';
			position: absolute;
			width:100%;
			top:0;
			bottom:-1px;
			background:$feedbackground;
			z-index:-1;
			box-shadow:$feedshadow;
			border-bottom:1px solid var(--feed-select-bg-line);
		}

		&:after {
			left:-100%;
		}

		&:before {
			right:-100%;
		}

		.options {
			display:flex;

			.option {
				flex:1;
				font-size: 13px;
				display:flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				padding:46px 0;
				border-bottom:1px solid transparent;
				margin-bottom:-1px;
				flex-direction: column;

				transition:all 0.5s ease;
				transition-property: color, background, border-bottom;

				color:var(--light-line);


				.icon-container {
					position: relative;
					height:80px;

					.feed-select-bg {
						fill:var(--content-bg);

						transition:fill 0.5s ease;
					}

					.icon {
						position:absolute;
						top:20px;
						left:35px;
						right:0;
						height:28px;
						width:34px;

						svg {
							height:inherit;
							fill:var(--text-secondary);
							transition:fill 0.5s ease;
						}

					}
				}


				&.active {
					border-bottom:1px solid var(--highlight);
					color:var(--highlight);

					.feed-select-bg {
						fill:var(--highlight);

					}

					.icon {
						svg {
							fill:#fff;
						}
					}
				}

				i {
					font-size: 36px;
				}

				span {
					font-size: 20px;
					font-weight: bold;
				}

				p {
					font-size: 11px;
					font-family: var(--secondary-font);
					margin-top:4px;
				}

				@media only screen and (max-width:$breakpoint) {
					padding:30px 0;
					i {
						font-size: 24px;
					}
				}
			}
		}
	}
</style>
