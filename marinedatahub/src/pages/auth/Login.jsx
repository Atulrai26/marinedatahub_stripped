import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e?.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!formData?.email || !formData?.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await signIn(formData?.email, formData?.password)
      
      if (signInError) {
        setError(signInError)
        return
      }
      
      // Redirect to dashboard on successful login
      navigate('/dashboard')
    } catch (error) {
      setError(error?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password })
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData?.email || ''}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData?.password || ''}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Demo Credentials</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Admin: admin@marine.com</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fillDemoCredentials('admin@marine.com', 'admin123')}
                className="text-xs px-2 py-1 h-auto border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                Use
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Researcher: researcher@marine.com</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fillDemoCredentials('researcher@marine.com', 'researcher123')}
                className="text-xs px-2 py-1 h-auto border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                Use
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login