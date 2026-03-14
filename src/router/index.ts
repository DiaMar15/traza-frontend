import { createRouter, createWebHistory } from "vue-router"

import DashboardView from "@/views/DashboardView.vue"
import RutasView from "@/views/RutasView.vue"
import CrearRutaView from "@/views/CrearRutaView.vue"
import UsuariosView from "@/views/UsuariosView.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [

    {
      path: "/",
      component: DashboardView
    },

    {
      path: "/rutas",
      component: RutasView
    },

    {
      path: "/crearrutas",
      component: CrearRutaView
    },

    {
      path: "/usuarios",
      component: UsuariosView
    }

  ]
})

export default router