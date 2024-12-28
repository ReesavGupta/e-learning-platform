import { User } from '../types'

const API_URL = 'http://localhost:3000/api/users'

export const signUp = async (userData: {
  name: string
  email: string
  password: string
  role: 'instructor' | 'student'
}): Promise<User> => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    }),
    credentials: 'include', // This tells fetch to include cookies
  })

  if (!response.ok) {
    throw new Error('Failed to sign up' + console.error(response))
  }

  return response.json()
}

export const signIn = async (credentials: {
  email: string
  password: string
}): Promise<User> => {
  const response = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // This tells fetch to include cookies
  })

  if (!response.ok) {
    throw new Error('Failed to sign in')
  }

  return response.json()
}

export const signOut = async (): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}/signout`, {
    method: 'GET',
    credentials: 'include', // This tells fetch to include cookies
  })

  if (!response.ok) {
    throw new Error('Failed to sign out')
  }

  return response.json()
}

export const getProfile = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    credentials: 'include', // This tells fetch to include cookies
  })

  if (!response.ok) {
    throw new Error('Failed to get profile')
  }

  return response.json()
}
