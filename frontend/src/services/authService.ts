import axiosInstance from '@/utils/axiosInstance'
import type { LoginPayload, SignupPayload } from '@/types/auth'

export const login = async (payload: LoginPayload): Promise<any> => {
  try {
    const response = await axiosInstance.post('/login', payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export const register = async (payload: SignupPayload): Promise<any> => {
  try {
    const response = await axiosInstance.post('/register', payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export const loginGoogle = (token: string) => {
  return axiosInstance.post('/google', { token })
}

export const profile = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/profile')
    return response.data
  } catch (error) {
    throw error
  }
}
