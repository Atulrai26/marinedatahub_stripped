import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organization: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
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

  const validateForm = () => {
    if (!formData?.email || !formData?.password || !formData?.confirmPassword || !formData?.fullName) {
      return 'Please fill in all required fields'
    }

    if (formData?.password !== formData?.confirmPassword) {
      return 'Passwords do not match'
    }

    if (formData?.password?.length < 6) {
      return 'Password must be at least 6 characters long'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex?.test(formData?.email)) {
      return 'Please enter a valid email address'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const userData = {
        full_name: formData?.fullName,
        organization: formData?.organization || null
      }

      const { error: signUpError } = await signUp(formData?.email, formData?.password, userData)
      
      if (signUpError) {
        setError(signUpError)
        return
      }
      
      // Redirect to login with success message
      navigate('/auth/login', { 
        state: { message: 'Account created successfully! Please sign in.' }
      })
    } catch (error) {
      setError(error?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData?.fullName || ''}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address *
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
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <Input
                id="organization"
                name="organization"
                type="text"
                autoComplete="organization"
                value={formData?.organization || ''}
                onChange={handleChange}
                placeholder="Enter your organization (optional)"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData?.password || ''}
                onChange={handleChange}
                placeholder="Enter your password (min. 6 characters)"
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData?.confirmPassword || ''}
                onChange={handleChange}
                placeholder="Confirm your password"
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
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}

export default Signup