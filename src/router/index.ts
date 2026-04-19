import { createRouter, createWebHistory } from "vue-router"
import { authSetStore } from "@/stores/AuthStore"

import DashboardView from "@/views/DashboardView.vue"
import RutasView from "@/views/RutasView.vue"
import CrearRutaView from "@/views/CrearRutaView.vue"
import UsuariosView from "@/views/UsuariosView.vue"
import LoginView from "@/views/LoginView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [

    /*
    |--------------------------------------------------------------------------
    | 🔓 PUBLICAS
    |--------------------------------------------------------------------------
    */
    {
      path: "/login",
      component: LoginView
    },
    {
      path: "/register",
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: "/forgot-password",
      component: () => import('@/views/ForgotPasswordView.vue')
    },
    {
      path: "/reset-password",
      component: () => import('@/views/ResetPasswordView.vue')
    },

    /*
    |--------------------------------------------------------------------------
    | 🔐 PRIVADAS
    |--------------------------------------------------------------------------
    */
    {
      path: "/",
      component: DashboardView,
      meta: {
        requiresAuth: true,
        roles: ['admin', 'Auxiliar Logístico']
      }
    },

    {
      path: "/rutas",
      component: RutasView,
      meta: {
        requiresAuth: true,
        roles: ['admin', 'Auxiliar Logístico']
      }
    },

    {
      path: "/crearrutas",
      component: CrearRutaView,
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },

    {
      path: "/usuarios",
      component: UsuariosView,
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },

    {
      path: "/vehiculos",
      component: () => import('@/views/VehiculosView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin', 'Auxiliar de Bodega']
      }
    }
  ]
})

/*
|--------------------------------------------------------------------------
| 🔐 GUARD GLOBAL (AUTH + ROLES)
|--------------------------------------------------------------------------
*/
router.beforeEach((to, from, next) => {
  const auth = authSetStore()

  const isAuth = auth.isAuthenticated()
  const user = auth.user

  const requiresAuth = (to.meta as any).requiresAuth
  const roles = (to.meta as any).roles as string[] | undefined

  // 🔐 requiere login
  if (requiresAuth && !isAuth) {
    return next('/login')
  }

  // 🚫 evitar volver al login
  if (to.path === '/login' && isAuth) {
    return next('/')
  }

  // 👥 validar roles
  if (roles && user) {

    const userRoles = user.roles?.map((r: any) => r.nombre) || []

    const hasRole = roles.some((role) =>
      userRoles.includes(role)
    )

    if (!hasRole) {
      alert('No tienes permisos para acceder')
      return next('/')
    }
  }

  next()
})

export default router