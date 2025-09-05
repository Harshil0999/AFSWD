import { QuizValidation } from "@/components/quiz-validation"

const sampleQuestions = [
  {
    id: "q1",
    question: "What is the primary purpose of React hooks?",
    options: [
      "To replace class components entirely",
      "To manage state and side effects in functional components",
      "To improve performance of React applications",
      "To handle routing in React applications",
    ],
    correctAnswer: 1,
    explanation:
      "React hooks allow you to use state and other React features in functional components, making them more powerful and easier to work with.",
  },
  {
    id: "q2",
    question: "Which hook is used for managing component state?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1,
    explanation: "useState is the primary hook for managing local component state in functional components.",
  },
  {
    id: "q3",
    question: "What does the useEffect hook handle?",
    options: [
      "Component state management",
      "Side effects and lifecycle events",
      "Context API integration",
      "Component rendering optimization",
    ],
    correctAnswer: 1,
    explanation:
      "useEffect handles side effects like API calls, subscriptions, and cleanup operations, similar to lifecycle methods in class components.",
  },
]

export default function QuizPage() {
  const handleQuizComplete = (score: number, answers: { [key: string]: number }) => {
    console.log("Quiz completed with score:", score)
    console.log("User answers:", answers)
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <QuizValidation
          questions={sampleQuestions}
          timeLimit={10} // 10 minutes
          onComplete={handleQuizComplete}
        />
      </div>
    </div>
  )
}
