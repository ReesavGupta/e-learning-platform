import React, { useEffect, useState } from 'react'
import { getProfile } from '../api/userApi'
import { User } from '../types'
import { Link } from 'react-router-dom'

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile()
        setUser(profileData)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      {user ? (
        <>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Id:</h2>
              <p>{user._id}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium">Name:</h2>
              <p>{user.username}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium">Email:</h2>
              <p>{user.email}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium">Role:</h2>
              <p className="capitalize">{user.role}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium">Joined:</h2>
              <p>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div>
            {user.role === 'instructor' && (
              <div>
                <Link to={`/instructor/dashboard`}>Go to Your Dashboard</Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No user data available</p>
      )}
    </div>
  )
}

export default ProfilePage
