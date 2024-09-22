import dotenv from 'dotenv'
import Network from '../network'
import Mongoose from '../mongoose';

dotenv.config()


let mInstance = null
let mCoinList = []
let mLastCoinListUpdateTime = null

class Worker {
  constructor() {
    if (!mInstance) {
      mInstance = this
      Mongoose.connect()
    }
    return mInstance
  }
}

export default new Worker()
