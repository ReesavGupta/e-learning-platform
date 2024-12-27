import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { createLesson } from '../api/lessonApi'
import { Lesson } from '../types' // Ensure this matches the correct path

const CreateLessonPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [order, setOrder] = useState<number | undefined>(undefined)

  const mutation = useMutation(createLesson, {
    onSuccess: (data: Lesson) => {
      navigate(`/instructor/lessons/${data.id}/edit`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Map courseId to course to match API expectations
    const lessonData: Omit<Lesson, 'id'> = {
      courseId: courseId!, // Map courseId to course
      title,
      content,
      order,
    }

    mutation.mutate(lessonData)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Lesson</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4"
      >
        <div>
          <label
            htmlFor="title"
            className="block mb-1"
          >
            Title
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
        <div>
          <label
            htmlFor="content"
            className="block mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            rows={10}
          />
        </div>
        <div>
          <label
            htmlFor="order"
            className="block mb-1"
          >
            Order (Optional)
          </label>
          <input
            type="number"
            id="order"
            value={order || ''}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Lesson
        </button>
      </form>
    </div>
  )
}

export default CreateLessonPage
