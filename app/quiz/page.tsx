"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { questions } from "@/lib/questions"
import { quizDb } from "@/lib/db"
import { useRouter } from "next/navigation"
import { Clock, AlertCircle, Brain } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const initDb = async () => {
      await quizDb.init()
    }
    initDb()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswer = async (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })
    const correct = answer === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
      handleNextQuestion()
    }, 1500)
  }

  const handleNextQuestion = async () => {
    if (currentQuestion === questions.length - 1) {
      const score = Object.entries(answers).reduce(
        (acc, [questionId, answer]) => (answer === questions[Number(questionId)].correctAnswer ? acc + 1 : acc),
        0,
      )

      try {
        await quizDb.saveAttempt({
          id: Date.now().toString(),
          date: new Date(),
          score,
          totalQuestions: questions.length,
          answers,
        })
        router.push("/results")
      } catch (error) {
        console.error("Failed to save attempt:", error)
      }
      return
    }

    setCurrentQuestion((prev) => prev + 1)
    setTimeLeft(30)
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="text-lg font-medium">{timeLeft}s</span>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} className="w-1/2 h-3 bg-white/20" />
          <span className="text-lg font-medium">
            {currentQuestion + 1}/{questions.length}
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
          >
            <Brain className="w-12 h-12 mb-6 text-indigo-400" />
            <h2 className="text-2xl font-bold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              {question.text}
            </h2>

            {question.type === "multiple-choice" ? (
              <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer} className="space-y-4">
                {question.options?.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.1 },
                    }}
                    className="group"
                  >
                    <div className="flex items-center space-x-2 p-4 rounded-xl border border-white/20 hover:border-indigo-500 hover:bg-white/5 transition-all duration-300 cursor-pointer">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="font-medium text-lg group-hover:text-indigo-400 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  </motion.div>
                ))}
              </RadioGroup>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter your answer"
                  className="text-lg p-4 bg-white/5 border-white/20 focus:border-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAnswer((e.target as HTMLInputElement).value)
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    handleAnswer(input.value)
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Submit Answer
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-full backdrop-blur-sm ${
                isCorrect ? "bg-green-500/90" : "bg-red-500/90"
              } text-white font-medium flex items-center gap-3 shadow-lg`}
            >
              <AlertCircle className="w-6 h-6" />
              {isCorrect ? "Correct!" : "Incorrect!"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

