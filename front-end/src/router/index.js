import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{ path: '/', name: 'Landing', component: () => import('../views/Landing.vue') },
	{ path: '/profile/:user', name: 'Profile', component: () => import('../views/Profile.vue') },
	{ path: '/content/:id', name: 'Content', component: () => import('../views/Content.vue') },
	{ path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
	{ path: '/explore', name: 'Explore', component: () => import('../views/Explore.vue') },
	{ path: '/bookmarks', name: 'Bookmarks', component: () => import('../views/Bookmarks.vue') },
	{ path: '/test', name: 'Test', component: () => import('../views/Test.vue') },
	{ path: '*', name: '404', component: () => import('../views/404.vue') },
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	async scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			await new Promise(r => setTimeout(r, 100))
			return { x: 0, y: 0 };
		}
	}
})

export default router
