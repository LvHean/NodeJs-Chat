import { body, validationResult } from 'express-validator'
import Mongoose from "../../../mongoose"

export const schemeCheck = [
  body('receiver_id', 'Receiver id cannot be empty').not().isEmpty(),
  body('message', 'Message cannot be empty').not().isEmpty(),
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

export function validateReceiver(req, res, next) {
  Mongoose.UserModel.find({ $or:[{_id: req.body.receiver_id}] }).select({ "_id": 1, "name": 1, "email": 1 }).then((result) => {
    if (result.length <= 0) {
        res.status(403).json({ status: 0, message: "Invalid receiver." })
    } else {
        req.receiver_user = result[0];
        next();
    }
  }).catch((err) => {
      res.status(500).send(err);
  })
};