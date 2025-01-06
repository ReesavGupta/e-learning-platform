import { Quiz, Question } from '../types'

const QUIZ_API_URL = 'http://localhost:3000/api/quizzes'
const QUESTION_API_URL = 'http://localhost:3000/api/questions'

// Quiz Routes
export const createQuiz = async (quizData: Omit<Quiz, 'id'>): Promise<Quiz> => {
  console.log('in api:', quizData)
  const response = await fetch(QUIZ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to create quiz')
  }

  return await response.json()
}

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const response = await fetch(QUIZ_API_URL, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch quizzes')
  }
  const result = await response.json()
  return result
}

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await fetch(`${QUIZ_API_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch quiz')
  }
  const result = await response.json()
  return result.data
}

export const updateQuiz = async (quizData: {
  id: string
  title: string
  questions: any[]
}): Promise<Quiz> => {
  const { id, title, questions } = quizData
  const response = await fetch(`${QUIZ_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, questions }),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update quiz')
  }

  return response.json()
}

export const deleteQuiz = async (id: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${QUIZ_API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete quiz')
  }

  return response.json()
}

// Question Routes
export const createQuestion = async (
  questionData: Omit<Question, 'id'>
): Promise<Question> => {
  const response = await fetch(`${QUESTION_API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to create question')
  }

  return response.json()
}

export const getQuestionsByQuiz = async (
  quizId: string
): Promise<Question[]> => {
  const response = await fetch(`${QUESTION_API_URL}/quiz/${quizId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch questions')
  }

  return response.json()
}

export const getQuestionById = async (
  questionId: string
): Promise<Question> => {
  const response = await fetch(`${QUESTION_API_URL}/${questionId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch question')
  }

  return response.json()
}

export const updateQuestion = async (
  questionId: string,
  questionData: Partial<Question>
): Promise<Question> => {
  const response = await fetch(`${QUESTION_API_URL}/${questionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update question')
  }

  return response.json()
}

export const deleteQuestion = async (
  questionId: string
): Promise<{ success: boolean }> => {
  const response = await fetch(`${QUESTION_API_URL}/${questionId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete question')
  }

  return response.json()
}

export const submitQuizAnswers = async (
  quizId: string,
  answers: Record<string, number>
): Promise<{ score: number }> => {
  console.log(answers)
  const response = await fetch(`${QUIZ_API_URL}/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to submit quiz answers')
  }

  return response.json()
}
