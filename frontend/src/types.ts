export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  createdAt?: string
  updatedAt?: string
}
export interface Lesson {
  id: string
  courseId: string
  title: string
  content?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  lessons?: string[]
  createdAt?: string
  updatedAt?: string
}
export interface Option {
  text: string
  isCorrect: boolean
}

export interface Question {
  text: string
  options: Option[]
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  questions: Question[] // Change from string[] to Question[]
  createdAt?: string
  updatedAt?: string
}
