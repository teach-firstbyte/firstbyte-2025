"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

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
    speed: 5
  };
  function update() {
    // Move player based on keyboard input
    if (keys.ArrowRight) player.x += player.speed;
    if (keys.ArrowLeft) player.x -= player.speed;
    // Draw everything and loop
    draw();
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
  background-color: white;
  overflow: hidden;
  margin: 20px;
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
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  //  typing animation 
useEffect(() => {
  if (!typing) return;                             // stop when paused

  const snippet = codeSnippets[currentSnippet].code;
  if (cursorPosition < snippet.length) {
    const id = setTimeout(() => {
      setText(prev => prev + snippet.charAt(cursorPosition));
      setCursorPosition(prev => prev + 1);
    }, 30);
    return () => clearTimeout(id);
  } else {
    setTyping(false);                              // finished this snippet
  }
}, [typing, cursorPosition, currentSnippet]);

//  pause between snippets & advance 
useEffect(() => {
  if (typing) return;                              // only run while paused

  const id = setTimeout(() => {
    setText("");
    setCursorPosition(0);
    setCurrentSnippet(prev => (prev + 1) % codeSnippets.length);
    setTyping(true);                               // start typing next snippet
  }, 5000);

  return () => clearTimeout(id);                   
}, [typing]);

  return (
    <div className={`w-full h-full ${isLightTheme ? 'bg-zinc-100' : 'bg-zinc-900'} rounded-lg overflow-hidden shadow-xl`}>
      <div className={`flex items-center gap-2 px-4 py-2 ${isLightTheme ? 'bg-zinc-200' : 'bg-zinc-800'}`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className={`text-xs ${isLightTheme ? 'text-zinc-600' : 'text-zinc-400'} font-mono`}>{codeSnippets[currentSnippet].language}</div>
      </div>

      <div className={`p-4 font-mono text-sm ${isLightTheme ? 'text-zinc-800' : 'text-white'} overflow-hidden h-[calc(100%-45px)]`}>
        <pre className="whitespace-pre-wrap">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
            className={`inline-block w-2 h-4 ${isLightTheme ? 'bg-zinc-800' : 'bg-white'}`}
          ></motion.span>
        </pre>
      </div>
    </div>
  )
}

