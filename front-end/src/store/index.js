import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let dummyPortfolioData = [1,2,3,2,3,2,3,4,4,4,3,4,5,4,3,4,4,4,4,3].map((x,i) => x+20 + (x*i));

export default new Vuex.Store({
	state: {
		theme:'light',
		popups:[],
		snackbars:[],

		user:null,
		contents:[],
		content:null,
		comments:[],
	},
	mutations: {
		setTheme:(state, x) => state.theme = x,
		addPopup:(state, x) => state.popups.unshift(x),
		removePopup:(state, x) => state.popups = state.popups.filter(y => y.id !== x.id),
		setUser:(state, x) => state.user = x,
		setContents:(state, x) => state.contents = x,
		appendContent:(state, x) => state.contents.push(x),
		prependContent:(state, x) => state.contents.unshift(x),
		setSnackbar:(state, x) => state.snackbars.push(x),
		removeSnackbar:(state, x) => state.snackbars = state.snackbars.filter(y => y.id !== x.id),
		setContent:(state, x) => state.content = x,
		setComments:(state, x) => state.comments = x,
	},
	actions: {
		setTheme:(context, x) => context.commit('setTheme', x),
		addPopup:(context, x) => context.commit('addPopup', x),
		removePopup:(context, x) => context.commit('removePopup', x),
		setUser:(context, x) => context.commit('setUser', x),
		setContents:(context, x) => context.commit('setContents', x),
		appendContent:(context, x) => context.commit('appendContent', x),
		prependContent:(context, x) => context.commit('prependContent', x),
		setSnackbar:(context, x) => {
			context.commit('setSnackbar', x);
			setTimeout(() => {
				context.commit('removeSnackbar', x);
			}, x.timeout);
		},
		removeSnackbar:(context, x) => context.commit('removeSnackbar', x),
		setContent:(context, x) => context.commit('setContent', x),
		setComments:(context, x) => context.commit('setComments', x),
	},
	getters: {
		userPortfolioGraphData:state => state.user ? dummyPortfolioData /* TODO */ : null,
	},
	modules: {

	}
})
