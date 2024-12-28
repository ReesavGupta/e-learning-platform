import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { getAllCourses } from '../api/courseApi'
import CourseCard from '../components/CourseCard'

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: courses, isLoading, error } = useQuery('courses', getAllCourses)

  const filteredCourses = courses?.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading courses</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Welcome to E-Learning Platform
      </h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses?.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage
