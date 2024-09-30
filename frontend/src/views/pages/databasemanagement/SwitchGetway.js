import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CFormCheck, CFormLabel, CFormSelect, CButton } from '@coreui/react';

const SwitchGateway = () => {
  const [gateway, setGateway] = useState('whatsapp'); // Default to WhatsApp Gateway
  const [gatewayOption, setGatewayOption] = useState('option1'); // Default option within the gateway

  // Options for WhatsApp Gateway
  const whatsappOptions = [
    { value: 'option1', label: 'WhatsApp Option 1' },
    { value: 'option2', label: 'WhatsApp Option 2' },
    { value: 'option3', label: 'WhatsApp Option 3' },
    { value: 'option4', label: 'WhatsApp Option 4' },
  ];

  // Options for SMS Gateway
  const smsOptions = [
    { value: 'option1', label: 'SMS Option 1' },
    { value: 'option2', label: 'SMS Option 2' },
    { value: 'option3', label: 'SMS Option 3' },
    { value: 'option4', label: 'SMS Option 4' },
  ];

  // Handle form submission
  const handleSubmit = () => {
    alert(`Gateway: ${gateway}, Selected Option: ${gatewayOption}`);
  };

  // Update options based on the selected gateway
  const gatewayOptions = gateway === 'whatsapp' ? whatsappOptions : smsOptions;

  return (
    <CCard>
      <CCardHeader>Switch Gateway</CCardHeader>
      <CCardBody>
        <CForm>
          {/* Gateway Selection */}
          <CFormLabel>Select Gateway:</CFormLabel>
          <CFormCheck
            type="radio"
            name="gateway"
            id="whatsapp"
            value="whatsapp"
            label="WhatsApp Gateway"
            checked={gateway === 'whatsapp'}
            onChange={() => setGateway('whatsapp')}
          />
          <CFormCheck
            type="radio"
            name="gateway"
            id="sms"
            value="sms"
            label="SMS Gateway"
            checked={gateway === 'sms'}
            onChange={() => setGateway('sms')}
          />

          {/* Gateway-specific Options */}
          <CFormLabel className="mt-3">Select an Option:</CFormLabel>
          <CFormSelect
            value={gatewayOption}
            onChange={(e) => setGatewayOption(e.target.value)}
          >
            {gatewayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>

          {/* Submit Button */}
          <CButton color="primary" className="mt-3" onClick={handleSubmit}>
            Submit
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default SwitchGateway;
