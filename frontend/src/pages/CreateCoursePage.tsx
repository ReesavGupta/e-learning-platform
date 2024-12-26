import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { createCourse } from '../api/courseApi'

const CreateCoursePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const navigate = useNavigate()

  const mutation = useMutation(createCourse, {
    onSuccess: (data) => {
      navigate(`/instructor/courses/${data.id}/edit`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ title, description, price: parseFloat(price) })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
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
            rows={4}
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
          Create Course
        </button>
      </form>
    </div>
  )
}

export default CreateCoursePage
