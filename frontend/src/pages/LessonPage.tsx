import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getLessonById } from '../api/lessonApi'
import { getAllQuizzes } from '../api/quizApi'
import { Lesson } from '../types'

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [allQuizzes, setAllQuizzes] = useState([])
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setError('Lesson ID is missing')
        setLoading(false)
        return
      }

      try {
        const fetchedLesson = await getLessonById(lessonId)
        setLesson(fetchedLesson)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lesson')
      } finally {
        setLoading(false)
      }
    }
    const getQuizzes = async () => {
      const res = await getAllQuizzes()
      setAllQuizzes(res.data)
    }
    fetchLesson()
    getQuizzes()
  }, [lessonId])

  const handleBackToCourse = () => {
    navigate(-1) // Navigate back to the previous page
  }

  if (loading) return <div>loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson?.title} </h1>
      {lesson?.content ? (
        <>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          ></div>

          <div>
            <button
              onClick={() => navigate(`/instructor/lessons/${lessonId}/edit`)}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Lesson
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No content available for this lesson.</p>
      )}
      <button
        onClick={() => navigate(`/instructor/lessons/${lessonId}/quiz/create`)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Quiz
      </button>
      <button
        onClick={handleBackToCourse}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Course
      </button>

      <div>
        <h2 className="text-xl font-bold mt-6 mb-4">Quizzes</h2>
        {allQuizzes
          .filter((quiz) => quiz.lesson._id === lessonId)
          .map((quiz) => (
            <div
              key={quiz._id}
              className="mb-4"
            >
              <Link to={`/instructor/quizzes/${quiz._id}/edit`}>
                <h3 className="text-lg font-bold">{quiz.title}</h3>
              </Link>
              <p>{quiz.questions.length} questions</p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default LessonPage
