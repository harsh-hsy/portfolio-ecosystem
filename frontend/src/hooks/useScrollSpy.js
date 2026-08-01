import { useEffect, useState } from 'react'

export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(() => {
    const hashId = window.location.hash.slice(1)
    return hashId || ids[0]
  })

  useEffect(() => {
    if (!ids.length) return undefined

    let frameId = 0

    const updateActiveSection = () => {
      frameId = 0
      const marker = Math.min(window.innerHeight * 0.3, 220)
      let nextId = ids[0]

      ids.forEach((id) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= marker) nextId = id
      })

      setActiveId((current) => (current === nextId ? current : nextId))
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('hashchange', scheduleUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', scheduleUpdate)
    }
  }, [ids])

  return activeId
}
