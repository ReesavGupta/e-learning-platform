import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { createCourse } from '../api/courseApi'

const CreateCoursePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructor, setInstructor] = useState('')
  const navigate = useNavigate()

  const mutation = useMutation(createCourse, {
    onSuccess: (data) => {
      navigate(`/instructor/courses/${data._id}/edit`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the instructor field
    if (!instructor) {
      alert('Instructor ID is required.')
      return
    }

    mutation.mutate({ _id: instructor, title, description, instructor })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4"
      >
        <div>
          <label
            htmlFor="title"
            className="block mb-1 font-medium"
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
            className="block mb-1 font-medium"
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
            htmlFor="instructor"
            className="block mb-1 font-medium"
          >
            Instructor ID
          </label>
          <input
            type="text"
            id="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
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
      {mutation.isError && (
        <p className="text-red-500 mt-4">
          Error: {(mutation.error as any).message}
        </p>
      )}
    </div>
  )
}

export default CreateCoursePage
