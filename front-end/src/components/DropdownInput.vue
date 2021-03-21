<template>
	<section class="dropdown-input">
		<figure class="bg"></figure>
		<Dropdown :transparent="true" :options="options" :is-images="isImages" :selected="selected" v-on:selected="x => $emit('selected', x)" />
		<input :placeholder="placeholder" v-model="inputValue" />
	</section>
</template>

<script>
	export default {
		props:['isImages', 'options', 'selected', 'placeholder', 'value'],
		name: "DropdownInput",
		data(){return {
			inputValue:'',
			changingInput:false,
		}},
		watch:{
			'inputValue'(){
				if(this.changingInput) return;
				this.$emit('changed', this.inputValue);
			},
			'value'(){
				this.changingInput = true;
				this.inputValue = this.value;
				this.changingInput = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dropdown-input {
		display:flex;
		border-radius:var(--radius);
		background:transparent;
		box-shadow:var(--soft-shadow);
		position: relative;

		transition:all 0.5s ease;
		transition-property: background, box-shadow;

		> .bg {
			position: absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			border-radius:var(--radius);
			z-index:-1;
		}

		.dropdown {
			flex:0 0 auto;
			position: relative;
			z-index:1;
		}

		input {
			text-align:right;
			padding:0 20px;
			flex:1;
			outline:0;
			border:0;
			background:transparent;
			font-family: var(--secondary-font);
			font-size: 20px;
			color:var(--text-primary);
		}
	}
</style>
