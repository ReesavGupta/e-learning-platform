import { Lesson } from '../types'

const API_URL = 'http://localhost:3000/api/lessons'

export const createLesson = async (
  lessonData: Omit<Lesson, '_id'> & { courseId: string }
): Promise<Lesson> => {
  // Send the courseId as part of the URL
  const response = await fetch(`${API_URL}/${lessonData.courseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: lessonData.title,
      content: lessonData.content,
      order: lessonData.order,
    }),
    credentials: 'include', // Ensure the user is authenticated via cookies
  })

  if (!response.ok) {
    throw new Error('Failed to create lesson')
  }

  return response.json()
}

export const getLessonsByCourse = async (
  courseId: string
): Promise<Lesson[]> => {
  const response = await fetch(`${API_URL}/course/${courseId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lessons')
  }
  const result = await response.json()
  return result.data
}

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const response = await fetch(`${API_URL}/${lessonId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lesson')
  }
  const result = await response.json()
  return result.data
}

export const updateLesson = async (
  lessonId: string,
  lessonData: Partial<Lesson>
): Promise<Lesson> => {
  const response = await fetch(`${API_URL}/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lessonData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update lesson')
  }

  return response.json()
}

export const deleteLesson = async (
  lessonId: string
): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}/${lessonId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete lesson')
  }

  return response.json()
}
