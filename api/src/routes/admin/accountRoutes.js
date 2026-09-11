import bcrypt from 'bcryptjs'
import { Router } from 'express'

import { User } from '../../models/User.js'
import {
  formatDateOfBirth,
  parseDateOfBirth,
  validateAccountEmail,
  validateAccountName,
  validatePhone,
} from '../../validation/account.js'

const router = Router()

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    dateOfBirth: formatDateOfBirth(user.dateOfBirth),
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    passwordChangedAt: user.passwordChangedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

router.get('/me', (req, res) => {
  res.json({ user: serializeUser(req.user) })
})

router.get('/account', (req, res) => {
  res.json({ user: serializeUser(req.user) })
})

router.put('/account', async (req, res) => {
  const { name, email, phone, dateOfBirth } = req.body
  const normalizedName = validateAccountName(name)
  const normalizedEmail = validateAccountEmail(email)
  const normalizedPhone = validatePhone(phone)
  const normalizedDateOfBirth = parseDateOfBirth(dateOfBirth)
  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  })

  if (existingUser) {
    res.status(409).json({ message: 'Email is already in use' })
    return
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      dateOfBirth: normalizedDateOfBirth,
    },
    { returnDocument: 'after', runValidators: true },
  ).select('-passwordHash')

  res.json({ user: serializeUser(user) })
})

router.put('/account/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Current password and new password are required' })
    return
  }

  if (String(newPassword).length < 8) {
    res.status(400).json({ message: 'New password must be at least 8 characters' })
    return
  }

  const user = await User.findById(req.user._id)
  if (!user || !(await user.verifyPassword(currentPassword))) {
    res.status(401).json({ message: 'Current password is incorrect' })
    return
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12)
  user.passwordChangedAt = new Date()
  await user.save()

  res.json({
    message: 'Password updated successfully',
    passwordChangedAt: user.passwordChangedAt,
  })
})

export default router
