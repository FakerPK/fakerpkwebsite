"use client"
import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const BackgroundBeams = React.memo(({ className }: { className?: string }) => {
  console.log("[v0] BackgroundBeams component rendering")

  const paths = [
    "M-200 -100C-200 -100 -150 150 100 200C350 250 400 500 400 500",
    "M-190 -110C-190 -110 -140 140 110 190C360 240 410 490 410 490",
    "M-180 -120C-180 -120 -130 130 120 180C370 230 420 480 420 480",
    "M-170 -130C-170 -130 -120 120 130 170C380 220 430 470 430 470",
    "M-160 -140C-160 -140 -110 110 140 160C390 210 440 460 440 460",
  ]

  return (
    <div className={cn("absolute inset-0 flex h-full w-full items-center justify-center z-0", className)}>
      <svg
        className="pointer-events-none absolute z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={`path-` + index}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.8"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 1,
            }}
          />
        ))}
        <defs>
          {paths.map((path, index) => (
            <motion.linearGradient
              id={`linearGradient-${index}`}
              key={`gradient-${index}`}
              initial={{
                x1: "0%",
                x2: "0%",
                y1: "0%",
                y2: "0%",
              }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + Math.random() * 8}%`],
              }}
              transition={{
                duration: Math.random() * 4 + 4,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            >
              <stop stopColor="#FF6B35" stopOpacity="0" />
              <stop stopColor="#FF6B35" stopOpacity="1" />
              <stop offset="32.5%" stopColor="#FF8C42" stopOpacity="1" />
              <stop offset="65%" stopColor="#FFB347" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
            </motion.linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  )
})

BackgroundBeams.displayName = "BackgroundBeams"
