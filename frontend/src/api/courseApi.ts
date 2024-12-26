import { Course } from '../types'

const API_URL = '/api/courses'

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await fetch(API_URL, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }

  return response.json()
}

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch course')
  }

  return response.json()
}

export const createCourse = async (
  courseData: Omit<Course, 'id'>
): Promise<Course> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to create course')
  }

  return response.json()
}

export const updateCourse = async (
  id: string,
  courseData: Partial<Course>
): Promise<Course> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update course')
  }

  return response.json()
}

export const deleteCourse = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete course')
  }

  return response.json()
}
