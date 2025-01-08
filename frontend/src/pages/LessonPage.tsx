import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAllQuizzes, getQuizResult } from '../api/quizApi' // Adjust import paths as needed
import { getLessonById } from '../api/lessonApi'
import { Lesson, Quiz, User } from '../types' // Adjust type imports as needed
import { useAuth } from '../contexts/AuthContext'

const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
  const [quizResult, setQuizResult] = useState<
    { quizId: string; score: string }[]
  >([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const lessonData = await getLessonById(lessonId)
        setLesson(lessonData)
      } catch (error) {
        console.error('Error fetching lesson:', error)
      }
    }

    const fetchAllQuizzes = async () => {
      try {
        const quizzes = await getAllQuizzes()
        // console.log(quizzes.data)

        setAllQuizzes(quizzes.data)

        const results = await Promise.all(
          quizzes.data
            .filter((quiz) => quiz.lesson._id === lessonId)
            .map(async (quiz) => {
              try {
                const result = await getQuizResult(quiz._id, user?._id || '')
                console.log(result)
                if (result === 'Not Attempted') {
                  return {
                    quizId: quiz._id,
                    score: result,
                  }
                }

                return {
                  quizId: quiz._id,
                  score: result?.submission?.result,
                }
              } catch (error) {
                console.error(
                  `Error fetching result for quiz ${quiz._id}:`,
                  error
                )
                return { quizId: quiz._id, score: 'Error' }
              }
            })
        )
        // console.log('this is results', results)
        setQuizResult(results)
      } catch (error) {
        console.error('Error fetching quizzes:', error)
      }
    }

    fetchLessonData()
    fetchAllQuizzes()
  }, [lessonId, user])

  return (
    <div className="lesson-page">
      {lesson ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
          <p className="mb-6">{lesson.content}</p>
          {user?.role === 'instructor' ? (
            <div>
              <Link to={`/instructor/lessons/${lesson._id}/quiz/create`}>
                Create Quiz
              </Link>
            </div>
          ) : (
            <div></div>
          )}
          {allQuizzes
            .filter((quiz) => quiz.lesson._id === lessonId)
            .map((quiz) => {
              const result = quizResult.find((r) => r.quizId === quiz._id)
              return (
                <div
                  key={quiz._id}
                  className="mb-4"
                >
                  {user?.role === 'instructor' ? (
                    <Link to={`/instructor/quizzes/${quiz._id}/edit`}>
                      <h3 className="text-lg font-bold">{quiz.title}</h3>
                    </Link>
                  ) : (
                    <div className="w-[50%] flex justify-between">
                      <Link to={`/quizzes/${quiz._id}`}>
                        <h3 className="text-lg font-bold">{quiz.title}</h3>
                      </Link>
                      <h4>Result: {result?.score}%</h4>
                    </div>
                  )}
                  <p>{quiz.questions.length} questions</p>
                </div>
              )
            })}
        </>
      ) : (
        <p>Loading lesson...</p>
      )}
    </div>
  )
}

export default LessonPage
