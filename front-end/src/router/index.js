import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{ path: '/', name: 'Landing', component: () => import('../views/Landing.vue') },
	{ path: '/profile/:user', name: 'Profile', component: () => import('../views/Profile.vue') },
	{ path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
	{ path: '/explore', name: 'Explore', component: () => import('../views/Explore.vue') },
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
})

export default router
