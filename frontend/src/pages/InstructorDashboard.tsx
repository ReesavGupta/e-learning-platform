import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getAllCourses } from '../api/courseApi'

const InstructorDashboard: React.FC = () => {
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery('instructorCourses', () => getAllCourses())

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading courses</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
      <Link
        to="/instructor/courses/create"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 inline-block"
      >
        Create New Course
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <div
            key={course.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex justify-between">
              <Link
                to={`/instructor/courses/${course.id}/edit`}
                className="text-blue-600 hover:underline"
              >
                Edit Course
              </Link>
              <Link
                to={`/instructor/courses/${course.id}/progress`}
                className="text-green-600 hover:underline"
              >
                View Progress
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstructorDashboard
