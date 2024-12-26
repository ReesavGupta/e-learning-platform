import React from 'react'
import { useQuery } from 'react-query'
import { getUserProgress } from '../api/progressApi'
import { useAuth } from '../contexts/AuthContext'

const ProgressPage: React.FC = () => {
  const { user } = useAuth()
  const {
    data: progress,
    isLoading,
    error,
  } = useQuery(['userProgress', user?.id], () => getUserProgress(user!.id))

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading progress data</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Progress</h1>
      {progress?.courses.map((course) => (
        <div
          key={course.id}
          className="mb-8 bg-white shadow-md rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Overall Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${course.overallProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">
              {course.overallProgress}% complete
            </span>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Lessons</h3>
            <ul className="space-y-2">
              {course.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={lesson.completed}
                    readOnly
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">{lesson.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Quizzes</h3>
            <ul className="space-y-2">
              {course.quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="flex items-center justify-between"
                >
                  <span>{quiz.title}</span>
                  {quiz.score !== null ? (
                    <span className="text-green-600 font-medium">
                      Score: {quiz.score}%
                    </span>
                  ) : (
                    <span className="text-gray-500">Not taken</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProgressPage
