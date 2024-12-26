import { Lesson } from '../types'

const API_URL = '/api/lessons'

export const createLesson = async (
  lessonData: Omit<Lesson, 'id'>
): Promise<Lesson> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lessonData),
    credentials: 'include',
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

  return response.json()
}

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const response = await fetch(`${API_URL}/${lessonId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lesson')
  }

  return response.json()
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
