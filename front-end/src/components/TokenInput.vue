<template>
	<section class="token-input">
		<DualInput
				:value-b="assetSearch" :placeholder-b="'ASSET'"
				:value-a="valuea" :placeholder-a="'$100.00'"
				v-on:changedb="x => assetSearch = x"
				v-on:changeda="x => $emit('valuea', x)"
				v-on:focusedb="openOrCloseSelector"
		/>
		<section class="asset-list" v-if="openTokenSelector">
			<Dropdown :options-only="true" :force-open="true" :options="formattedTokenOptions" v-on:selected="selectedAsset" />
		</section>
	</section>
</template>

<script>
	import * as ApiService from "../services/ApiService";
	import {USD_ID} from '@finfluencers/shared/models/TokenIds'

	let findTokensTimeout;
	export default {
		props:['valuea', 'allowDollar'],
		name: "TokenInput",
		data(){return {
			openTokenSelector:false,
			tokenOptions:[],
			assetSearch:'',
			dontSearch:false,
		}},
		computed:{
			formattedTokenOptions(){
				if(!this.tokenOptions.length && this.assetSearch.length) return ['Please wait'];
				return this.tokenOptions.map(x => {
					const suffix = x.symbol ? `(${x.symbol})` : '';
					return {
						id:x.id,
						text:`${x.name} ${suffix}`,
					}
				})
			}
		},
		methods:{
			openOrCloseSelector(bool){
				if(bool) this.openTokenSelector = true;
				else {
					setTimeout(() => this.openTokenSelector = false, 200);
				}
			},
			selectedAsset(asset){
				if(!asset) return;
				console.log('selected asset', asset);
				asset = this.tokenOptions.find(x => x.id === asset.id);
				if(!asset) return;
				this.$emit('asset', asset);
				this.dontSearch = true;
				this.assetSearch = asset.symbol;
				this.$nextTick(() => {
					this.dontSearch = false;
				});
			},
			async findTokens(){
				this.tokenOptions = [];
				if(!this.assetSearch.length) return;
				const found = await ApiService.searchAssets(this.assetSearch);
				if(this.allowDollar && 'USD'.indexOf(this.assetSearch) > -1 || this.assetSearch === '$') found.unshift({
					id:USD_ID,
					name:'United States Dollar',
					symbol:'USD',
				})
				console.log('found', found);
				if(found.length) this.tokenOptions = found;
				else this.tokenOptions = [{id:-1, name:'No tokens found'}];
				this.openTokenSelector = true;
			},
		},
		watch:{
			['assetSearch'](){
				if(this.dontSearch) return;
				clearTimeout(findTokensTimeout);
				findTokensTimeout = setTimeout(this.findTokens, 800);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.token-input {
		flex:1;
		position: relative;

		.asset-list {
			position: absolute;
			top:60px;
			right:0;
			left:0;

			.dropdown {
				width:100%;
			}
		}
	}
</style>
