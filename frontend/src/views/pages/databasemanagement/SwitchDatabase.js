import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CFormCheck, CFormLabel, CButton } from '@coreui/react';

const SwitchDatabase = () => {
  const [dbMode, setDbMode] = useState('online'); // default to 'online'

  // Function to handle the form submission
  const handleUpdateDatabase = () => {
    console.log(`Updating database mode to: ${dbMode}`);

    // Simulated API call for updating database mode
    alert(`Database mode updated to: ${dbMode}`);
  };

  return (
    <CCard>
      <CCardHeader>
        Switch Database Mode
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CFormLabel>Choose Database Mode:</CFormLabel>
          <CFormCheck 
            type="radio" 
            name="dbMode" 
            id="online" 
            value="online" 
            label="Online" 
            checked={dbMode === 'online'} 
            onChange={() => setDbMode('online')} 
          />
          <CFormCheck 
            type="radio" 
            name="dbMode" 
            id="offline" 
            value="offline" 
            label="Offline" 
            checked={dbMode === 'offline'} 
            onChange={() => setDbMode('offline')} 
          />
          <CButton color="primary" onClick={handleUpdateDatabase} className="mt-3">
            Update Database Mode
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default SwitchDatabase;
