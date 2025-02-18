"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { quizDb, type QuizAttempt } from "@/lib/db"
import { Trophy, ArrowLeft, RotateCcw } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  useEffect(() => {
    const loadAttempts = async () => {
      await quizDb.init()
      const loadedAttempts = await quizDb.getAttempts()
      setAttempts(loadedAttempts.sort((a, b) => b.date.getTime() - a.date.getTime()))
    }
    loadAttempts()
  }, [])

  const latestAttempt = attempts[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
          {latestAttempt && (
            <p className="text-xl mb-8">
              You scored {latestAttempt.score} out of {latestAttempt.totalQuestions}!
            </p>
          )}
        </motion.div>

        <div className="grid gap-6">
          <h2 className="text-2xl font-bold">Previous Attempts</h2>
          {attempts.map((attempt) => (
            <motion.div
              key={attempt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium">
                    Score: {attempt.score}/{attempt.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(attempt.date).toLocaleDateString()} at {new Date(attempt.date).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-2xl font-bold">{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button onClick={() => router.push("/quiz")} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}

