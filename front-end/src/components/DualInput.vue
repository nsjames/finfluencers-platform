<template>
	<section class="dual-input">
		<figure class="bg"></figure>
		<input :type="typeA || 'text'" @focus="$emit('focuseda', true)" @blur="$emit('focuseda', false)" :placeholder="placeholderA" v-model="inputValueA" />
		<input :type="typeB || 'text'" @focus="$emit('focusedb', true)" @blur="$emit('focusedb', false)" :placeholder="placeholderB" v-model="inputValueB" />
	</section>
</template>

<script>
	export default {
		props:['placeholderA', 'valueA', "placeholderB", "valueB", 'typeA', 'typeB'],
		name: "DualInput",
		data(){return {
			inputValueA:'',
			inputValueB:'',
			changingInput:false,
		}},
		mounted(){
			this.changingInput = true;
			this.inputValueA = this.valueA;
			this.inputValueB = this.valueB;
			this.changingInput = false;
		},
		watch:{
			'inputValueA'(){
				if(this.changingInput) return;
				this.$emit('changeda', this.inputValueA);
			},
			'valueA'(){
				this.changingInput = true;
				this.inputValueA = this.valueA;
				this.changingInput = false;
			},
			'inputValueB'(){
				if(this.changingInput) return;
				this.$emit('changedb', this.inputValueB);
			},
			'valueB'(){
				this.changingInput = true;
				this.inputValueB = this.valueB;
				this.changingInput = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dual-input {
		display:flex;
		border-radius:var(--radius);
		background:transparent;
		position: relative;
		height:60px;
		background:var(--background-color);
		border:1px solid var(--light-line);


		> .bg {
			position: absolute;
			top:0;
			bottom:0;
			left:0;
			right:0;
			border-radius:var(--radius);
			z-index:-1;

			transition:box-shadow 0.5s ease;
		}

		.dropdown {
			flex:0 0 auto;
			position: relative;
			z-index:1;
		}

		input {
			width:100%;
			padding:0 20px;
			flex:1;
			outline:0;
			background:transparent;
			font-family: var(--secondary-font);
			font-size: 20px;
			color:var(--text-primary);
			border-radius:var(--radius);
			transition:border 0.2s ease;
			border:1px solid transparent;

			&:first-child {
				text-align:left;
			}

			&:last-child {
				text-align:right;
			}


			&:focus {
				border:1px solid var(--highlight);
			}
		}
	}

	.light {
		.dual-input {
			//background:var(--background-color);
		}
	}
</style>
