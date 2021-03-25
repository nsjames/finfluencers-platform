var SUFFIX = ["", "K", "M", "G", "T", "P", "E"];

export default (n) => {
	if(isNaN(n)) return n;

	const decimals = (x => x ? x.length : 0)(n.toString().split('.')[1]);
	n = parseFloat(n);

	if(n < 10000) return n.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	const tier = Math.log10(Math.abs(n)) / 3 | 0;
	if(tier === 0) return n;

	return (n / Math.pow(10, tier * 3)).toFixed(decimals) + SUFFIX[tier];
}
