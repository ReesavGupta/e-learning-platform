import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { getLessonsByCourse } from '../api/lessonApi'

interface LessonListProps {
  courseId: string
}

const LessonList: React.FC<LessonListProps> = ({ courseId }) => {
  const {
    data: lessons,
    isLoading,
    error,
  } = useQuery(['lessons', courseId], () => getLessonsByCourse(courseId))

  if (isLoading) return <div>Loading lessons...</div>
  if (error) return <div>Error loading lessons</div>

  return (
    <ul className="space-y-2">
      {lessons?.map((lesson) => (
        <li
          key={lesson._id}
          className="bg-white p-4 rounded shadow"
        >
          <Link
            to={`/lessons/${lesson._id}`}
            className="text-blue-600 hover:underline"
          >
            {lesson.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default LessonList
