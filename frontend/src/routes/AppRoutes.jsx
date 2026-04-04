import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Exams from '../pages/Exams'
import Home from '../pages/Home'
import LandingPage from '../pages/landingPage'
import Login from '../pages/Login'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import Signup from '../pages/Signup'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
