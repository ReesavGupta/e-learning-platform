import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getCourseById } from '../api/courseApi'
import { useAuth } from '../contexts/AuthContext'
import LessonList from '../components/LessonList'
import AddLessonForm from '../components/AddLessonForm'

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const {
    data: course,
    isLoading,
    error,
  } = useQuery(['course', courseId], () => getCourseById(courseId!))

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading course details</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{course?.title}</h1>
      <p className="text-gray-600 mb-4">{course?.description}</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
        <LessonList courseId={courseId!} />
      </div>
      {user?._id === course?.instructor?._id && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Lesson</h2>
          <AddLessonForm courseId={courseId!} />
        </div>
      )}
    </div>
  )
}

export default CourseDetails
