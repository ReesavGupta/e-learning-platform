import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getAllCourses } from '../api/courseApi'
import { User } from '../types'
import { getProfile } from '../api/userApi'
import AddCourseForm from '../components/AddCourseForm'

const InstructorDashboard: React.FC = () => {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery('instructorCourses', () => getAllCourses())

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getProfile()
      setUser(res)
      console.log('Fetched user:', res)
    }
    fetchUser()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading courses</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      {user?._id && <AddCourseForm instructor={user._id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses
          ?.filter((eachCourse) => eachCourse?.instructor?._id === user?._id)
          .map((userCourses) => (
            <div
              key={userCourses._id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {userCourses.title}
              </h2>
              <p className="text-gray-600 mb-4">{userCourses.description}</p>
              <div className="flex justify-between gap-2">
                <Link
                  to={`/instructor/courses/${userCourses._id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit Course
                </Link>

                <Link
                  to={`/courses/${userCourses._id}`}
                  className="text-green-600 hover:underline"
                >
                  Add Lessons
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default InstructorDashboard
