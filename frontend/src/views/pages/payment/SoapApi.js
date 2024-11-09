import axios from 'axios';

// Function to send SOAP request
const sendSoapRequest = async (url, soapAction, xmlPayload) => {
  try {
    const response = await axios.post(url, xmlPayload, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': soapAction,
        'Accept': 'application/xml, text/xml',
      },
    });
    
    // Parse XML response to a DOM object
    const parsedResponse = parseXml(response.data);
    return parsedResponse;
  } catch (error) {
    console.error('Error sending SOAP request:', error);
    throw error;
  }
};

// Function to parse XML response using DOMParser
const parseXml = (xmlData) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, "text/xml");
  
  // Extracting the response as needed
  const response = xmlDoc.getElementsByTagName('responseTagName')[0]?.textContent; // Replace with actual tag name
  return response;
};

// Generate XML payload for BillDetails
const generateBillDetailsPayload = (consumerId, strMerchantCode, strMerchantPassword) => {
  return `
  <?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  <soap:Body>
    <tem:BillDetails>
      <tem:strCANumber>${consumerId}</tem:strCANumber>
      <tem:strDivision></tem:strDivision>
      <tem:strSubDivision></tem:strSubDivision>
      <tem:strLegacyNo></tem:strLegacyNo>
      <tem:strMerchantCode>${strMerchantCode}</tem:strMerchantCode>
      <tem:strMerchantPassword>${strMerchantPassword}</tem:strMerchantPassword>
    </tem:BillDetails>
  </soap:Body>
</soap:Envelope>
  `;
};

// Generate XML payload for PaymentDetails
const generatePaymentDetailsPayload = (consumerId, amount, paymentMethod) => {
  return `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:tem="http://tempuri.org/">
      <soap:Body>
        <tem:PaymentDetails>
          <tem:strCANumber>${consumerId}</tem:strCANumber>
          <tem:amount>${amount}</tem:amount>
          <tem:paymentMethod>${paymentMethod}</tem:paymentMethod>
        </tem:PaymentDetails>
      </soap:Body>
    </soap:Envelope>
  `;
};

// Generate XML payload for PaymentReceiptDetails
const generatePaymentReceiptDetailsPayload = (receiptNo, bankRefCode, transactionId) => {
  return `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:tem="http://tempuri.org/">
      <soap:Body>
        <tem:PaymentReceiptDetails>
          <tem:strReceiptNo>${receiptNo}</tem:strReceiptNo>
          <tem:strBankRefCode>${bankRefCode}</tem:strBankRefCode>
          <tem:strTransactionId>${transactionId}</tem:strTransactionId>
        </tem:PaymentReceiptDetails>
      </soap:Body>
    </soap:Envelope>
  `;
};

export {
  sendSoapRequest,
  generateBillDetailsPayload,
  generatePaymentDetailsPayload,
  generatePaymentReceiptDetailsPayload
};
