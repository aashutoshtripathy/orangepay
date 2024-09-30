import { asyncHandler } from "../utils/asyncHandler.js";
import Razorpay from "razorpay";




const razorpay = new Razorpay({
    key_id: "rzp_test_GcZZFDPP0jHtC4",
    key_secret: "6JdtQv2u7oUw7EWziYeyoewJ"
});

// Function to create Razorpay order
const createOrder = async (amount, currency) => {
    const options = {
        amount: amount,
        currency,
        receipt: `receipt_order_${new Date().getTime()}`,
        payment_capture: 1, // Auto-capture payment
    };

    return await razorpay.orders.create(options);
};

// Function to handle payment initiation
const initiateEzetapPayment = asyncHandler(async (req, res) => {
    // Hardcoded values for amount and currency
    const amount = req.body.amount; // Amount in rupees
    const currency = 'INR'; // Currency code
    console.log(req.body);

    try {
        const order = await createOrder(amount, currency);

        // Log the order response for debugging
        console.log('Razorpay Order Response:', order);

        // Handle success case
        if (order && order.id) {
            res.json(order); // Send the order details back to the client
        } else {
            console.error('Payment initiation failed response:', order);
            res.status(400).json({ error: 'Payment initiation failed' });
        }
    } catch (error) {
        // Improved error logging
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Server Error:', error.response.data, error.response.status);
            res.status(error.response.status).json({
                error: error.response.data || 'Unknown server error occurred'
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No Response from server:', error.request);
            res.status(500).json({ error: 'No response from Razorpay server' });
        } else {
            // Something else happened while setting up the request
            console.error('Request Setup Error:', error.message);
            res.status(500).json({ error: `Request setup failed: ${error.message}` });
        }
    }
});





export { initiateEzetapPayment };
