import router from '@/router'
import AuthService from '@/services/AuthService'
import { defineStore } from 'pinia'

export const authSetStore = defineStore('auth', {
  state: () => ({
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem('user') || 'null')
      } catch {
        return null
      }
    })(),
    token: localStorage.getItem('token') || null,
  }),

  actions: {

    async login(userData: { correo: string, password: string }): Promise<void> {
      try {
        const auth = new AuthService()

        // 🔐 LOGIN
        const login = await auth.login(userData.correo, userData.password)

        // 🔥 TOKEN ADONIS 6
        const token = login.value

        if (!token) {
          throw new Error('Token no recibido')
        }

        this.token = token
        localStorage.setItem('token', token)

        // 👤 PROFILE
        const user = await auth.getProfile(token)

        this.user = user
        localStorage.setItem('user', JSON.stringify(user))

        router.push('/')

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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }
})