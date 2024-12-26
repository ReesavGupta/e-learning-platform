import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { signUp } from '../api/userApi'
import { useAuth } from '../contexts/AuthContext'

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'instructor' | 'student'>('student')
  const navigate = useNavigate()
  const { login } = useAuth()

  const mutation = useMutation(signUp, {
    onSuccess: (data) => {
      login(data)
      navigate('/courses')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ name, email, password, role })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="role"
            className="block mb-1"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as 'instructor' | 'student')
            }
            className="w-full px-3 py-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
      {mutation.isError && (
        <p className="text-red-500 mt-4">Error: {mutation.error.message}</p>
      )}
    </div>
  )
}

export default RegisterPage
