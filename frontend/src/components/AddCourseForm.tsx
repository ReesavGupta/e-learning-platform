import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { createCourse } from '../api/courseApi' // Adjust the import to your actual createCourse function path
import { useNavigate } from 'react-router-dom'
interface AddCourseFormProps {
  instructor: string | undefined
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  instructor: initialInstructor,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [instructor, setInstructor] = useState(initialInstructor || '')
  const [lessons, setLessons] = useState<string[]>([])
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  console.log('Inside AddCourseForm:', initialInstructor)

  const mutation = useMutation(createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries('courses')
      setTitle('')
      setDescription('')
      setInstructor(initialInstructor || '')
      setLessons([])
      navigate('/courses')
    },
    onError: (error: any) => {
      console.error('Error creating course:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, description, instructor, lessons })
    mutation.mutate({ title, description, instructor, lessons })
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
          htmlFor="lessons"
          className="block mb-1"
        >
          Lessons (comma separated)
        </label>
        <input
          type="text"
          id="lessons"
          value={lessons.join(', ')}
          onChange={(e) =>
            setLessons(e.target.value.split(',').map((lesson) => lesson.trim()))
          }
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
