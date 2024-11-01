import React, { useState } from 'react';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!name || !email || !message) {
      setError('All fields are required.');
      return;
    }
    setError('');
    // Here you can implement sending the email or processing the form submission
    console.log("Form submitted:", { name, email, message });
    setSuccess(true);
    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center', color: "rgb(243, 108, 35)"  }}>
      <h2>Contact Us</h2>
      

      {/* Contact Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ margin: '10px 0', padding: '10px', width: '80%' }} 
        />
        <input 
          type="email" 
          placeholder="Your Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ margin: '10px 0', padding: '10px', width: '80%' }} 
        />
        <textarea 
          placeholder="Your Message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
          style={{ margin: '10px 0', padding: '10px', width: '80%', height: '100px' }} 
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Send Message
        </button>
      </form>

      {success && <p style={{ color: 'green', marginTop: '20px' }}>Message sent successfully!</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
};

export default ContactUs;
