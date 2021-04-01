var SUFFIX = ["", "K", "M", "G", "T", "P", "E"];

function nFormatter(num, digits) {
	var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
		decimal;

	for(var i=units.length-1; i>=0; i--) {
		decimal = Math.pow(1000, i+1);

		if(num <= -decimal || num >= decimal) {
			return +(num / decimal).toFixed(digits) + units[i];
		}
	}

	return num;
}

const formatDecimals = (n,d) => parseFloat(n).toFixed(d);

export default (num, fixed) => {
	num = parseFloat(num);
	if(num < 999) return num;

	if (num === null) { return null; } // terminate early
	if (num === 0) { return '0'; } // terminate early
	fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
	var b = (num).toPrecision(2).split("e"), // get power
		k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
		c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), // divide by power
		d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
		e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
	return e;
}
