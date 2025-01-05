import { Course } from '../types'

const API_URL = 'http://localhost:3000/api/courses'

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
  courseData: Omit<Course, 'id' | 'lessons'>
): Promise<Course> => {
  console.log('inside api: ', courseData)
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

export const updateCourse = async (courseData: {
  id: string
  title: string
  description: string
}): Promise<Course> => {
  const courseDataToSend = {
    title: courseData.title,
    description: courseData.description,
    _id: courseData.id,
  }
  const response = await fetch(`${API_URL}/${courseDataToSend._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: courseDataToSend.title,
      description: courseDataToSend.description,
    }),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update course')
  }
  const result = await response.json()
  return result
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
  const result = await response.json()
  return result
}

export const enrollStudentInCourse = async (data: {
  userId: string
  courseId: string
}): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_URL}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Failed to enroll student')
  }
  const result = await response.json()
  return result
}

export const getEnrolledCourses = async (userId: string): Promise<Course[]> => {
  const response = await fetch(
    `${API_URL}/enrolled/students?userId=${userId}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch enrolled courses')
  }
  const result = await response.json()
  return result
}
