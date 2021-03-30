import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueDatePicker from '@mathieustan/vue-datepicker';
import '@mathieustan/vue-datepicker/dist/vue-datepicker.min.css';
import formatNumber from './util/formatNumber'
import VTooltip from 'v-tooltip'
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import VueSimpleMarkdown from 'vue-simple-markdown'



Vue.use(VueDatePicker);
Vue.use(Buefy);
Vue.use(VTooltip);
Vue.use(VueSimpleMarkdown);

import './styles/markdown.scss'
import "./styles/styles.scss"



VTooltip.options.defaultClass = 'tooltip'
Vue.config.productionTip = false


Vue.component('Profile', () => import('./components/Profile.vue'));
Vue.component('SpreadBar', () => import('./components/SpreadBar.vue'));
Vue.component('Dropdown', () => import('./components/Dropdown.vue'));
Vue.component('DropdownInput', () => import('./components/DropdownInput.vue'));
Vue.component('DualInput', () => import('./components/DualInput.vue'));
Vue.component('Graph', () => import('./components/Graph.vue'));
Vue.component('Asset', () => import('./components/Asset.vue'));
Vue.component('Logo', () => import('./components/svgs/Logo.vue'));
Vue.component('Loader', () => import('./components/Loader.vue'));
Vue.component('Labels', () => import('./components/Labels.vue'));
Vue.component('PostComment', () => import('./components/PostComment.vue'));

Vue.mixin({
	methods: {
		formatNumber,
	},
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
