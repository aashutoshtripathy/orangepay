import React, { useState } from 'react';

const CallMe = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can implement sending the email or processing the form submission.
    console.log("Form submitted:", { name, email, message });
    setSuccess(true);
    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      
      {/* Call Button */}
      <div style={{ margin: '20px 0', color: "rgb(243, 108, 35)" }}>
        <h3>Call Us:</h3>
        <a href="tel:+1234567890" style={{ fontSize: '20px', color: 'blue', textDecoration: 'underline' }}>
          +911234567890
        </a>
      </div>

      {/* Email Button */}
      <div style={{ margin: '20px 0', color: "rgb(243, 108, 35)"  }}>
        <h3>Email Us:</h3>
        <a href="mailto:info@example.com?subject=Inquiry" style={{ fontSize: '20px', color: 'blue', textDecoration: 'underline' }}>
          OrangePay@example.com
        </a>
      </div>

     

    </div>
  );
};

export default CallMe;
