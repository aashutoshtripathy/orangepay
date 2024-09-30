import mongoose from "mongoose";
import { Schema } from "mongoose";



const rewardSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rewardAmount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  rewardDate: {
    type: Date,
    default: Date.now,
  },
});

export const Reward = mongoose.model('Reward', rewardSchema);

