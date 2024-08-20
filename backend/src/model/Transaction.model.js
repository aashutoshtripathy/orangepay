import mongoose from "mongoose";
import { Schema } from "mongoose";



const transactionSchema = new Schema({
    transaction_id: { type: Number, required: true, unique: true },
    reference_number: { type: Number, required: true },
    lower_level: { type: Number, required: true },
    upper_level: { type: Number, required: true },
    transaction_datetime: { type: Date, required: true },
    service_name: { type: String, required: true },
    amount_before_due_date: { type: Number, required: true },
    request_amount: { type: Number, required: true },
    total_service_charge: { type: Number, default: 0 },
    total_commission: { type: Number, default: 0 },
    net_amount: { type: Number, required: true },
    action_on_amount: { type: String, enum: ['Dr', 'Cr', 'Dr/Cr'], required: true },
    status: { type: String, enum: ['Success', 'FAILURE', 'Fail'], required: true },
    final_bal_amount: { type: Number, required: true },
    update_date: { type: Date, required: true },
    portal_name: { type: String, required: true },
    gst_charge: { type: Number, default: 0 }
},
{
    timestamps:true
});

export const Transaction = mongoose.model('Transaction', transactionSchema);

