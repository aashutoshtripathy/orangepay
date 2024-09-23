import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'; // Adjust the import path as needed
import {ApiResponse} from '../utils/ApiResponse.js'; // Adjust the import path as needed
import { Invoice } from '../model/Invoice.model.js';  // If using ES modules


import mongoose from "mongoose";
import { Register } from "../model/Register.model.js";
import { TransactionHistory } from "../model/TransactionHistory.model.js";



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


  if (paymentMethod.toLowerCase() !== 'wallet') {
    return res.status(400).json(new ApiError(400, "Invalid payment method. Only 'wallet' is accepted."));
  }


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
    const user = await Register.findOne({ _id:userId });

    // Check if there is sufficient balance
    if (wallet.balance < originalAmount) {
      console.error('Insufficient balance. Wallet balance:', wallet.balance, 'Requested amount:', amount);
      return res.status(400).json(new ApiError(400, "Insufficient balance"));
    }

    // Log before deducting amount from wallet
    console.log(`Deducting ${originalAmount} from wallet. Original balance: ${wallet.balance}`);

    wallet.balance -= originalAmount;
    await wallet.save();

    console.log(`Wallet balance updated. New balance: ${wallet.balance}`);

    const invoice = new Payment({
      id: userId,  
      userId: wallet.uniqueId,
      canumber: consumerId,
      invoicenumber:"",
      billmonth:"Pending",
      transactionId: `TXN-${Date.now()}`,
      refrencenumber: ``,
      bankid: '', // Assuming bank id is not available at this point, set it as empty or fetch if applicable
      paymentmode: paymentMethod,
      paymentstatus: 'Pending', // 1 for 'Pending'
      createdon: Date.now(),
      createdby: wallet.uniqueId, // Assuming the user creating the payment is also `createdby`
      billpoststatus: 'Pending', // 'Bill Payment', 'Recharge', 'Other Services' depending on your use case
      paidamount: originalAmount,
      reciptno: 'Pending', // 'Success', 'Pending', 'Failed'
      billposton: Date.now(), // Set to current date or leave empty initially
      getway: 'wallet', // Gateway processing time, set as per requirement
      cardtxntype: 'N/A', // Assuming it's not applicable, set as N/A or applicable value
      terminalid: 0, // Assuming no terminal involved, set default as 0 or actual terminal id if present
      mid: 'wallet', // Assuming the default MID is ezytap, change accordingly
      nameoncard: "N/A", // Change if name on card is needed (e.g., fetch from request body)
      remarks: '', // Leave empty initially or populate if remarks are provided
      loginid:'', // Passed from request body
      rrn: '', // Retrieval Reference Number, leave empty initially or fetch as required
      vpa: '', // Virtual Payment Address, empty or populated if applicable
      billamount: amount, // Original bill amount
      paymentdate: new Date(), // Current date for payment processing
      latitude:'', // From request body
      longitude:'', // From request body
      fetchtype: '', // Set fetch type if applicable
      consumermob:'', // Consumer mobile number from request body
      ltht: '', // Low tension/high tension value, populate if applicable
      duedate: '', // Populate the due date if available, otherwise leave empty
      brandcode: user.discom || '', // If brand code is available, populate, otherwise leave empty
      division: '', // Populate division if applicable
      subdivision: '' // Populate subdivision if applicable
    });
    

    await invoice.save();

    console.log(`Invoice record created. Invoice ID: ${invoice._id}`);

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
      const payment = await Payment.find({ id:userId }).exec();
      
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

