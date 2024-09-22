import Mongoose from "../../../mongoose"

export function authentication(req, res, next) {
    if (!req.headers.chat_token) {
        res.status(403).json({ status: 0, message: "Invalid credentials." })
    } else {
        Mongoose.UserModel.find({ $or:[{api_token: req.headers.chat_token}] }).select({ "_id": 1, "name": 1, "email": 1 }).then((result) => {
            if (result.length <= 0) {
                res.status(403).json({ status: 0, message: "Invalid credentials." })
            } else {
                req.auth_user = result[0];
                next();
            }
        }).catch((err) => {
            res.status(500).send(err);
        })
    }
}