import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getCourseProgress } from '../api/progressApi'

const StudentProgressPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const {
    data: progress,
    isLoading,
    error,
  } = useQuery(['courseProgress', courseId], () => getCourseProgress(courseId!))

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading progress data</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Progress for Course</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Student Name</th>
            <th className="border border-gray-300 px-4 py-2">
              Lessons Completed
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Quizzes Completed
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Overall Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {progress?.map((studentProgress: any) => (
            <tr key={studentProgress.studentId}>
              <td className="border border-gray-300 px-4 py-2">
                {studentProgress.studentName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {studentProgress.lessonsCompleted} /{' '}
                {studentProgress.totalLessons}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {studentProgress.quizzesCompleted} /{' '}
                {studentProgress.totalQuizzes}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${studentProgress.overallProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm">
                  {studentProgress.overallProgress}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentProgressPage
