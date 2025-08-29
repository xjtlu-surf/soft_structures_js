import React, { useEffect, useRef } from 'react'

interface DandelionProps {
  x: number // 百分比，0-100
  y: number // 百分比，0-100
  duration?: number // 飘动动画时长（秒）
  delay?: number // 动画延迟（秒）
}

function randomSign() {
  return Math.random() > 0.5 ? 1 : -1
}

export default function Dandelion({ x, y, duration = 12, delay = 0 }: DandelionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      // 随机左右漂移和旋转
      const dx = randomSign() * (20 + Math.random() * 40) // -60~+60vw
      const dy = -60 - Math.random() * 30 // -60~-90vh
      const rot = randomSign() * (30 + Math.random() * 60)
      ref.current.animate([
        { transform: `translate(-50%, -50%) translate(0px, 0px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(-50%, -50%) translate(${dx}vw, ${dy}vh) rotate(${rot}deg)`, opacity: 0.7 }
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out',
      })
    }
  }, [duration, delay])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: `${y}%`,
        pointerEvents: 'none',
        zIndex: 0,
        width: 40,
        height: 40,
      }}
    >
      <svg viewBox="0 0 40 40" width={40} height={40} fill="none">
        {/* 蒲公英种子杆 */}
        <line x1="20" y1="20" x2="20" y2="38" stroke="#bfa76f" strokeWidth="1.2" />
        {/* 蒲公英绒毛 */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16
          const rad = (angle * Math.PI) / 180
          const x2 = 20 + 13 * Math.cos(rad)
          const y2 = 20 + 13 * Math.sin(rad)
          return <line key={i} x1="20" y1="20" x2={x2} y2={y2} stroke="#e0e0e0" strokeWidth="1" />
        })}
        {/* 蒲公英种子中心 */}
        <circle cx="20" cy="20" r="3.2" fill="#f8f8f8" stroke="#bfa76f" strokeWidth="0.7" />
      </svg>
    </div>
  )
} 