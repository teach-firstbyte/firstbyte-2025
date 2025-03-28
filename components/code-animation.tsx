"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const codeSnippets = [
  {
    language: "Python",
    code: `def fibonacci(n):
  if n <= 1:
      return n
  else:
      return fibonacci(n-1) + fibonacci(n-2)

# Print the first 10 Fibonacci numbers
for i in range(10):
  print(fibonacci(i))`,
    color: "#3572A5",
  },
  {
    language: "JavaScript",
    code: `function createGame() {
const player = {
  x: 50,
  y: 50,
  speed: 5
};

function update() {
  // Move player based on keyboard input
  if (keys.ArrowRight) player.x += player.speed;
  if (keys.ArrowLeft) player.x -= player.speed;
  if (keys.ArrowUp) player.y -= player.speed;
  if (keys.ArrowDown) player.y += player.speed;
  
  // Draw everything
  draw();
  
  // Loop
  requestAnimationFrame(update);
}

update();
}

createGame();`,
    color: "#f7df1e",
  },
  {
    language: "HTML/CSS",
    code: `<div class="card">
<div class="card-header">
  <h2>FirstByte Workshop</h2>
</div>
<div class="card-body">
  <p>Welcome to your first coding project!</p>
  <button class="btn">Run Code</button>
</div>
</div>

<style>
.card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  margin: 20px;
}

.card-header {
  background-color: #4f46e5;
  color: white;
  padding: 15px;
}

.card-body {
  padding: 15px;
}

.btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>`,
    color: "#e34c26",
  },
]

export function CodeAnimation() {
  const [currentSnippet, setCurrentSnippet] = useState(0)
  const [typing, setTyping] = useState(true)
  const [text, setText] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet].code

    if (typing) {
      if (cursorPosition < snippet.length) {
        const timer = setTimeout(() => {
          setText(text + snippet.charAt(cursorPosition))
          setCursorPosition(cursorPosition + 1)
        }, 30)

        return () => clearTimeout(timer)
      } else {
        setTyping(false)
        const timer = setTimeout(() => {
          setTyping(true)
          setText("")
          setCursorPosition(0)
          setCurrentSnippet((currentSnippet + 1) % codeSnippets.length)
        }, 3000)

        return () => clearTimeout(timer)
      }
    }
  }, [typing, text, cursorPosition, currentSnippet])

  return (
    <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden shadow-xl">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-zinc-400 font-mono">{codeSnippets[currentSnippet].language}</div>
      </div>

      <div className="p-4 font-mono text-sm text-white overflow-auto h-[calc(100%-40px)]">
        <pre className="whitespace-pre-wrap">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-white"
          ></motion.span>
        </pre>
      </div>
    </div>
  )
}

