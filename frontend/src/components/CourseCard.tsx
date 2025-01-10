import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Course, User } from '../types'
import { enrollStudentInCourse, getEnrolledCourses } from '../api/courseApi'

interface CourseCardProps {
  course: Course
  user: User | null
}

const CourseCard: React.FC<CourseCardProps> = ({ course, user }) => {
  console.log(course)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isInstructor, setIsInstructor] = useState<boolean>(false)
  const checkEnrollment = async () => {
    if (user) {
      try {
        const enrolledCourses = await getEnrolledCourses(user._id)
        const enrolled = enrolledCourses.some(
          (enrolledCourse) => enrolledCourse._id === course._id
        )
        setIsEnrolled(enrolled)
      } catch (error) {
        console.error('Failed to fetch enrollment status:', error)
      }
    }
  }
  const checkIsInstructor = async () => {}
  useEffect(() => {
    checkEnrollment()
  }, [course._id, user])

  const handleEnroll = async () => {
    if (!user) {
      alert('Please log in to enroll')
      return
    }

    try {
      await enrollStudentInCourse({ userId: user._id, courseId: course._id })
      setIsEnrolled(true)
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex justify-between items-center">
          {isEnrolled ? (
            <Link
              to={`/courses/${course._id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Course
            </Link>
          ) : user?.role === 'student' ? (
            <button
              onClick={handleEnroll}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enroll
            </button>
          ) : user?._id === course.instructor?._id ? (
            <Link
              to={`/courses/${course._id}`}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Manage Course
            </Link>
          ) : (
            <Link
              to={`/courses/${course._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Course
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
