"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizValidationProps {
  questions: QuizQuestion[]
  timeLimit?: number // in minutes
  onComplete?: (score: number, answers: { [key: string]: number }) => void
}

export function QuizValidation({ questions, timeLimit = 30, onComplete }: QuizValidationProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeRemaining, isSubmitted])

  // Real-time validation
  useEffect(() => {
    const newErrors: { [key: string]: string } = {}

    // Check if current question is answered
    const currentQuestionId = questions[currentQuestion]?.id
    if (currentQuestionId && answers[currentQuestionId] === undefined) {
      newErrors[currentQuestionId] = "Please select an answer before proceeding"
    }

    setValidationErrors(newErrors)
  }, [currentQuestion, answers, questions])

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))

    // Clear validation error when answer is selected
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleNext = () => {
    const currentQuestionId = questions[currentQuestion].id

    if (answers[currentQuestionId] === undefined) {
      setValidationErrors((prev) => ({
        ...prev,
        [currentQuestionId]: "Please select an answer before proceeding",
      }))
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Validate all questions are answered
    const unansweredQuestions = questions.filter((q) => answers[q.id] === undefined)

    if (unansweredQuestions.length > 0) {
      const newErrors: { [key: string]: string } = {}
      unansweredQuestions.forEach((q) => {
        newErrors[q.id] = "This question requires an answer"
      })
      setValidationErrors(newErrors)

      // Navigate to first unanswered question
      const firstUnanswered = questions.findIndex((q) => answers[q.id] === undefined)
      setCurrentQuestion(firstUnanswered)
      return
    }

    setIsSubmitted(true)
    setShowResults(true)

    // Calculate score
    const correctAnswers = questions.filter((q) => answers[q.id] === q.correctAnswer).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    onComplete?.(score, answers)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeRemaining > 300) return "text-foreground" // > 5 minutes
    if (timeRemaining > 60) return "text-yellow-600" // > 1 minute
    return "text-destructive" // < 1 minute
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length

  if (showResults) {
    const correctAnswers = questions.filter((q) => answers[q.id] === q.correctAnswer).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    return (
      <Card className="card-theme">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            {score >= 70 ? (
              <CheckCircle className="h-6 w-6 text-accent mr-2" />
            ) : (
              <XCircle className="h-6 w-6 text-destructive mr-2" />
            )}
            Quiz Complete!
          </CardTitle>
          <CardDescription>
            You scored {correctAnswers} out of {questions.length} questions correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Badge variant={score >= 70 ? "default" : "destructive"} className="text-sm">
              {score >= 70 ? "Passed" : "Failed"}
            </Badge>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">Question {index + 1}</h4>
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm mb-2">{question.question}</p>
                  <div className="text-xs space-y-1">
                    <p className={isCorrect ? "text-accent" : "text-destructive"}>
                      Your answer: {question.options[userAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-accent">Correct answer: {question.options[question.correctAnswer]}</p>
                    )}
                    {question.explanation && <p className="text-muted-foreground italic">{question.explanation}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          <Button className="w-full" onClick={() => window.location.reload()}>
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestionData = questions[currentQuestion]
  const currentQuestionId = currentQuestionData?.id
  const hasError = validationErrors[currentQuestionId]

  return (
    <Card className="card-theme">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quiz Assessment</CardTitle>
          <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <CardDescription>
          Question {currentQuestion + 1} of {questions.length} • {answeredCount} answered
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestionData.question}</h3>

          <RadioGroup
            value={answers[currentQuestionId]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestionId, Number.parseInt(value))}
          >
            {currentQuestionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {hasError && (
            <div className="flex items-center space-x-2 text-destructive text-sm animate-in slide-in-from-left-1 duration-200">
              <AlertTriangle className="h-4 w-4" />
              <span>{hasError}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit} className="min-w-[120px]">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestion ? "default" : "outline"}
              size="sm"
              className={`w-8 h-8 p-0 ${
                answers[questions[index].id] !== undefined ? "bg-accent/10 border-accent text-accent" : ""
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
