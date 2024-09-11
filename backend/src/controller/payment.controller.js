import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'; // Adjust the import path as needed
import {ApiResponse} from '../utils/ApiResponse.js'; // Adjust the import path as needed
import mongoose from "mongoose";

// Function to process the payment
const processPayment = asyncHandler(async (req, res) => {
  const { userId, consumerId, meterId, amount, paymentMethod } = req.body;

  // Log the request body for debugging
  console.log('Request Body:', req.body);

  // Validate the request body
  if (!userId || !consumerId || !meterId || !amount || !paymentMethod) {
    console.error('Missing required fields:', { userId, consumerId, meterId, amount, paymentMethod });
    throw new ApiError(400, "Missing required fields");
  }

  try {
    console.log(`Processing payment for userId: ${userId}, amount: ${amount}`);

    const marginRate = 0.035; // 3.5%
    const marginAmount = amount * marginRate / (1 + marginRate); // Extract the margin part from the total amount
    const originalAmount = amount - marginAmount; // Deduct the margin to get the amount without the margin


    // Further logging to see if there are any issues
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.error('Wallet not found for userId:', userId);
      throw new ApiError(404, "Wallet not found");
    }

    if (wallet.balance < originalAmount) {
      console.error('Insufficient balance. Wallet balance:', wallet.balance, 'Requested amount:', amount);
      throw new ApiError(400, "Insufficient balance");
    }

    console.log('Deducting amount from wallet. Original balance:', wallet.balance);

    wallet.balance -= originalAmount;
    await wallet.save();

    console.log('Creating payment record...');
    const payment = new Payment({
      userId,
      transactionId: `TXN-${Date.now()}`,
      referenceNumber: `REF-${Date.now()}`,
      consumerId,
      meterId,
      transactionDateTime: new Date(),
      serviceName: "Bill Payment",
      requestAmount: originalAmount,
      totalCommission: marginAmount,
      netAmount: amount,
      actionOnAmount: 'Dr',
      status: 'Pending',
      paymentMethod,
    });

    await payment.save();

    console.log('Payment record created. Transaction ID:', payment.transactionId);

    payment.status = 'Success';
    await payment.save();

    return res.status(200).json(new ApiResponse(200, payment, "Payment processed successfully"));

  } catch (error) {
    console.error("Error processing payment:", error);
    throw new ApiError(500, "An error occurred while processing the payment");
  }
});



const getPayment = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: 'Invalid userId' });
  }

  try {
      const payment = await Payment.find({ userId }).exec();
      
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

