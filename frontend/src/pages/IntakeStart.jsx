import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_URL } from '../App'
import { Home, MapPin, Clock } from 'lucide-react'

function IntakeStart() {
  const { qrId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)

  useEffect(() => {
    startSession()
  }, [])

  const startSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/intake/${qrId}/start`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid QR code')
      }
      
      setSession(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleStart = () => {
    navigate(`/intake/${qrId}/form`, { state: { sessionId: session.session_id } })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Code</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Please ask a staff member for a new QR code.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white safe-top safe-bottom">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-haven-blue text-white p-8 text-center">
            <Home className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Welcome to HAVEN</h1>
            <p className="text-blue-100 text-lg">Housing Assistance Via Engaged Network</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center text-gray-700 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-medium">{session?.location || 'Service Location'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                <span>Takes about 10-15 minutes</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-3">What to expect:</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>40 questions about your current situation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Your information is private and secure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Immediate assignment to a caseworker</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Contact within 24 hours to start helping you</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-haven-blue text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Assessment
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Your responses help us match you with the right housing resources
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntakeStart