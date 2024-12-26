import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CourseDashboard from './pages/CourseDashboard'
import CourseDetails from './pages/CourseDetails'
import LessonPage from './pages/LessonPage'
import QuizPage from './pages/QuizPage'
import ProfilePage from './pages/ProfilePage'
import ProgressPage from './pages/ProgressPage'
import ProtectedRoute from './components/ProtectedRoute'
import InstructorDashboard from './pages/InstructorDashboard'
import CreateCoursePage from './pages/CreateCoursePage'
import EditCoursePage from './pages/EditCoursePage'
import CreateLessonPage from './pages/CreateLessonPage'
import EditLessonPage from './pages/EditLessonPage'
import CreateQuizPage from './pages/CreateQuizPage'
import EditQuizPage from './pages/EditQuizPage'
import StudentProgressPage from './pages/StudentProgressPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route
                  path="/"
                  element={<HomePage />}
                />
                <Route
                  path="/login"
                  element={<LoginPage />}
                />
                <Route
                  path="/register"
                  element={<RegisterPage />}
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <CourseDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseId"
                  element={
                    <ProtectedRoute>
                      <CourseDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quizzes/:quizId"
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <ProgressPage />
                    </ProtectedRoute>
                  }
                />

                {/* Instructor routes */}
                <Route
                  path="/instructor/dashboard"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <InstructorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/create"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <CreateCoursePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:courseId/edit"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <EditCoursePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:courseId/lessons/create"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <CreateLessonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/lessons/:lessonId/edit"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <EditLessonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/lessons/:lessonId/quiz/create"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <CreateQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/quizzes/:quizId/edit"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <EditQuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:courseId/progress"
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <StudentProgressPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
