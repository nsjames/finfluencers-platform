import store from '../store'

export default class Popup {

	constructor(type, data = null){
		this.id = Math.round(Math.random() * 1000000000);
		this.type = type;
		this.data = data;
	}

	open(){
		store.dispatch('addPopup', this);
	}

	close(){
		store.dispatch('removePopup', this);
	}

}

export const Popups = {
	LOGIN:'login',
}
