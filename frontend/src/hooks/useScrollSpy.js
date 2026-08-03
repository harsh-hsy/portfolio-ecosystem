import { useEffect, useState } from 'react'

export function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(() => {
    const hashId = window.location.hash.slice(1)
    return hashId || ids[0]
  })

  useEffect(() => {
    if (!ids.length) return undefined

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const currentSection = entries.find((entry) => entry.isIntersecting)
      if (!currentSection) return
      const nextId = currentSection.target.id
      setActiveId((current) => (current === nextId ? current : nextId))
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    })
    const updateFromHash = () => {
      const hashId = window.location.hash.slice(1)
      if (ids.includes(hashId)) setActiveId(hashId)
    }

    sections.forEach((section) => observer.observe(section))
    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', updateFromHash)
    }
  }, [ids])

  return activeId
}
