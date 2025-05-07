'use client'

import { useState } from 'react'
import { User, Mail, Lock, Shield } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client', // default role
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        alert('User registered successfully!')
        setForm({ name: '', email: '', password: '', role: 'client' })
      } else {
        alert(data.error || 'Failed to register.')
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-400 to-green-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-green-700">Register</h1>

        <div className="relative">
          <User className="absolute left-3 top-3 text-green-500" />
          <input
            name="name"
            type="text"
            required
            placeholder="Name"
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            value={form.name}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-green-500" />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            value={form.email}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-green-500" />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            value={form.password}
          />
        </div>

        <div className="relative">
          <Shield className="absolute left-3 top-3 text-green-500" />
          <select
            name="role"
            required
            className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            value={form.role}
          >
               <option value="admin">Admin</option>
            <option value="client">Client</option>
            <option value="sales">Sales Personnel</option>
            <option value="finance">Finance Personnel</option>
            <option value="developer">Developer</option>
            <option value="investor">Investor</option>
            <option value="partner">Partner</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Register
        </button>
        
      </form>
    </div>
  )
}
