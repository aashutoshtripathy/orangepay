import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'; // Adjust the import path as needed
import {ApiResponse} from '../utils/ApiResponse.js'; // Adjust the import path as needed

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

    // Further logging to see if there are any issues
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.error('Wallet not found for userId:', userId);
      throw new ApiError(404, "Wallet not found");
    }

    if (wallet.balance < amount) {
      console.error('Insufficient balance. Wallet balance:', wallet.balance, 'Requested amount:', amount);
      throw new ApiError(400, "Insufficient balance");
    }

    console.log('Deducting amount from wallet. Original balance:', wallet.balance);

    wallet.balance -= amount;
    await wallet.save();

    console.log('Creating payment record...');
    const payment = new Payment({
      transactionId: `TXN-${Date.now()}`,
      referenceNumber: `REF-${Date.now()}`,
      consumerId,
      meterId,
      transactionDateTime: new Date(),
      serviceName: "Bill Payment",
      requestAmount: amount,
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


export { processPayment };

