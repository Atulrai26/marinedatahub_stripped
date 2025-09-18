import { supabase } from '../lib/supabase';

export const authService = {
  async getCurrentUser() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession()
      
      if (error) {
        throw new Error(error?.message || 'Failed to get current user')
      }
      
      return { user: session?.user ?? null, error: null }
    } catch (error) {
      return { user: null, error: error?.message || 'Failed to get current user' }
    }
  },

  async getUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single()
      
      if (error) {
        if (error?.code === 'PGRST116') {
          return { profile: null, error: 'Profile not found' }
        }
        throw new Error(error?.message || 'Failed to get user profile')
      }
      
      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error: error?.message || 'Failed to get user profile' }
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(profileData)
        ?.eq('id', userId)
        ?.select()
        ?.single()
      
      if (error) {
        throw new Error(error?.message || 'Failed to update user profile')
      }
      
      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error: error?.message || 'Failed to update user profile' }
    }
  },

  async createUserProfile(userId, profileData) {
    try {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.insert({ id: userId, ...profileData })
        ?.select()
        ?.single()
      
      if (error) {
        throw new Error(error?.message || 'Failed to create user profile')
      }
      
      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error: error?.message || 'Failed to create user profile' }
    }
  },

  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider
      })
      
      if (error) {
        throw new Error(error?.message || `${provider} sign in failed`)
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error?.message || `${provider} sign in failed` }
    }
  }
}