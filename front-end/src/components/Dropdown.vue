<template>
	<section :id="randomId" class="dropdown" :class="{'transparent':!!transparent, 'open':open}">
		<section v-if="!optionsOnly" class="selected" @click="open = !open">
			<figure class="option active">
				<i v-if="typeof selected === 'object' && selected.icon" :class="selected.icon"></i>
				<span v-if="!hideSelectedText">{{typeof selected === 'object' ? selected.text : selected}}</span>
			</figure>
			<figure class="chevron">
				<i class="fas fa-chevron-down"></i>
			</figure>
		</section>
		<section class="options" v-if="open" :class="{'at-top':optionsOnly}">
			<figure class="option" v-for="option in options" @click="select(option)" :class="{'selected':typeof selected === 'object' ? selected.id === option.id : selected === option}">
				<i v-if="typeof option === 'object' && option.icon" :class="option.icon"></i>
				<span>{{typeof option === 'object' ? option.text : option}}</span>
			</figure>
		</section>
	</section>
</template>

<script>
	import {EventBus} from "../services/EventBus";

	export default {
		props:['transparent', 'options', 'selected', 'hideSelectedText', 'forceOpen', 'optionsOnly'],
		name: "Dropdown",
		data(){return {
			open:false,
			randomId:Math.round(Math.random() * 999999999),
		}},
		mounted(){
			EventBus.$on('close-dropdowns', this.handleCloseDropdowns)
			if(this.forceOpen) this.open = true;
		},
		destroyed(){
			EventBus.$off('close-dropdowns', this.handleCloseDropdowns)
		},
		methods:{
			handleCloseDropdowns(id){
				if(this.forceOpen) return;
				if(this.randomId !== id) this.open = false;
			},
			select(option){
				this.$emit('selected', option);
				if(this.forceOpen) return;
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
		font-size: 18px;


		> .selected {
			height:44px;
			box-shadow:var(--soft-shadow);
			background:var(--content-bg);
			border-radius:var(--radius);
			display:flex;
			align-items: center;
			position: relative;
			cursor: pointer;
			z-index:2;
			padding-right:30px;


			> .chevron {
				position:absolute;
				right:5px;
				padding:20px 10px;
				margin-top:1px;
				border-radius:var(--radius);
				color:var(--text-primary);
				font-size: 14px;
			}

			.option {
				font-weight: bold;
			}

		}

		> .options {
			position:absolute;
			background:var(--content-bg);
			border-radius:var(--radius);
			top:50px;
			z-index:2;
			left:0;
			right:0;
			box-shadow:var(--soft-shadow);
			overflow: hidden;
			overflow-y: auto;
			max-height:260px;
			min-width:300px;
			text-align: left;

			&.at-top {
				top:5px;
			}
		}

		.option {
			display:flex;
			padding:8px 10px 8px 15px;
			cursor: pointer;
			color:var(--text-primary);
			align-items: center;

			i {
				margin-right:10px;
			}

			&:not(.active){
				&:hover {
					background:var(--highlight);
					color:#fff;
				}
			}

			&.selected {
				background:var(--highlight-opaque);
			}
		}

		&.transparent {

			> .selected {
				box-shadow:none;
				background:transparent;
			}

		}
	}
</style>
