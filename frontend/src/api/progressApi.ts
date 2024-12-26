const API_URL = '/api/progress'

export const getStudentCourseProgress = async (
  studentId: string,
  courseId: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/${studentId}/course/${courseId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch progress')
  }

  return response.json()
}

export const updateStudentCourseProgress = async (
  studentId: string,
  courseId: string,
  progressData: any
): Promise<any> => {
  const response = await fetch(`${API_URL}/${studentId}/course/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progressData),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update progress')
  }

  return response.json()
}

export const markLessonComplete = async (
  studentId: string,
  courseId: string,
  lessonId: string
): Promise<any> => {
  const response = await fetch(
    `${API_URL}/${studentId}/course/${courseId}/lesson/${lessonId}`,
    {
      method: 'PUT',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to mark lesson as complete')
  }

  return response.json()
}

export const getCourseProgress = async (courseId: string): Promise<any> => {
  const response = await fetch(`${API_URL}/course/${courseId}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch course progress')
  }

  return response.json()
}
