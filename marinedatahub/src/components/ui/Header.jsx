import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, userProfile, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location?.pathname === path

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/auth/login')
    }
    setIsUserMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', auth: true },
    { name: 'Data Ingestion', path: '/data-ingestion', auth: true },
    { name: 'Data Analysis', path: '/data-analysis', auth: true },
    { name: 'Oceanographic Mapping', path: '/oceanographic-mapping', auth: true },
    { name: 'Species Identification', path: '/species-identification', auth: true },
    { name: 'Data Export', path: '/data-export', auth: true }
  ]

  const publicItems = navigationItems?.filter(item => !item?.auth)
  const protectedItems = navigationItems?.filter(item => item?.auth)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MD</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">Marine Data Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Public navigation items */}
            {publicItems?.map(item => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item?.path) 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-4' :'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item?.name}
              </Link>
            ))}

            {/* Protected navigation items - show for authenticated users */}
            {user && protectedItems?.map(item => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item?.path) 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-4' :'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item?.name}
              </Link>
            ))}

            {/* Preview mode indicators for unauthenticated users */}
            {!user && protectedItems?.map(item => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive(item?.path) 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-4' :'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{item?.name}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">Preview</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                  </span>
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      {user?.email}
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link to="/auth/signup">
                  <Button size="sm" className="text-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Public mobile navigation */}
            {publicItems?.map(item => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  isActive(item?.path) 
                    ? 'text-blue-600 bg-blue-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item?.name}
              </Link>
            ))}

            {/* Protected mobile navigation */}
            {protectedItems?.map(item => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`block px-3 py-2 text-base font-medium transition-colors flex items-center justify-between ${
                  isActive(item?.path) 
                    ? 'text-blue-600 bg-blue-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item?.name}</span>
                {!user && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">Preview</span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile auth section */}
          <div className="px-2 py-3 border-t border-gray-200 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center space-x-2 px-3 py-2">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link
                  to="/auth/login"
                  className="text-center py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside handler for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default Header