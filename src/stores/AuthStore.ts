import router from '@/router'
import AuthService from '@/services/AuthService'
import { defineStore } from 'pinia'

export const authSetStore = defineStore('auth', {
  state: () => ({
    user: (() => {
      try {
        return JSON.parse(sessionStorage.getItem('user') || 'null')
      } catch {
        return null
      }
    })(),
    token: sessionStorage.getItem('token') || null,
  }),

  actions: {

    async login(userData: { correo: string, password: string }) {
      try {
        const auth = new AuthService()

        const login = await auth.login(userData.correo, userData.password)

        const token = login.token

        if (!token) {
          throw new Error('Token no recibido')
        }

        this.token = token
        sessionStorage.setItem('token', token)

        const user = await auth.getProfile(token)

        this.user = user
        sessionStorage.setItem('user', JSON.stringify(user))

        router.push('/app/dashboard')

      } catch (error: any) {
        alert(error?.message || 'Error al iniciar sesión')
      }
    },

    isAuthenticated(): boolean {
      return !!this.token
    },

    logout() {
      this.token = null
      this.user = null

      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')

      router.push('/auth/login')
    }
  }
})