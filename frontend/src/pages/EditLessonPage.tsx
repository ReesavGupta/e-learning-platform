import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { getLessonById, updateLesson, deleteLesson } from '../api/lessonApi'

const EditLessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const {
    data: lesson,
    isLoading,
    error,
  } = useQuery(['lesson', lessonId], () => getLessonById(lessonId!))

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title)
      setContent(lesson.content || '')
    }
  }, [lesson])

  const updateMutation = useMutation(
    (lessonData: { lessonId: string; title: string; content: string }) =>
      updateLesson(lessonData.lessonId, {
        title: lessonData.title,
        content: lessonData.content,
      }),
    {
      onSuccess: () => {
        navigate(`/courses/${lesson?.courseId}`)
      },
    }
  )

  const deleteMutation = useMutation(deleteLesson, {
    onSuccess: () => {
      navigate(`/courses/${lesson?.courseId}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      lessonId: lessonId!,
      title,
      content,
    })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      deleteMutation.mutate(lessonId!)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading lesson</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Lesson</h1>
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
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Lesson
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Lesson
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditLessonPage
