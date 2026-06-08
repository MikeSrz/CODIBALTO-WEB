import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/LoginView.vue'
import Registro from '@/views/RegistroView.vue'
import PasswordVault from '@/views/PasswordVault.vue'
import { useAuthStore } from '@/stores/auth.ts'
import Info from '@/views/Info.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [ 
    {path: '/home', component: Home},
    {path: '/login', component: Login},
    {path: '/registro', component:Registro},
    {path: '/password-vault', component: PasswordVault, meta: {requiresAuth:true}},
    {path: '/info', component:Info},
    {path: '/:pathMatch(.*)*', redirect: '/home'}
  ],
})

//interceptor de nagevacion
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {path: '/login', query: {redirect: to.fullPath}}
  }
})
export default router
