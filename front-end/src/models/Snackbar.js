const store = require('../store/index').default;

class Snackbar {

	constructor(text, timeout = 3200, type = 0){
		this.id = Math.round(Math.random()*999999999);
		this.text = text;
		this.timeout = timeout;
		this.type = type;
	}

	open(){
		store.dispatch('setSnackbar', this);
	}

	close(){
		store.dispatch('removeSnackbar', this);
	}

	static error(text, timeout = 3200){
		const snackbar = new Snackbar(text, timeout, 1);
		snackbar.open();
		return snackbar;
	}

	static notify(text, timeout = 3200){
		const snackbar = new Snackbar(text, timeout, 0);
		snackbar.open();
		return snackbar;
	}

}

module.exports = {Snackbar};
