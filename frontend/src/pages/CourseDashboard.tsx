import React from 'react'
import { useQuery } from 'react-query'
import { getCourses } from '../api/courseApi'
import { useAuth } from '../contexts/AuthContext'
import CourseCard from '../components/CourseCard'
import AddCourseForm from '../components/AddCourseForm'

const CourseDashboard: React.FC = () => {
  const { user } = useAuth()
  const { data: courses, isLoading, error } = useQuery('courses', getCourses)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading courses</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Dashboard</h1>
      {user?.role === 'instructor' && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
          <AddCourseForm />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseDashboard
