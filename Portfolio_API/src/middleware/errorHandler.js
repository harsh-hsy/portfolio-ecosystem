export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' })
}

export function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500
  res.status(statusCode).json({
    message: error.message || 'Server error',
  })
}
