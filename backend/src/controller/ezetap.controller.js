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
const createEzetapOrder = async (amount, customerName, phone) => {
    const checksum = generateChecksum(amount); // Generate checksum for the amount
    const options = {
        amount, // Amount in rupees
        customerName, // Customer name
        phone, // Customer phone number
        checksum, // Generated checksum
    };

    try {
        // Send POST request to Ezetap API
        const response = await axios.post(`https://demo.ezetap.com/api/initiatePayment`, options);

        // Return the response data from Ezetap
        return response.data;
    } catch (error) {
        console.error("Error during Ezetap order creation:");

        // Handle response errors
        if (error.response) {
            const { data, status } = error.response;
            console.error(`Ezetap API Error (${status}):`, data);
            const description = data?.error?.description || "Unknown API error";
            throw new Error(`Ezetap API error: ${description}`);
        }

        // Handle circular structure in non-response errors
        console.error("Error details:", safeStringifyError(error));

        // Throw error with only the message to avoid circular references
        throw new Error("Error creating Ezetap order: " + error.message);
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
