import React from 'react'
import { Link } from 'react-router-dom'
import { Course } from '../types'

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold">${course.price}</span>
          <Link
            to={`/courses/${course.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
