import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './topup.css';
import { QRCodeCanvas } from 'qrcode.react';

const Topup = () => {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180); // Timer in seconds (3 minutes)
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showForm, setShowForm] = useState(true); // Controls visibility of the form

  // Handle amount input change
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Start the timer
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setError('Time has expired. Please try again.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Create Ezetap order and generate QR code
  const createEzetapOrder = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    setIsTimerActive(true); // Start the timer when QR code generation starts
    setShowForm(false); // Hide form elements after generating the QR code

    try {
      const requestBody = {
        amount: parseFloat(amount),
        customerMobileNumber: '8879747530', // Replace with dynamic data if needed
        customerName: 'Test', // Replace with dynamic data if needed
      };

      const response = await axios.post('/api/v1/users/generate-qr', requestBody);

      if (response.data && response.data.qrCodeUri) {
        setQrCode(response.data.qrCodeUri); // Set the QR code to render it
      } else {
        setError('Failed to generate QR code.');
      }
    } catch (err) {
      console.error('Error during QR code generation:', err);
      setError(
        `An error occurred: ${err.response?.data?.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false); // Ensure the loading spinner stops
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle Back button click
  const handleBackClick = () => {
    setShowForm(true); // Show form again
    setAmount(''); // Clear the amount input
    setQrCode(null); // Reset the QR code
    setTimer(180); // Reset the timer
    setIsTimerActive(false); // Stop the timer
    setError(''); // Clear any error message
  };

  return (
    <div className="topup-container">
      <div className="form-container">
        <h1>Top-Up</h1>
        {/* Show form only if showForm is true */}
        {showForm && (
          <>
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
            <button
              onClick={createEzetapOrder}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Generating QR...' : 'Generate QR Code'}
            </button>
          </>
        )}
        {/* Display QR Code, Amount, and Timer when the QR Code is generated */}
        {!showForm && qrCode && (
          <div className="qr-code-container">
            <h3>Scan this QR Code to complete your payment:</h3>
            <QRCodeCanvas value={qrCode} />
            <h4>Amount: ₹{amount}</h4>
            {/* Display the amount */}
            <div className="timer-container">
              <h4>Time Remaining: {formatTime(timer)}</h4>
            </div>
            {/* Back button to return to the form */}
            <button onClick={handleBackClick} className="back-btn">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topup;
