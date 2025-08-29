import React from 'react'

interface ButterflyProps {
  x: number // 百分比，0-100
  y: number // 百分比，0-100
  angle?: number // 旋转角度
}

export default function Butterfly({ x, y, angle = 0 }: ButterflyProps) {
  return (
    <svg
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: `${y}%`,
        width: 60,
        height: 60,
        pointerEvents: 'none',
        transform: `translate(-50%,-50%) rotate(${angle}deg)`
      }}
      viewBox="0 0 60 60"
      fill="none"
    >
      {/* 蝴蝶身体 */}
      <ellipse cx="30" cy="35" rx="4" ry="18" fill="#2d3a4b" />
      {/* 左上翅膀 */}
      <path d="M30 35 Q10 10 30 10 Q40 20 30 35" fill="#4fc3f7" stroke="#1976d2" strokeWidth="2" />
      {/* 右上翅膀 */}
      <path d="M30 35 Q50 10 30 10 Q20 20 30 35" fill="#4fc3f7" stroke="#1976d2" strokeWidth="2" />
      {/* 左下翅膀 */}
      <path d="M30 45 Q8 55 30 55 Q36 50 30 45" fill="#81d4fa" stroke="#1976d2" strokeWidth="1.5" />
      {/* 右下翅膀 */}
      <path d="M30 45 Q52 55 30 55 Q24 50 30 45" fill="#81d4fa" stroke="#1976d2" strokeWidth="1.5" />
      {/* 触角 */}
      <path d="M30 18 Q28 5 24 8" stroke="#2d3a4b" strokeWidth="1.5" fill="none" />
      <path d="M30 18 Q32 5 36 8" stroke="#2d3a4b" strokeWidth="1.5" fill="none" />
    </svg>
  )
} 