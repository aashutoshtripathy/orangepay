import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'; // Adjust the import path as needed
import {ApiResponse} from '../utils/ApiResponse.js'; // Adjust the import path as needed
import { Invoice } from '../model/Invoice.model.js';  // If using ES modules


import mongoose from "mongoose";
import { Register } from "../model/Register.model.js";
import { TransactionHistory } from "../model/TransactionHistory.model.js";
import { Sbdata } from "../model/Sbdata.model.js";
import { Reward } from "../model/Reward.model.js";
import { WalletTransaction } from "../model/WalletTransaction.model.js";



const processPayment = asyncHandler(async (req, res) => {
  const {
    userId, consumerId, amount, paymentMethod, divisionName,subDivision,consumerName
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

      // Retrieve the user to get the margin rate
      const users = await Register.findOne({ _id: userId });
      if (!users) {
        console.error('User not found for userId:', userId);
        return res.status(404).json(new ApiError(404, "User not found"));
      }



    const marginRate = users.margin/100;
    const tdsRate = 0.05; // 5% TDS on commission

    const commissionAmount = amount * marginRate; // Calculate 1% commission
    const tdsAmount = commissionAmount * tdsRate; // Calculate TDS (5% of commission)
    const netCommission = commissionAmount - tdsAmount;// Deduct margin to get original amount

    // Find the user's wallet
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.error('Wallet not found for userId:', userId);
      return res.status(404).json(new ApiError(404, "Wallet not found"));
    }
    const user = await Register.findOne({ _id:userId });

    // Check if there is sufficient balance
    if (wallet.balance < amount) {
      console.error('Insufficient balance. Wallet balance:', wallet.balance, 'Requested amount:', amount);
      return res.status(400).json(new ApiError(400, "Insufficient balance"));
    }

    // Log before deducting amount from wallet
    console.log(`Deducting ${amount} from wallet. Original balance: ${wallet.balance}`);

    const balanceBeforeDeduction = wallet.balance;
    wallet.balance -= amount;
    await wallet.save();

    console.log(`Wallet balance updated. New balance: ${wallet.balance}`);

    const invoice = new Payment({
      id: userId,  
      userId: wallet.uniqueId,
      canumber: consumerId,
      invoicenumber:"",
      billmonth: "N/A",
      transactionId: `OP${Date.now()}`,
      refrencenumber: ``,
      bankid: '', // Assuming bank id is not available at this point, set it as empty or fetch if applicable
      paymentmode: paymentMethod,
      paymentstatus: 'Pending', // 1 for 'Pending'
      createdon: Date.now(),
      createdby: wallet.uniqueId, // Assuming the user creating the payment is also `createdby`
      billpoststatus: 'Pending', // 'Bill Payment', 'Recharge', 'Other Services' depending on your use case
      paidamount: amount,
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
      division: divisionName, // Populate division if applicable
      subdivision: subDivision, // Populate subdivision if applicable
      consumerName:consumerName,

      commission: commissionAmount,
      tds: tdsAmount,
      netCommission: netCommission,
    });
    

    await invoice.save();


  

    console.log(`Invoice record created. Invoice ID: ${invoice._id}`);



    // console.log(`Invoice payment status updated to Completed. Invoice ID: ${invoice._id}`);

    // return res.status(200).json(new ApiResponse(200, invoice, "Payment processed successfully"));

    wallet.balance += netCommission;
    await wallet.save();



    invoice.balanceAfterDeduction = balanceBeforeDeduction ; // Set balance after deduction
    invoice.balanceAfterCommission = wallet.balance; // Set balance after commission
    invoice.paymentstatus = 'Completed';
    await invoice.save();


    const transaction = new WalletTransaction({
      userId: wallet.userId,
      uniqueId: wallet.uniqueId,
      walletId: wallet._id,
      transactions: [ 
        {
          transactionId: invoice.transactionId, 
          canumber: invoice.canumber, 
          refrencenumber: invoice.refrencenumber, 
          bankid: "", 
          paymentmode: invoice.paymentmode, 
          paymentstatus: invoice.paymentstatus, 
          commission: invoice.netCommission,
          amount: invoice.paidamount, 
          type: 'Debit', 
          date: new Date(), 
          description: 'Bill Payment',
          openingBalance: invoice.balanceAfterDeduction, // Add the opening balance here
          closingBalance: invoice.balanceAfterCommission // Add the closing balance here
        }
      ]
    });

    await transaction.save(); 

    

    // Add the reward to the reward report
    const rewardReport = new Reward({
      userId: userId,
      rewardAmount: netCommission, // This is the net commission after TDS
      transactionId: invoice.transactionId,
      rewardDate: new Date()
    });

    await rewardReport.save();

    console.log(`Reward report created. Reward Amount: ${netCommission}, User ID: ${userId}`);

    // Return the response with commission and TDS details
    return res.status(200).json(new ApiResponse(200, {
      invoice,
      balanceAfterDeduction: balanceBeforeDeduction - amount, // Balance after deduction
      balanceAfterCommission: wallet.balance,
      commission: commissionAmount,
      tds: tdsAmount,
      netCommission
    }, "Payment processed successfully. Commission credited after TDS"));
    

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
      const payment = await WalletTransaction.find({ userId:userId }).exec();
      console.log(userId)
      
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




  const getDailyBalance = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }
  
    try {
      // Fetch all transactions for the specified user and group by date
      const dailyReport = await WalletTransaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match user
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } // Group by date
            },
            totalTransactions: { $sum: 1 }, // Count transactions per date
            totalAmount: { $sum: "$amount" } // Sum of amounts per date
          }
        },
        { $sort: { "_id": 1 } } // Sort by date ascending
      ]);
  
      // Check if any transactions were found
      if (!dailyReport || dailyReport.length === 0) {
        return res.status(404).json({ success: false, message: 'No transactions found for this user' });
      }
  
      console.log("Fetched daily report for user:", userId);
  
      return res.status(200).json({
        success: true,
        userId: userId,
        report: dailyReport,
      });
    } catch (error) {
      console.error("Error fetching daily report:", error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  







const getPayments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: 'Invalid userId' });
  }


  try {
      const payment = await Payment.find({ id:userId }).exec();
      console.log(userId)
      
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



const getPaymentss = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: 'Invalid userId' });
  }


  try {
      const payment = await Payment.find({ id:userId }).exec();
      console.log(userId)
      
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




const BiharService = asyncHandler(async (req, res) => {
  const { consumerId } = req.body;

  // Validate if consumerId is provided
  if (!consumerId) {
    return res.status(400).json({ message: 'consumerId is required' });
  }

  try {
    // Find the details in the database using the provided consumerId (adjust the field name to match your database)
    const details = await Sbdata.find({ ConsumerId: consumerId });
    console.log("conbsumeryuwegj",consumerId)
    // If no details found, return a 404 status with an error message
    if (details.length === 0) {
      return res.status(404).json({ message: 'Details not found for the provided consumerId' });
    }

    // If details are found, return them as the response
    res.status(200).json(details);
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



const fetchReward = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const rewards = await Reward.find({ userId: userId });
  if (!rewards) {
    res.status(404).json({ message: 'No rewards found for this user' });
  } else {
    res.status(200).json(rewards);
  }
});



const getTotalBalance = asyncHandler(async (req, res) => {
  try {
    // Fetch all wallet records from the database
    const wallets = await Wallet.find({}); // Retrieve all wallets

    if (!wallets || wallets.length === 0) {
      return res.status(404).json({ success: false, message: 'No wallets found' });
    }

    // Log the retrieved wallets for debugging
    console.log('Retrieved wallets:', wallets);

    // Calculate the total balance by summing up the balance field of all wallets
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    // Return the total balance
    return res.status(200).json({ success: true, totalBalance });
    
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


const getAllSbdata = asyncHandler(async (req, res) => {
  try {
    // Fetch all records from the Sbdata collection
    const allData = await Sbdata.find({});

    // If no records found, return a 404 status with a message
    if (allData.length === 0) {
      return res.status(404).json({ message: 'No data found in the Sbdata collection' });
    }

    // Return the fetched data as a response
    res.status(200).json(allData);
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



export { processPayment, getPayment , getAllSbdata , getDailyBalance , BiharService , getPayments , getPaymentss , fetchReward , getTotalBalance };

