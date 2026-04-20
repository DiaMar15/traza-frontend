import { createRouter, createWebHistory } from "vue-router"
import { authSetStore } from "@/stores/AuthStore"

// Layouts
import WireframeLayout from "@/Layouts/WireframeLayout.vue"
import AuthLayout from "@/Layouts/AuthLayout.vue"

// Views
import DashboardView from "@/views/DashboardView.vue"
import RutasView from "@/views/RutasView.vue"
import CrearRutaView from "@/views/CrearRutaView.vue"
import UsuariosView from "@/views/UsuariosView.vue"
import LoginView from "@/views/LoginView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [

    // 🔁 raíz → login
    {
      path: '/',
      redirect: '/auth/login'
    },

    // 🔓 AUTH (SIN SIDEBAR)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', component: LoginView },
        { path: 'register', component: () => import('@/views/RegisterView.vue') },
        { path: 'forgot-password', component: () => import('@/views/ForgotPasswordView.vue') },
        { path: 'reset-password', component: () => import('@/views/ResetPasswordView.vue') }
      ]
    },

    // 🔐 APP (CON SIDEBAR)
    {
      path: '/app',
      component: WireframeLayout,
      meta: { requiresAuth: true },
      children: [
        { path: 'dashboard', component: DashboardView },
        { path: 'rutas', component: RutasView },
        { path: 'crearrutas', component: CrearRutaView },
        { path: 'usuarios', component: UsuariosView },
        { path: 'vehiculos', component: () => import('@/views/VehiculosView.vue') }
      ]
    }
  ]
})

// 🔐 GUARD
router.beforeEach((to, from, next) => {
  const auth = authSetStore()

  if (to.matched.some(r => r.meta.requiresAuth) && !auth.isAuthenticated()) {
    return next('/auth/login')
  }

  if (to.path.startsWith('/auth') && auth.isAuthenticated()) {
    return next('/app/dashboard')
  }

  next()
})

export default router