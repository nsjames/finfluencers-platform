<template>
	<section class="post-portfolio">
		<ContentPortfolio :portfolio="content.data" :details="formattedSelectedOptions" />

		<section style="margin-top:30px;">
			<label>Pick your stats</label>
			<section class="stats">
				<Dropdown :key="`stat_option_${i}`"
				          v-for="i in [0,1,2]" class="picker"
				          :options="remainingOptions"
				          :selected="optionToText(selectedOptions[i])"
				          v-on:selected="x => selectOption(i, x)" />
			</section>
		</section>
	</section>
</template>

<script>
	import {PORTFOLIO_OPTIONS, portfolioOptionToText} from '@finfluencers/shared/models/ContentData.model';
	import {mapState} from "vuex";

	export default {
		props:['content'],
		data(){return {
			selectedOptions:[0,0,0],
		}},
		components:{
			ContentPortfolio:async () => import('../ContentPortfolio')
		},
		computed:{
			...mapState([
				'user',
			]),
			remainingOptions(){
				return Object.keys(PORTFOLIO_OPTIONS).map(key => {
					return {
						id:PORTFOLIO_OPTIONS[key],
						text:this.optionToText(PORTFOLIO_OPTIONS[key])
					}
				}).filter(x => x.id === 0 || !this.selectedOptions.includes(x.id));
			},
			formattedSelectedOptions(){
				return this.selectedOptions.map(option => {
					if(option === 0) return null;
					let value;
					switch(option){
						// TODO:
						case 1: value = '$1.2m'; break;
						case 2: value = '$480k'; break;
					}

					return [this.optionToText(option), value]
				}).filter(x => !!x);
			}
		},
		methods:{
			selectOption(index, option){
				this.selectedOptions[index] = option.id;
				this.selectedOptions.push(0);
				this.selectedOptions.pop();
				this.content.data.options = this.selectedOptions;
			},
			optionToText:portfolioOptionToText,
		}
	}
</script>

<style lang="scss" scoped>
	.post-portfolio {
		text-align:left;

		label {
			font-size: 14px;
			font-weight: bold;
			color:var(--text-primary);
			margin-bottom:10px;
			display: block;
		}

		.stats {
			display:flex;
			justify-content: space-between;

			.picker {
				width:calc(33.3% - 10px);
			}
		}
	}
</style>
