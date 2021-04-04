<template>
	<section class="timeline" @mouseup="onStopDragTimeSelector" @mousemove="dragTimeline">
		<section class="main-graph" @mouseleave="tooltip = null">
			<TimelineGraph v-on:tooltip="showTooltip" class="graph" :data-a="fullData" :updater="updateGraph" :style="{'left':`${1 - timelineEnd / fullData.length * 100}%`}" />

			<section class="tooltip" v-if="tooltip">
				<figure class="action">{{tooltip.action}}</figure>
				<section class="details">
					<section v-for="details in tooltip.details">
						<figure>{{details[0]}}</figure>
						<figure>{{details[1]}}</figure>
					</section>
				</section>
			</section>
		</section>

		<section class="timeline-tabs">
			<section class="tab active">
				<figure>0</figure>
				<figure>Financial Potential</figure>
			</section>
			<section class="tab disabled">
				<figure>{{parseInt(profile.snapshot.influence)}}</figure>
				<figure>Influence</figure>
			</section>
			<section class="tab disabled">
				<figure>{{parseInt(profile.snapshot.subscribers)}}</figure>
				<figure>Subscribers</figure>
			</section>
		</section>

		<section class="timeline-picker">
			<section class="period">
				<figure class="disabled">All</figure>
				<figure class="disabled">1y</figure>
				<figure class="disabled">6m</figure>
				<figure class="disabled">3m</figure>
				<figure class="active">1m</figure>
			</section>
			<section class="graph" ref="graphcontainer">
				<figure class="time-selector" ref="timeselector" @mousedown="onStartDragTimeSelector" :style="{'right':`${timeline}px`}">
					<figure></figure>
					<figure></figure>
				</figure>
				<TimelineGraph class="graph" :data-a="fullData" :small="true" />
			</section>
		</section>
	</section>
</template>

<script>
	import TimelineGraph from './TimelineGraph';

	export default {
		name: "Timeline.vue",
		props:['profile'],
		components:{
			TimelineGraph,
		},
		data(){return {
			timeline:0,
			draggingTimeline:false,
			startDragPosX:0,
			fullData:[...Array(30).keys()].map((x,i) => 0),
			updateGraph:0,
			tooltip:null,
		}},
		computed:{
			timelineEnd(){
				if(this.timeline === 0) return this.fullData.length;
				return Math.round(this.fullData.length - (this.fullData.length * (this.timeline / this.graphContainerWidth() || 1)));
			},
		},
		methods:{
			showTooltip(tooltip){
				if(!tooltip) return this.tooltip = null;

				const actions = ['Savings', 'Investment', 'Expense', 'Income'];
				const randomIndex = Math.round(tooltip.x) % actions.length;
				const randomDollars = () => `$${Math.round(tooltip.x)}`;
				const details = {
					0:[[randomDollars(), 'Goal'], ['1/1/2021', 'Completed']],
					1:[[randomDollars(), 'Invested']],
					2:[[randomDollars(), 'Spent']],
					3:[[randomDollars(), 'Earned']],
				}

				this.tooltip = {
					x:tooltip.x,
					y:tooltip.y,
					// action:actions[randomIndex],
					// details:details[randomIndex]
					action:'',
					details:[
						['Be patient', `You haven't made any financial decisions yet. Once you do you will be able to see how your finances progress.`]
					]
				}
				this.$forceUpdate();
			},
			graphContainerWidth(){
				try {
					return this.$refs.graphcontainer.getBoundingClientRect().width - this.$refs.timeselector.getBoundingClientRect().width;
				} catch(e){
					return 0;
				}
			},
			onStartDragTimeSelector(event){
				if(!this.startDragPosX) this.startDragPosX = event.clientX;
				this.draggingTimeline = true;
			},
			onStopDragTimeSelector(event){
				this.draggingTimeline = false;
				this.$forceUpdate();
			},
			dragTimeline(event){
				if(!this.draggingTimeline) return;
				this.timeline = -(event.clientX - this.startDragPosX);
				if(this.timeline < 0) this.timeline = 0;
				if(this.timeline > this.graphContainerWidth()) this.timeline = this.graphContainerWidth();
				this.updateGraph++;
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.timeline {
		margin-top:40px;

		.main-graph {
			position: relative;
			height:240px;
			overflow:hidden;
			// background:var(--graph-bg);

			.graph {
				width:200%;
				position:absolute;
				top:0;
				bottom:0;
				z-index:1;
				margin-bottom:-9px;
			}
		}

		.tooltip {
			width:100%;
			text-align: left;
			padding:10px 20px;
			background:var(--content-bg);
			position: relative;
			margin:5px;
			z-index:2;
			border-radius:var(--radius);
			box-shadow:var(--soft-shadow);

			.action {
				font-size: 18px;
				font-weight: bold;
				color:var(--text-primary);
			}

			.details {
				display:flex;

				> section {
					flex:1;

					> figure {
						&:nth-child(1){
							font-size: 14px;
							color:var(--highlight);
						}
						&:nth-child(2){
							font-size: 11px;
							color:var(--text-secondary);
						}
					}
				}
			}
		}

		> .timeline-tabs {
			display:flex;
			padding:0 20px;
			justify-content: center;

			.tab {
				flex:0 0 auto;
				text-align:left;
				padding:20px 40px;
				border-bottom:0px solid transparent;
				cursor: pointer;

				transition: border-bottom 0.2s ease;

				&:hover, &.active {
					border-bottom:3px solid var(--highlight);
				}

				figure {

					&:nth-child(1) {
						font-size: 13px;
						font-weight: bold;
						color:var(--highlight);
					}

					&:nth-child(2) {
						font-size: 13px;
						color:var(--text-secondary);
					}
				}
			}
		}

		> .timeline-picker {
			display:flex;
			align-items: center;
			padding:0 10px;
			border-radius:var(--radius);
			border:1px solid var(--light-line);


			.period {
				display:flex;
				flex:0 0 auto;
				padding:0 20px;
				color:var(--text-primary);

				figure {
					flex:0 0 auto;
					padding:5px 10px;
					font-size: 11px;
					font-weight: bold;
					cursor: pointer;

					&:not(:last-child){
						margin-right:1px;
					}

					&:hover, &.active {
						background:var(--highlight);
						color:#fff;
						border-radius:var(--radius);
					}
				}
			}

			.graph {
				flex:1;
				position: relative;

				.time-selector {
					position:absolute;
					top:5px;
					right:0;
					bottom:5px;
					background:var(--highlight-opaque);
					width:50%;
					z-index:2;
					border-radius:var(--radius);
					overflow:hidden;
					cursor: pointer;
					opacity:0.4;

					transition: all 0.2s ease;
					transition-property: opacity;

					&:hover {
						opacity:0.6;
					}

					&:active {
						opacity:1;
					}

					> figure {

						&:nth-child(1), &:nth-child(2){
							position:absolute;
							top:0;
							bottom:0;
							width:10px;
							background:var(--highlight-opaque);
						}

						&:nth-child(1){
							right:0;
						}

						&:nth-child(2){
							left:0;
						}
					}
				}
			}
		}

		.disabled {
			opacity:0.2;
			cursor: not-allowed !important;
		}
	}
</style>
