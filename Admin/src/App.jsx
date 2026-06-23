import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Users from './pages/Users'
import AboutMe from './pages/AboutMe'
import Education from './pages/Education'
import WorkExperience from './pages/WorkExperience'
import Resume from './pages/Resume'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Testimonials from './pages/Testimonials'
import TestimonialDetail from './pages/TestimonialDetail'
import Achievements from './pages/Achievements'
import Certificates from './pages/Certificates'
import ContactDetail from './pages/ContactDetail'
import ProjectDetail from './pages/ProjectDetail'
import PageNotFound from './pages/PageNotFound'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/education" element={<Education />} />
          <Route path="/work-experience" element={<WorkExperience />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/:id" element={<ContactDetail />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/testimonials/:id" element={<TestimonialDetail />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/certificates" element={<Certificates />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
