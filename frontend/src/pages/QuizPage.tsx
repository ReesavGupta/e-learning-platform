import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { getQuizById, submitQuizAnswers } from '../api/quizApi'
import { useAuth } from '../contexts/AuthContext'
import { User } from '../types'
const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const { user } = useAuth()
  const userId = user?._id
  // console.log(userId)
  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery(['quiz', quizId], () => getQuizById(quizId!), {
    enabled: !!quizId, // Only fetch if quizId exists
  })

  const submitMutation = useMutation(
    (data: {
      quizId: string
      answers: Record<string, number>
      userId: string
    }) => submitQuizAnswers(data.quizId, data.answers, data.userId),
    {
      onSuccess: () => {
        setSubmitted(true)
      },
    }
  )

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (quiz && quiz._id && userId) {
      submitMutation.mutate({ quizId: quiz._id, answers, userId })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading quiz</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{quiz?.title}</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {quiz?.questions.map((question, qIndex) => (
            <div
              key={question._id}
              className="mb-6"
            >
              <h3 className="text-xl font-semibold mb-2">
                {qIndex + 1}. {question.text}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={oIndex}
                      checked={answers[question._id] === oIndex}
                      onChange={() => handleAnswerChange(question._id, oIndex)}
                      className="form-radio"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Quiz
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quiz Submitted</h2>
          <p>
            Thank you for completing the quiz. Your results will be available
            soon.
          </p>
          <button
            onClick={() => navigate(`/lessons/${quiz?.lesson._id}`)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to lesson
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizPage
