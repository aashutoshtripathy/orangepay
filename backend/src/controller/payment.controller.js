import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'; // Adjust the import path as needed
import { ApiResponse } from '../utils/ApiResponse.js'; // Adjust the import path as needed
import { Invoice } from '../model/Invoice.model.js';  // If using ES modules


import mongoose from "mongoose";
import { Register } from "../model/Register.model.js";
import { TransactionHistory } from "../model/TransactionHistory.model.js";
import { Sbdata } from "../model/Sbdata.model.js";
import { Reward } from "../model/Reward.model.js";
import { WalletTransaction } from "../model/WalletTransaction.model.js";
import { WalletOpeningClosing } from "../model/WalletOpeningClosing.model.js";


const processPayment = asyncHandler(async (req, res) => {
  const {
    userId, consumerId, amount, paymentMethod, billpoststatus, divisionName, subDivision, consumerName ,invoiceNo,billMonth,brandCode,dueDate,receiptNo,paymentdate,remark,transactionId
  } = req.body;

  // Log the request body for debugging
  console.log('Request Body:', req.body);


  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  // Query for recent payment attempts within the last 30 minutes
  const recentPaymentAttempt = await Payment.findOne({
    userId,
    canumber: consumerId,
    paidamount: amount,
    createdon: { $gte: thirtyMinutesAgo }
  });

  // Block the new payment if a recent attempt exists
  if (recentPaymentAttempt) {
    console.error(`Payment blocked: Recent payment attempt found for consumerId: ${consumerId} with the same amount: ${amount}`);
    return res.status(400).json({
      statusCode: 400,
      data: null,
      success: false,
      error: ["Payment blocked. A payment with the same amount has already been made for this consumer within the last 30 minutes."]
    });
  }


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



    const marginRate = users.margin / 100;
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
    const user = await Register.findOne({ _id: userId });

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
      invoicenumber: invoiceNo,
      billmonth: billMonth,
      transactionId: transactionId,
      refrencenumber: ``,
      bankid: '', 
      paymentmode: paymentMethod,
      paymentstatus: 'Success', 
      createdon: Date.now(),
      createdby: wallet.uniqueId, 
      billpoststatus: billpoststatus, 
      paidamount: amount,
      reciptno: receiptNo, 
      billposton: paymentdate, 
      getway: 'wallet', 
      cardtxntype: 'N/A', 
      terminalid: 0, 
      mid: 'wallet', 
      nameoncard: "N/A", 
      remarks: remark, 
      loginid: '',
      rrn: '', 
      vpa: '',  
      billamount: amount, 
      paymentdate: paymentdate, 
      latitude: '', 
      longitude: '', 
      fetchtype: '', 
      consumermob: '', 
      ltht: '', 
      duedate: dueDate, 
      brandcode: brandCode, 
      division: divisionName, 
      subdivision: subDivision, 
      consumerName: consumerName,

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



    invoice.balanceAfterDeduction = balanceBeforeDeduction; // Set balance after deduction
    invoice.balanceAfterCommission = wallet.balance; // Set balance after commission
    invoice.paymentstatus = 'Success';
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


    const existingSbdata = await Sbdata.findOne({ ConsumerId: consumerId });
    if (!existingSbdata) {
      const sbdataEntry = new Sbdata({
        ConsumerId: consumerId,
        ConsumerName:consumerName,
        amount,
        paymentMethod,
        DivisionName:divisionName,
        SubDivision:subDivision,
        consumerName,
        invoiceNo,
        billMonth,
        brandCode,
        dueDate,
        paymentdate,
        remark,
        CreatedOn: Date.now(),
      });
      await sbdataEntry.save();
      console.log(`Data saved to sbdata collection. CANumber: ${consumerId}`);
    } else {
      console.log(`Data not saved to sbdata collection. CANumber ${consumerId} already exists.`);
    }


    // Convert payment date to just the date portion (without time)
    const paymentDate = new Date(invoice.paymentdate);
    const paymentDateKey = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate()); // Get the date only

    // Check if there's already a wallet entry for that user and date
    let walletOpeningClosing = await WalletOpeningClosing.findOne({
      userId: wallet.userId,
      date: { $gte: paymentDateKey, $lt: new Date(paymentDateKey.getTime() + 86400000) } // From start of the day to end of the day
    });

    if (!walletOpeningClosing) {
      // This is the first transaction of the day, store both opening and closing balance
      walletOpeningClosing = new WalletOpeningClosing({
        userId: wallet.userId,
        uniqueId: wallet.uniqueId,
        openingBalance: invoice.balanceAfterDeduction, // First time storing the opening balance
        closingBalance: invoice.balanceAfterCommission,
        date: paymentDate, // Store the payment date
      });
      await walletOpeningClosing.save(); // Save the new document
      console.log(`New wallet opening/closing record created for date: ${paymentDate.toISOString().split('T')[0]}`);
    } else {
      // If the record exists, update the existing row's closing balance
      walletOpeningClosing.closingBalance = invoice.balanceAfterCommission;
      await walletOpeningClosing.save(); // Save the updated document
      console.log(`Closing balance updated for existing record on date: ${paymentDate.toISOString().split('T')[0]}`);
    }





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
    // Validate the userId from the wallet
    const payment = await WalletTransaction.find({ userId: userId }).exec();
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




const WalletReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log("Invalid userId format:", userId);
    return res.status(400).json({ success: false, message: 'Invalid userId' });
  }


  try {
    // Validate the userId from the wallet
    const payment = await WalletOpeningClosing.find({ userId: userId }).exec();
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




const TopupReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid userId format:", userId);
    return res.status(400).json({ 
      success: false, 
      message: "Invalid userId format" 
    });
  }

  try {
    console.log("Valid userId:", userId);

    // Fetch wallet transactions of type 'credit' for the user
    const payments = await WalletTransaction.find({
      userId, 
      "transactions.type": "credit" // Filters transactions of type 'credit'
    }).exec();

    // Check if payments exist
    if (!payments || payments.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No credit transactions found for the user" 
      });
    }

    console.log("Fetched credit transactions:", payments);

    // Filter out only the credit transactions from the nested array
    const creditTransactions = payments.map(payment => {
      return {
        ...payment.toObject(),
        transactions: payment.transactions.filter(transaction => transaction.type === "credit")
      };
    });

    // Respond with success and the filtered data
    return res.status(200).json({ 
      success: true, 
      balance: creditTransactions 
    });

  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
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
    const payment = await Payment.find({ id: userId }).exec();
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



const repostingBill = asyncHandler(async (req, res) => {
  try {
    // Fetch all payment records
    const payments = await Payment.find({billpoststatus: "Pending"}).exec(); 

    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: 'No payments found' });
    }

    console.log("Fetched all payments:", payments);

    // Return the response with all the payments data
    return res.status(200).json({ success: true, data: payments });

  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




const getTotalPayments = asyncHandler(async (req, res) => {
  try {
    // Fetch all payment records
    const payments = await Payment.find().exec(); 

    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: 'No payments found' });
    }

    console.log("Fetched all payments:", payments);

    // Return the response with all the payments data
    return res.status(200).json({ success: true, data: payments });

  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


const getTotalPaymentss = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start Date and End Date are required.' });
    }

    const formattedStartDate = moment.tz(startDate, 'Asia/Kolkata').startOf('day').toDate();
    const formattedEndDate = moment.tz(endDate, 'Asia/Kolkata').endOf('day').toDate();

    // Debugging logs
    console.log("Received Query Params:", { startDate, endDate });
    console.log("Formatted Dates (UTC):", { formattedStartDate, formattedEndDate });

    // Query the database
    const query = {
      paymentdate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    console.log("Query:", query);


    const payments = await Payment.find(query).exec();

    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: 'No payments found for the selected dates.' });
    }

    console.log("Fetched payments:", payments);


    return res.status(200).json({ success: true, data: payments });
    
  } catch (error) {
    console.error("Error fetching payments:", error);
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
    const payment = await Payment.find({ id: userId }).exec();
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
    console.log("conbsumeryuwegj", consumerId)
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




const insertBillDetails = asyncHandler(async (req, res) => {
  const { consumerId, consumerName, address, mobileNo, divisionName, subDivision, companyName, billMonth, amount, dueDate, invoiceNo } = req.body;

  try {
    // Check if the consumer ID already exists in the Sbdata collection
    const existingConsumer = await Sbdata.findOne({ consumerId });

    // If it exists, return a 409 status with a message
    if (existingConsumer) {
      return res.status(409).json({ message: 'Consumer ID already exists' });
    }

    // If it does not exist, create a new record with the consumer ID
    const newConsumer = await Sbdata.create({

      ConsumerId: consumerId,
      ConsumerName: consumerName,
      Address: address,
      MobileNo: mobileNo,
      DivisionName: divisionName,
      SubDivision: subDivision,
      PostCode,
      EmailId,
      Traiff,
      Section,
      SancLoad,
      ContractDemand,
      companyName,
      billMonth,
      amount,
      dueDate,
      invoiceNo,
      CreatedOn: dueDate,
      Status: "",
    });



    await newConsumer.save();

    // Return a success message and the newly created consumer data
    res.status(201).json({ message: 'Consumer ID saved successfully', consumer: newConsumer });
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



export { processPayment, getPayment, repostingBill , getTotalPayments, getTotalPaymentss, WalletReport,TopupReport, getAllSbdata, getDailyBalance, BiharService, getPayments, getPaymentss, fetchReward, insertBillDetails, getTotalBalance };

