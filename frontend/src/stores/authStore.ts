import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService } from '@/services/authService'
import { register as registerService } from '@/services/authService'
import type { LoginPayload, SignupPayload } from '@/types/auth'
import { useLoadingStore } from '@/stores/Common/loadingStore'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const email = ref<string>('')
  const password = ref<string>('')
  const confirmPassword = ref<string>('')
  const fullName = ref<string>('')
  const token = ref<string>(localStorage.getItem('user-token') || '')
  const userInfo = ref<any>(JSON.parse(localStorage.getItem('user-info') || '{}'))
  const error = ref<string>('')

  const isLoggedIn = computed(() => !!token.value)
  const getUsername = computed(() => userInfo.value?.full_name || '')

  async function login() {
    const loadingStore = useLoadingStore()
    error.value = ''

    try {
      loadingStore.startLoading()

      const payload: LoginPayload = {
        email: email.value,
        password: password.value,
      }

      const response = await loginService(payload)

      token.value = response.data.token
      userInfo.value = response.data.user || {}

      localStorage.setItem('user-token', token.value)
      localStorage.setItem('user-info', JSON.stringify(userInfo.value))

      resetForm()

      return { success: true }
    } catch (err: any) {
      error.value = 'Tài khoản hoặc mật khẩu không đúng'
      return { success: false, error: error.value }
    } finally {
      loadingStore.finishLoading()
    }
  }

  async function register() {
    const loadingStore = useLoadingStore()
    error.value = ''

    if (password.value !== confirmPassword.value) {
      error.value = 'Mật khẩu không khớp'
      return { success: false, error: error.value }
    }

    try {
      loadingStore.startLoading()

      const payload: SignupPayload = {
        full_name: fullName.value,
        email: email.value,
        password: password.value,
      }

      const response = await registerService(payload)

      token.value = response.data.token
      userInfo.value = response.data.user || {}

      localStorage.setItem('user-token', token.value)
      localStorage.setItem('user-info', JSON.stringify(userInfo.value))

      resetForm()

      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message
      if (error.value === 'Email is already in use') {
        error.value = 'Email đã tồn tại. Vui lòng sử dụng email khác'
      }
      return { success: false, error: error.value }
    } finally {
      loadingStore.finishLoading()
    }
  }

  function resetForm() {
    email.value = ''
    password.value = ''
    error.value = ''
  }

  function logout() {
    token.value = ''
    userInfo.value = {}

    localStorage.removeItem('user-token')
    localStorage.removeItem('user-info')

    router.push('/login')
  }

  return {
    email,
    password,
    confirmPassword,
    fullName,
    token,
    userInfo,
    error,
    isLoggedIn,
    getUsername,
    login,
    logout,
    resetForm,
    register,
  }
})
