import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { getCourseById, updateCourse, deleteCourse } from '../api/courseApi'

const EditCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const {
    data: course,
    isLoading,
    error,
  } = useQuery(['course', courseId], () => getCourseById(courseId!))

  useEffect(() => {
    if (course) {
      setTitle(course.title)
      setDescription(course.description)
    }
  }, [course])

  const updateMutation = useMutation(
    (courseData: { id: string; title: string; description: string }) =>
      updateCourse(courseData),
    {
      onSuccess: () => {
        navigate('/instructor/dashboard')
      },
    }
  )

  const deleteMutation = useMutation(deleteCourse, {
    onSuccess: () => {
      navigate('/instructor/dashboard')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      id: courseId!,
      title,
      description,
      user: course?.instructor,
    })
    updateMutation.mutate({
      id: courseId!,
      title,
      description,
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(courseId!)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading course</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
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

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Course
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Course
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCoursePage
