import { body, validationResult } from 'express-validator'

export const schemeCheck = [
  body('name', 'Name cannot be empty').not().isEmpty(),
  body('email', 'Email cannot be empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'The password length is 6 - 12.').isLength({min: 6, max: 12}),
]

export function validateParams(req, res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  } else {
    const firstErrorMsg = errors.array()[0]['msg']
    res.status(400).json({ status: 0, message: firstErrorMsg })
  }
};