import React, { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '../App'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { INTAKE_QUESTIONS } from '../data/questions'

function IntakeForm() {
  const { qrId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)

  const sessionId = location.state?.sessionId
  const totalSteps = INTAKE_QUESTIONS.length
  const currentQuestion = INTAKE_QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value })
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      submitIntake()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitIntake = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/intake/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          assessment_data: answers
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      navigate('/intake/complete', { state: { result: data } })
    } catch (err) {
      alert('Error submitting assessment: ' + err.message)
      setLoading(false)
    }
  }

  const renderInput = () => {
    const currentAnswer = answers[currentQuestion.id] || ''

    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            placeholder={currentQuestion.placeholder}
            autoFocus
          />
        )

      case 'select':
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )

      case 'multiselect':
        const selectedValues = currentAnswer ? (Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer]) : []
        return (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedValues.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    const newValues = isSelected
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value]
                    handleAnswer(newValues)
                  }}
                  className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                    }`}>
                      {isSelected && <span className="text-white text-sm">✓</span>}
                    </div>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            placeholder={currentQuestion.placeholder}
            min={currentQuestion.min}
            max={currentQuestion.max}
            autoFocus
          />
        )

      case 'textarea':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none min-h-32"
            placeholder={currentQuestion.placeholder}
            autoFocus
          />
        )

      default:
        return null
    }
  }

  const isAnswered = () => {
    const answer = answers[currentQuestion.id]
    if (!answer) return !currentQuestion.required
    if (Array.isArray(answer)) return answer.length > 0
    return answer.toString().trim().length > 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Submitting your assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white safe-top safe-bottom">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-blue-600">
              <Home className="w-5 h-5 mr-2" />
              <span className="font-semibold">HAVEN</span>
            </div>
            <span className="text-sm text-gray-600">
              Question {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {currentQuestion.question}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 text-lg">{currentQuestion.description}</p>
            )}
            {currentQuestion.required && (
              <p className="text-sm text-red-600 mt-2">* Required</p>
            )}
          </div>

          <div className="mb-6">
            {renderInput()}
          </div>

          {currentQuestion.helpText && (
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <strong>Note:</strong> {currentQuestion.helpText}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center justify-center px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isAnswered()}
            className="flex-1 flex items-center justify-center px-6 py-4 rounded-lg bg-haven-blue text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-lg"
          >
            {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntakeForm