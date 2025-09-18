import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // ✅ REQUIRED: Separate async operations object
  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (error) {
          if (error?.code !== 'PGRST116') { // Not found error is acceptable
            console.error('Profile load error:', error?.message)
          }
          return
        }
        setUserProfile(data)
      } catch (error) {
        console.error('Profile load error:', error?.message)
      } finally {
        setProfileLoading(false)
      }
    },
    
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }

  // ✅ REQUIRED: Protected auth handlers
  const authStateHandlers = {
    // CRITICAL: This MUST remain synchronous
    onChange: (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id) // Fire-and-forget
      } else {
        profileOperations?.clear()
      }
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) {
        throw new Error(error?.message || 'Sign up failed')
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message || 'Sign up failed' }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw new Error(error?.message || 'Sign in failed')
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message || 'Sign in failed' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      
      if (error) {
        throw new Error(error?.message || 'Sign out failed')
      }
      
      return { error: null }
    } catch (error) {
      return { error: error?.message || 'Sign out failed' }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email)
      
      if (error) {
        throw new Error(error?.message || 'Password reset failed')
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message || 'Password reset failed' }
    }
  }

  useEffect(() => {
    // Get initial session
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      authStateHandlers?.onChange(null, session)
    })

    // PROTECTED: Never modify this callback signature
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    ) || { data: { subscription: null } }

    return () => subscription?.unsubscribe?.()
  }, [])

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}