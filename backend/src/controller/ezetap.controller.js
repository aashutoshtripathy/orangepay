import { asyncHandler } from "../utils/asyncHandler.js";
import Razorpay from "razorpay";
import axios from "axios";






// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: "rzp_test_GcZZFDPP0jHtC4", // Your Razorpay key
    key_secret: "6JdtQv2u7oUw7EWziYeyoewJ" // Your Razorpay secret
});

// Function to create Razorpay order
const createOrder = async (amount, currency) => {
    const options = {
        amount: amount * 100, // Convert to paise (1 INR = 100 paise)
        currency,
        receipt: `receipt_order_${new Date()}`,
        payment_capture: 1, // Auto-capture payment
    };

    try {
        // Creating the order using Razorpay API
        const order = await razorpay.orders.create(options);

        // Return the created order details
        return order;
    } catch (error) {
        // Log the message and stack trace instead of the whole error object
        console.error('Error during Razorpay order creation:', error.message);
        console.error('Stack Trace:', error.stack);

        // Check if the error is a response from Razorpay API
        if (error.response) {
            console.error('Razorpay API Response Error:', error.response.data);
            throw new Error(`Razorpay API error: ${error.response.data.error.description}`);
        }

        // If no response, log the general error
        throw new Error('Error creating Razorpay order: ' + error.message);
    }
};

// Function to handle payment initiation
const initiateEzetapPayment = asyncHandler(async (req, res) => {
    const amount = req.body.amount; // Amount in rupees
    const currency = 'INR'; // Currency code


    console.log("amount:" ,amount)

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount provided' });
    }

    try {
        const order = await createOrder(amount, currency);

        // Log the order response for debugging
        console.log('Razorpay Order Response:', order);

        // If order creation is successful, send order details back to client
        if (order && order.id) {
            res.json(order);
        } else {
            console.error('Payment initiation failed: No order ID returned');
            res.status(400).json({ error: 'Payment initiation failed' });
        }
    } catch (error) {
        console.error('Error initiating payment:', error);

        // Improved error handling
        res.status(500).json({
            error: error.message || 'An error occurred while initiating payment',
        });
    }
});






export { initiateEzetapPayment , createOrder };
