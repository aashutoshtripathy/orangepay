import React, { useState } from 'react';
import axios from 'axios';
import './topup.css';

const Topup = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle amount input change
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Create Ezetap order and generate QR code
  const createEzetapOrder = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    const requestBody = {
      amount: parseFloat(amount),
      appKey: process.env.REACT_APP_EZETAP_APP_KEY || '74820c5e-7ed9-401c-bfcd-9bd47d525ae6',
      customerMobileNumber: '8879747530', // Replace with dynamic customer data if needed
      customerName: 'Test', // Replace with dynamic customer name if needed
      externalRefNumber: `OP${Date.now()}`, // Unique reference number
      username: '9810698100',
      checksum: generateChecksum(amount), // Attach checksum
    };

    try {
      const response = await axios.post(  
        'eze/api/2.0/merchant/upi/qrcode/generate', // Corrected API URL
        requestBody
      );

      if (response.data && response.data.qrCodeUri) {
        setQrCode(response.data.qrCodeUri); // Assuming qrCode is Base64 or URL
      } else {
        setError('Failed to generate QR code.');
      }
    } catch (err) {
      console.error("Error during QR code generation:", err); // Log full error
      setError(`An error occurred: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoading(false); // Ensure the loading spinner stops
    }
  };

  // Simple checksum generation example (implement it based on Ezetap's documentation)
  const generateChecksum = (amount) => {
    const secretKey = 'your_secret_key'; // Use your secret key securely
    // You might need to replace this with the actual algorithm (MD5, SHA256) based on Ezetap's requirements
    return `${amount}_${secretKey}`;
  };

  return (
    <div className="topup-container">
      <div className="form-container">
        <h1>Top-Up</h1>
        <div className="input-container">
          <label htmlFor="amount">Amount (INR): </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="input-field"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button onClick={createEzetapOrder} disabled={loading} className="submit-btn">
          {loading ? 'Generating QR...' : 'Generate QR Code'}
        </button>

        {qrCode && (
  <div className="qr-code-container">
    <h3>Scan this QR Code to complete your payment:</h3>
    <img
      src={qrCode.startsWith('http') ? qrCode : `data:image/png;base64,${qrCode}`}
      alt="UPI QR Code"
      className="qr-code"
    />
  </div>
        )}
      </div>
    </div>
  );
};

export default Topup;
