import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex?.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: resetError } = await resetPassword(email)
      
      if (resetError) {
        setError(resetError)
        return
      }
      
      setSuccess('Password reset email sent! Please check your inbox and follow the instructions.')
    } catch (error) {
      setError(error?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setEmail(e?.target?.value)
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={loading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send reset email'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <Link
              to="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors block"
            >
              Back to sign in
            </Link>
            <Link
              to="/auth/signup"
              className="text-sm text-gray-600 hover:text-gray-500 transition-colors block"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword