import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { createQuiz } from '../api/quizApi'
import { Quiz } from '../types'

const CreateQuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([
    { text: '', options: [{ text: '', isCorrect: false }] },
  ])

  const mutation = useMutation(createQuiz, {
    onSuccess: (data) => {
      navigate(`/instructor/quizzes/${data._id}/edit`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({  lessonId: lessonId!, title, questions })
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: [{ text: '', isCorrect: false }] },
    ])
  }

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false })
    setQuestions(newQuestions)
  }

  const updateQuestion = (index: number, text: string) => {
    const newQuestions = [...questions]
    newQuestions[index].text = text
    setQuestions(newQuestions)
  }

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    text: string,
    isCorrect: boolean
  ) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = { text, isCorrect }
    setQuestions(newQuestions)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block mb-1"
          >
            Quiz Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="border p-4 rounded"
          >
            <h3 className="text-xl font-semibold mb-2">
              Question {qIndex + 1}
            </h3>
            <input
              type="text"
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, e.target.value)}
              placeholder="Enter question"
              className="w-full px-3 py-2 border rounded mb-2"
            />
            {question.options.map((option, oIndex) => (
              <div
                key={oIndex}
                className="flex items-center space-x-2 mb-2"
              >
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    updateOption(
                      qIndex,
                      oIndex,
                      e.target.value,
                      option.isCorrect
                    )
                  }
                  placeholder={`Option ${oIndex + 1}`}
                  className="flex-grow px-3 py-2 border rounded"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      updateOption(
                        qIndex,
                        oIndex,
                        option.text,
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  Correct
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="text-blue-600 hover:underline"
            >
              Add Option
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Quiz
        </button>
      </form>
    </div>
  )
}

export default CreateQuizPage
