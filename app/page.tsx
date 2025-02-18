"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import * as THREE from "three"
import { Brain, Trophy, Clock } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    const renderer = rendererRef.current
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Create floating symbols with better materials
    const symbols = []
    const symbolGeometry = new THREE.IcosahedronGeometry(1, 0)
    const symbolMaterial = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      shininess: 100,
      specular: 0x444444,
    })

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 1, 1)
    sceneRef.current.add(light)

    const ambientLight = new THREE.AmbientLight(0x404040)
    sceneRef.current.add(ambientLight)

    for (let i = 0; i < 20; i++) {
      const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial)
      symbol.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 15)
      symbol.rotation.x = Math.random() * Math.PI
      symbol.rotation.y = Math.random() * Math.PI
      symbols.push(symbol)
      sceneRef.current.add(symbol)
    }

    cameraRef.current.position.z = 5

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      symbols.forEach((symbol, i) => {
        symbol.rotation.x += 0.01 * (i % 2 ? 1 : -1)
        symbol.rotation.y += 0.01 * (i % 3 ? 1 : -1)
        symbol.position.y += Math.sin(Date.now() * 0.001 + i) * 0.02
      })
      renderer.render(sceneRef.current!, cameraRef.current!)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !renderer) return
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 -z-10" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-8 inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Brain className="w-16 h-16 text-indigo-400" />
          </motion.div>

          <h1 className="text-6xl sm:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Interactive Quiz Platform
          </h1>

          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Challenge yourself with our engaging quizzes! Test your knowledge across various topics with instant
            feedback and track your progress.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
          >
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
              <Clock className="w-8 h-8 mb-4 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-semibold">Timed Questions</h3>
              <p className="text-sm text-gray-300">30 seconds per question</p>
            </div>
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
              <Trophy className="w-8 h-8 mb-4 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-semibold">Track Progress</h3>
              <p className="text-sm text-gray-300">See your improvement</p>
            </div>
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
              <Brain className="w-8 h-8 mb-4 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-semibold">Multiple Topics</h3>
              <p className="text-sm text-gray-300">Diverse question types</p>
            </div>
          </motion.div>

          <Button
            size="lg"
            onClick={() => router.push("/quiz")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Quiz
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function FloatingIcon({ Icon, className }: { Icon: any; className: string }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <Icon className="w-8 h-8 text-indigo-500/30" />
    </motion.div>
  )
}

