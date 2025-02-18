export interface QuizAttempt {
  id: string
  date: Date
  score: number
  totalQuestions: number
  answers: Record<number, string>
}

export class QuizDB {
  private dbName = "quiz-platform"
  private storeName = "attempts"
  private dbInstance: IDBDatabase | null = null

  async init() {
    if (this.dbInstance) return

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        this.dbInstance = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" })
        }
      }
    })
  }

  async saveAttempt(attempt: QuizAttempt) {
    await this.init()
    if (!this.dbInstance) throw new Error("Database not initialized")

    return new Promise<void>((resolve, reject) => {
      const transaction = this.dbInstance!.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const request = store.add({
        ...attempt,
        date: attempt.date.toISOString(), // Convert Date to string for storage
      })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAttempts(): Promise<QuizAttempt[]> {
    await this.init()
    if (!this.dbInstance) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.dbInstance!.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        // Convert stored date strings back to Date objects
        const attempts = request.result.map((attempt) => ({
          ...attempt,
          date: new Date(attempt.date),
        }))
        resolve(attempts)
      }
    })
  }
}

export const quizDb = new QuizDB()

