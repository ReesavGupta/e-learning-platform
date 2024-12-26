import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createCourse } from '../api/courseApi'

const AddCourseForm: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation(createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries('courses')
      setTitle('')
      setDescription('')
      setPrice('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ title, description, price: parseFloat(price) })
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
          htmlFor="description"
          className="block mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="block mb-1"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Course
      </button>
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          Error: {(mutation.error as any).message}
        </p>
      )}
    </form>
  )
}

export default AddCourseForm
