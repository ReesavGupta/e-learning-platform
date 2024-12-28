import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createLesson } from '../api/lessonApi'

interface AddLessonFormProps {
  courseId: string
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({ courseId }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [order, setOrder] = useState<number>(0)
  const queryClient = useQueryClient()

  const mutation = useMutation(createLesson, {
    onSuccess: () => {
      queryClient.invalidateQueries(['lessons', courseId])
      setTitle('')
      setContent('')
      setOrder(0)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ courseId: courseId, title, content, order })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
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
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label
          htmlFor="order"
          className="block mb-1"
        >
          Order
        </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Lesson
      </button>
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          Error: {(mutation.error as any).message}
        </p>
      )}
    </form>
  )
}

export default AddLessonForm
