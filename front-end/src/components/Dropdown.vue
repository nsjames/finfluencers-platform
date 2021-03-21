<template>
	<section :id="randomId" class="dropdown" :class="{'transparent':!!transparent, 'is-images':isImages, 'open':open}">
		<section class="selected" @click="open = !open">
			<figure class="option active">
				<div v-if="isImages" :style="`background-image:url(${typeof selected === 'object' ? selected.image : selected})`"></div>
				<span v-if="!hideSelectedText">{{typeof selected === 'object' ? selected.text : selected}}</span>
			</figure>
			<figure class="chevron">
				<i class="fas fa-chevron-down"></i>
			</figure>
		</section>
		<section class="options" v-if="open">
			<figure class="option" v-for="option in options" @click="select(option)">
				<div v-if="isImages" :style="`background-image:url(${typeof option === 'object' ? option.image : option})`"></div>
				<span>{{typeof option === 'object' ? option.text : option}}</span>
			</figure>
		</section>
	</section>
</template>

<script>
	import {EventBus} from "../services/EventBus";

	export default {
		props:['transparent', 'isImages', 'options', 'selected', 'hideSelectedText'],
		name: "Dropdown",
		data(){return {
			open:false,
			randomId:Math.round(Math.random() * 999999999),
		}},
		mounted(){
			EventBus.$on('close-dropdowns', this.handleCloseDropdowns)
		},
		destroyed(){
			EventBus.$off('close-dropdowns', this.handleCloseDropdowns)
		},
		methods:{
			handleCloseDropdowns(id){
				if(this.randomId !== id) this.open = false;
			},
			select(option){
				this.$emit('selected', option);
				this.open = false;
			}
		},
		watch:{
			'open'(){
				if(this.open) EventBus.$emit('opened-dropdown', this.randomId);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dropdown {
		position: relative;
		box-shadow:var(--soft-shadow);


		> .selected {
			height:60px;
			background:var(--background-color);
			border-radius:var(--radius);
			display:flex;
			align-items: center;
			position: relative;
			cursor: pointer;
			z-index:2;
			padding-right:30px;


			> .chevron {
				position:absolute;
				right:10px;
				padding:20px 10px;
				border-radius:var(--radius);
				color:var(--text-primary);
			}

		}

		> .options {
			position:absolute;
			background:var(--background-color);
			border-radius:var(--radius);
			top:62px;
			z-index:2;
			left:0;
			right:0;
			box-shadow:var(--soft-shadow);
			overflow: hidden;
			overflow-y: auto;
			max-height:260px;
			min-width:260px;
			text-align: left;
		}

		.option {
			display:flex;
			padding:14px 20px;
			cursor: pointer;
			color:var(--text-primary);

			&:not(.active){
				&:hover {
					background:var(--highlight);
					color:var(--background-color);
				}
			}
		}

		&.is-images {

		}

		&.transparent {
			box-shadow:none;

			> .selected {
				background:transparent;
			}

		}
	}
</style>
