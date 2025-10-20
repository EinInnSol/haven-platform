import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import IntakeStart from './pages/IntakeStart'
import IntakeForm from './pages/IntakeForm'
import IntakeComplete from './pages/IntakeComplete'
import CaseworkerLogin from './pages/CaseworkerLogin'
import CaseworkerDashboard from './pages/CaseworkerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import QRGenerator from './pages/QRGenerator'

const API_URL = import.meta.env.VITE_API_URL || 'https://haven-api.yourdomain.workers.dev'

export { API_URL }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/intake/:qrId" element={<IntakeStart />} />
        <Route path="/intake/:qrId/form" element={<IntakeForm />} />
        <Route path="/intake/complete" element={<IntakeComplete />} />
        <Route path="/login" element={<CaseworkerLogin />} />
        <Route path="/dashboard" element={<CaseworkerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/qr" element={<QRGenerator />} />
      </Routes>
    </Router>
  )
}

export default App