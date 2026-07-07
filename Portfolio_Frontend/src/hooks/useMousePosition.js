import { useEffect, useState } from 'react'

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const update = (event) => setPosition({ x: event.clientX, y: event.clientY })
    window.addEventListener('pointermove', update)
    return () => window.removeEventListener('pointermove', update)
  }, [])

  return position
}
