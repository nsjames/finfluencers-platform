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
		setUser:(state, x) => state.user = x,
		setContents:(state, x) => state.contents = x,
		appendContent:(state, x) => state.contents.push(x),
		prependContent:(state, x) => state.contents.unshift(x),
	},
	actions: {
		setTheme:(context, x) => context.commit('setTheme', x),
		addPopup:(context, x) => context.commit('addPopup', x),
		removePopup:(context, x) => context.commit('removePopup', x),
		setUser:(context, x) => context.commit('setUser', x),
		setContents:(context, x) => context.commit('setContents', x),
		appendContent:(context, x) => context.commit('appendContent', x),
		prependContent:(context, x) => context.commit('prependContent', x),
	},
	modules: {

	}
})
