import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getAllCourses } from '../api/courseApi'
import { getStudentCourseProgress } from '../api/progressApi'
import { useAuth } from '../contexts/AuthContext'

const ProgressPage: React.FC = () => {
  const { user } = useAuth()
  const [courseProgress, setCourseProgress] = useState<any[]>([])

  // Fetch all the courses that the user is enrolled in
  const {
    data: courses,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery('courses', getAllCourses, {
    enabled: !!user?.id, // Only fetch if user is available
  })

  useEffect(() => {
    if (courses) {
      // For each course, fetch progress
      const fetchProgress = async () => {
        const progressPromises = courses.map(async (course) => {
          const response = await getStudentCourseProgress(user!.id, course.id)
          return {
            course,
            progress: response.data,
          }
        })
        const progressData = await Promise.all(progressPromises)
        setCourseProgress(progressData)
      }

      fetchProgress()
    }
  }, [courses, user])

  // Loading states
  if (isCoursesLoading) return <div>Loading courses...</div>
  if (coursesError) return <div>Error loading courses</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Progress</h1>
      {courseProgress.length > 0 ? (
        courseProgress.map(({ course, progress }) => (
          <div
            key={course.id}
            className="mb-8 bg-white shadow-md rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>

            {/* Overall Progress */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Overall Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress.overallProgress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {progress.overallProgress}% complete
              </span>
            </div>

            {/* Lessons Progress */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Lessons</h3>
              <ul className="space-y-2">
                {progress.lessons.map((lesson: any) => (
                  <li
                    key={lesson.lessonId}
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

            {/* Quizzes Progress */}
            <div>
              <h3 className="text-lg font-medium mb-2">Quizzes</h3>
              <ul className="space-y-2">
                {progress.quizzes.map((quiz: any) => (
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
        ))
      ) : (
        <div>No progress data available</div>
      )}
    </div>
  )
}

export default ProgressPage
