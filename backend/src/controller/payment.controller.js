import { Payment } from "../model/Payment.model.js";
import { Wallet } from "../model/Wallet.model.js";

// Function to process the payment
const processPayment = async ({ userId, consumerId, meterId, amount, paymentMethod }) => {
  try {
    // Step 1: Find the user's wallet
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return { success: false, message: "Wallet not found" };
    }

    // Step 2: Check if the wallet balance is sufficient
    if (wallet.balance < amount) {
      return { success: false, message: "Insufficient balance" };
    }

    // Step 3: Deduct the amount from the wallet
    wallet.balance -= amount;
    await wallet.save();

    // Step 4: Create a payment record
    const payment = new Payment({
      transactionId: `TXN-${Date.now()}`,
      referenceNumber: `REF-${Date.now()}`,
      consumerId,
      meterId,
      transactionDateTime: new Date(),
      serviceName: "Other Service", // Set according to your logic
      requestAmount: amount,
      netAmount: amount,
      actionOnAmount: 'Dr',
      status: 'Pending', // Initial status
      paymentMethod,
    });

    await payment.save();

    return {
      success: true,
      message: "Payment processed successfully",
      payment,
    };

  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred", error };
  }
};


export {processPayment};