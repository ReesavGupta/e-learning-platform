const API_URL = 'http://localhost:3000/api/progress'

// Get a student's progress in a specific course
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

// Update a student's progress for a course (e.g., initializing progress)
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

// Mark a specific lesson as complete for the student
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

// Get progress of all students in a specific course
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
