import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const mockContent = require('../data/mock_contents').default;

console.log('mockContent', mockContent);

export default new Vuex.Store({
	state: {
		theme:'light',
		popups:[],

		user:null,
		contents:mockContent,

	},
	mutations: {
		setTheme:(state, x) => state.theme = x,
		addPopup:(state, x) => state.popups.unshift(x),
		removePopup:(state, x) => state.popups = state.popups.filter(y => y.id !== x.id),
	},
	actions: {
		setTheme:(context, x) => context.commit('setTheme', x),
		addPopup:(context, x) => context.commit('addPopup', x),
		removePopup:(context, x) => context.commit('removePopup', x),
	},
	modules: {

	}
})
