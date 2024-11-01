import React, { useState } from 'react';

const Query = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: 'What is your return policy?', answer: 'Our return policy lasts 30 days. If 30 days have passed since your purchase, unfortunately, we cannot offer a refund or exchange.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we offer international shipping to select countries. Please check our shipping policy for more details.' },
    { question: 'How can I track my order?', answer: 'After placing an order, you will receive a tracking number via email. Use it to track your package on our shipping partner’s website.' },
    { question: 'What payment methods do you accept?', answer: 'We accept Visa, MasterCard, American Express, and PayPal for online purchases.' },
    { question: 'Can I change or cancel my order?', answer: 'Orders can be modified or canceled within 1 hour of placing them. After that, we cannot make changes.' },
    { question: 'How do I reset my password?', answer: 'To reset your password, click on "Forgot Password" on the login page and follow the instructions.' },
    { question: 'What is your warranty policy?', answer: 'Our products come with a one-year warranty covering manufacturing defects.' },
    { question: 'How do I contact customer support?', answer: 'You can contact customer support via email at support@example.com or call us at 1-800-555-5555.' },
    { question: 'Do you offer gift wrapping?', answer: 'Yes, we offer gift wrapping options at checkout for an additional fee.' },
    { question: 'Can I return a sale item?', answer: 'Sale items are final sale and cannot be returned or exchanged unless defective.' },
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <h2 style={{ color: "rgb(243, 108, 35)" }}>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => handleToggle(index)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '1rem',
              background: 'lightblue',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {faq.question}
            <span style={{
              transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}>
              ⌄
            </span>
          </button>
          {activeIndex === index && (
            <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Query;

