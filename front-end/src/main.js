import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import "./styles/styles.scss"


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

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
