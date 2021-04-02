import store from '../store'

export default class Popup {

	constructor(type, data = null){
		this.id = Math.round(Math.random() * 1000000000);
		this.type = type;
		this.data = data;
	}

	open(){
		return store.dispatch('addPopup', this);
	}

	close(){
		if(this.data && this.data.resolve) this.data.resolve();
		return store.dispatch('removePopup', this);
	}

}

export const Popups = {
	LOGIN:'login',
}
