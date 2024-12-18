import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import crc from "crc";
import util from "util"; // Node.js utility for inspecting objects

// Load environment variables for base URL and checksum key
const EZETAP_BASE_URL = process.env.EZETAP_BASE_URL || "https://demo.ezetap.com";
const EZETAP_CHECKSUM_KEY = process.env.EZETAP_CHECKSUM_KEY || "6JdtQv2u7oUw7EWziYeyoewJ"; // Replace with your checksum key

// Function to generate checksum
const generateChecksum = (amount) => {
    try {
        return crc.crc32(`${amount}${EZETAP_CHECKSUM_KEY}`).toString(16);
    } catch (error) {
        console.error("Error generating checksum:", error.message);
        throw new Error("Failed to generate checksum");
    }
};

// Function to safely stringify error objects
const safeStringifyError = (error) => {
    // Filter out circular references like socket and parser
    const cleanError = { ...error };

    // Remove response configuration to avoid circular structure
    if (cleanError.response && cleanError.response.config) {
        cleanError.response.config = {};  // Remove config to prevent circular reference
    }

    // Check if the error is Axios-specific and remove circular structures from the response
    if (cleanError.isAxiosError) {
        // Remove circular references like `socket` and `parser` from the Axios error response
        cleanError.response = { 
            ...cleanError.response, 
            socket: undefined, 
            parser: undefined,
            request: undefined, // Avoid including the full request object (which could be large)
        };
    }

    // Use util.inspect to get a safe string representation of the error object
    return util.inspect(cleanError, { depth: null, colors: false });
};


// Function to create Ezetap order
const generateChecksums = (amount) => {
    // Implement checksum generation logic (this could be a hash or specific format as per Ezetap API)
    // Example: hashing amount and some secret key
    const secretKey = 'your_secret_key'; // Replace with your actual secret key
    return `${amount}_${secretKey}`; // Simple example, but ensure to follow the exact format Ezetap expects
};

// Function to create an Ezetap order
const createEzetapOrder = async (amount, customerName, phone) => {
    const checksum = generateChecksum(amount); // Generate checksum for the amount

    // Prepare the options to send in the request body
    const options = {
        amount: amount, // Amount in rupees
        customerName: customerName, // Customer name
        phone: phone, // Customer phone number
        checksum: checksum, // Generated checksum
    };

    try {
        // Send POST request to initiate payment via Ezetap API
        const response = await axios.post('https://demo.ezetap.com/api/2.0/merchant/upi/qrcode/generate', options);

        // Check if the API responds with QR Code data
        if (response.data && response.data.qrCode) {
            console.log("QR Code:", response.data.qrCode); // You can log or return the QR code string
            return response.data; // Return the response containing QR code and order details
        } else {
            throw new Error("QR Code not generated in the response.");
        }
    } catch (error) {
        // Log error with specific details without causing circular reference
        console.error("Error during Ezetap order creation:");

        if (error.response) {
            // Log the details of the response without trying to stringify the entire error object
            const { data, status } = error.response;
            console.error(`Ezetap API Error (${status}):`, data);
            const description = data?.error?.description || "Unknown API error";
            throw new Error(`Ezetap API error: ${description}`);
        } else if (error.request) {
            // If no response was received
            console.error("No response received from Ezetap API:", error.request);
            throw new Error("No response received from Ezetap API.");
        } else {
            // For other types of errors (like network issues or Axios configuration errors)
            console.error("Error details:", error.message);
            throw new Error("Error creating Ezetap order: " + error.message);
        }
    }
};



// Function to handle payment initiation (via Ezetap)
const initiateEzetapPayment = asyncHandler(async (req, res) => {
    const { amount, customerName, phone } = req.body; // Extract details from request body

    // Log input for debugging
    console.log("Payment initiation request:", { amount, customerName, phone });

    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount provided" });
    }
    if (!customerName || !phone) {
        return res.status(400).json({ error: "Customer name and phone are required" });
    }

    try {
        // Call the function to create an Ezetap order
        const paymentResponse = await createEzetapOrder(amount, customerName, phone);

        // Log the response for debugging
        console.log("Ezetap Payment Response:", paymentResponse);

        // Handle response and send it back to the client
        if (paymentResponse && paymentResponse.status === "success") {
            return res.json({
                message: "Payment initiated successfully",
                data: paymentResponse,
            });
        } else {
            console.error("Payment initiation failed:", paymentResponse);
            return res.status(400).json({
                error: "Payment initiation failed",
                details: paymentResponse || "Invalid response from Ezetap",
            });
        }
    } catch (error) {
        console.error("Error initiating payment:", safeStringifyError(error));

        // Return detailed error response
        return res.status(500).json({
            error: "An error occurred while initiating payment",
            details: error.message || "Unknown error",
        });
    }
});

export { initiateEzetapPayment, createEzetapOrder };
