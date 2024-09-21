import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'; // Adjust the import path as needed
import {ApiResponse} from '../utils/ApiResponse.js'; // Adjust the import path as needed
import { Invoice } from '../model/Invoice.model.js';  // If using ES modules


import mongoose from "mongoose";



const processPayment = asyncHandler(async (req, res) => {
  const {
    userId, consumerId, amount, paymentMethod,
  } = req.body;

  // Log the request body for debugging
  console.log('Request Body:', req.body);

  // Validate the request body
  // if (!userId || !consumerId || !amount || !paymentMethod || !CANumber || !InvoiceNO || !BillMonth || !latitude || !longitude || !ConsumerMobileNo || !LoginId) {
  //   console.error('Missing required fields:', { userId, consumerId, meterId, amount, paymentMethod });
  //   return res.status(400).json(new ApiError(400, "Missing required fields"));
  // }

  try {
    console.log(`Processing payment for userId: ${userId}, amount: ${amount}`);

    const marginRate = 0.035; // 3.5% margin
    const marginAmount = amount * marginRate / (1 + marginRate); // Extract margin
    const originalAmount = amount - marginAmount; // Deduct margin to get original amount

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.error('Wallet not found for userId:', userId);
      return res.status(404).json(new ApiError(404, "Wallet not found"));
    }

    // Check if there is sufficient balance
    if (wallet.balance < originalAmount) {
      console.error('Insufficient balance. Wallet balance:', wallet.balance, 'Requested amount:', amount);
      return res.status(400).json(new ApiError(400, "Insufficient balance"));
    }

    // Log before deducting amount from wallet
    console.log(`Deducting ${originalAmount} from wallet. Original balance: ${wallet.balance}`);

    wallet.balance -= originalAmount;
    await wallet.save();

    // Log after wallet deduction
    console.log(`Wallet balance updated. New balance: ${wallet.balance}`);

    // Create invoice record with additional fields
    const invoice = new Invoice({
      CANumber:consumerId,
      InvoiceNO: `INV-${userId}-${Date.now()}`,
      BillMonth:consumerId,
      TxnId: `TXN-${userId}-${Date.now()}`,
      PaymentMode: paymentMethod.toUpperCase(),
      PaymentStatus: 'Pending',
      CreatedBy: userId,
      PaidAmount: originalAmount,
      BillPostStatus: 'Pending',
      BillAmount: amount,
      location: { userId, userId },
      ConsumerMobileNo: userId,
      LoginId:userId,
      paymentDate: new Date(),
      latitude:userId,
      longitude:userId,
    });

    await invoice.save();

    console.log(`Invoice record created. Invoice ID: ${invoice._id}`);

    // Update payment status to success after saving the initial record
    invoice.PaymentStatus = 'Completed';
    await invoice.save();

    console.log(`Invoice payment status updated to Completed. Invoice ID: ${invoice._id}`);

    return res.status(200).json(new ApiResponse(200, invoice, "Payment processed successfully"));

  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json(new ApiError(500, "An error occurred while processing the payment"));
  }
});



const getPayment = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: 'Invalid userId' });
  }

  try {
      const payment = await Invoice.find({ userId }).exec();
      
      if (!payment) {
          return res.status(404).json({ success: false, message: 'Wallet not found' });
      }

      console.log("Fetched wallet balance:", payment);

      return res.status(200).json({ success: true, balance: payment });
      
  } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


export { processPayment, getPayment };

