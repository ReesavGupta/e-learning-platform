export interface User {
  _id: string
  username: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  createdAt?: string
  updatedAt?: string
}

export interface Lesson {
  _id: string
  course: Course
  title: string
  content?: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Course {
  _id: string
  title: string
  description: string
  instructor?: User
  lessons?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Option {
  text: string
  isCorrect: boolean
}

export interface Question {
  _id: string // Added id to uniquely identify each question
  text: string
  options: Option[]
}

export interface Quiz {
  _id: string
  lessonId: string
  title: string
  questions: Question[] // Changed from string[] to Question[] to hold full question objects
  createdAt?: string
  updatedAt?: string
}
