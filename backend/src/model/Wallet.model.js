import mongoose from "mongoose";
import { Schema } from "mongoose";



const walletSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uniqueId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    transactions: [
      {
        amount: Number,
        type: { type: String, enum: ['credit', 'debit'], required: true },
        date: { type: Date, default: Date.now },
        description: String
      }
    ]
  });



  export const Wallet = mongoose.model('Wallet', walletSchema);