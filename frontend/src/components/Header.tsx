import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold"
        >
          E-Learning Platform
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/"
                className="hover:text-blue-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="hover:text-blue-200"
              >
                Courses
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-blue-200"
                  >
                    Profile
                  </Link>
                </li>

                <li>
                  <button
                    onClick={logout}
                    className="hover:text-blue-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-blue-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-blue-200"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
