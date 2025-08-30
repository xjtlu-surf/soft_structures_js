import React from 'react'

export default function Background() {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'url(/soft_structures_js/back.png) center center / cover no-repeat',
        filter: 'contrast(1.15) saturate(1.2) brightness(1.05)',
      }}
    />
  )
} 