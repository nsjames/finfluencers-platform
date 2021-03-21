<template>
	<section class="dashboard">
		<h1><b style="font-weight: 800;">CTRL</b></h1>
		<p>Last refreshed on <b>{{new Date(last_refreshed).toUTCString()}}</b></p>

		<figure class="spacer"></figure>

		<section class="tables" v-if="stats">
			<section>
				<p>Total Validators</p>
				<h2>{{stats.totalValidators}}</h2>
			</section>
			<section>
				<p>Active Validators</p>
				<h2>{{stats.activeValidators}}</h2>
			</section>
			<section>
				<p>Customers</p>
				<h2>{{stats.totalCustomers}}</h2>
			</section>
			<section>
				<p>Current Invoice</p>
				<h2>${{stats.earningsThisMonth}}</h2>
			</section>
			<section>
				<p>Total Invoiced</p>
				<h2>${{stats.totalEarnings}}</h2>
			</section>
		</section>

	</section>
</template>

<script>
	let interval;
	export default {
		data(){return {
			stats:null,
			last_refreshed:0
		}},
		mounted(){
			this.fillData();
		},
		destroyed(){
			clearInterval(interval);
		},
		methods:{
			fillData(){
				clearInterval(interval);
				interval = setInterval(async () => {
					this.stats = await fetch('http://localhost:40406/admin/stats').then(x => x.json()).then(x => x.data).catch(() => null);
					this.last_refreshed = +new Date();
				}, 1000);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../styles/variables";

	.dashboard {
		padding:50px;
		max-width:1280px;
		margin:0 auto;

		.tables {
			display:flex;
			justify-content: center;
			flex-wrap: wrap;

			section {
				padding:20px;
				border-radius:6px;
				border:2px solid rgba(0,0,0,0.2);
				margin:10px;
				min-width:calc(33.3% - 20px);
				min-height:150px;
				display:flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
			}
		}
	}
</style>
