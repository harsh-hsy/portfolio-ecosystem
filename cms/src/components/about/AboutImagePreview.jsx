import { useState } from 'react'

function AboutImagePreview({ source, alt }) {
  const [hasError, setHasError] = useState(false)

  if (!source || hasError) {
    return <span>{hasError ? 'Image unavailable' : 'Image preview'}</span>
  }

  return <img src={source} alt={alt} onError={() => setHasError(true)} />
}

export default AboutImagePreview
