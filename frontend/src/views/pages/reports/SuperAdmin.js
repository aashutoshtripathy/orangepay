import React, { useState } from 'react';
import { CButton, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import Passbook from '../passbook/Passbook';
// Import other report components as needed

import WalletReport from './WalletReport';
import OrangePayReport from './OrangePayReport';
import FundRequest from '../fundrequest/FundRequest';
import TransactionHistory from '../usermangement/TransactionHistory';
import CancellationHistory from '../usermangement/CancellationHistory';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const [selectedReport, setSelectedReport] = useState(null); // State to handle which report to show

  const handleButtonClick = (reportType) => {
    setSelectedReport(reportType); // Set the selected report type
    
    
  };

  // Define a mapping of report types to their components
  const reportComponents = {
    passbook: <Passbook userId={userId} />,
    // Add other components here when imported
    walletReport: <WalletReport userId={userId} />,
    commissionReport: <TransactionHistory userId={userId} />,
    orangepayReport: <OrangePayReport userId={userId} />,
    fundRequestReport: <FundRequest userId={userId} />,
    cancellationReport: <CancellationHistory userId={userId} />,
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#f36c23", fontWeight: "800" }}>
            Reports Dashboard
          </h3>
        </CCardHeader>
        <CCardBody>
          <CRow className="text-center">
            <CCol md={2}>
              <CButton color="primary" onClick={() => handleButtonClick('passbook')}>
                Passbook
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="success" onClick={() => handleButtonClick('walletReport')}>
                Wallet Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="info" onClick={() => handleButtonClick('commissionReport')}>
                Commission Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="warning" onClick={() => handleButtonClick('orangepayReport')}>
                OrangePay Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="danger" onClick={() => handleButtonClick('fundRequestReport')}>
                Fund Request Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="sacondary" onClick={() => handleButtonClick('cancellationReport')}>
                Cancellation Report
              </CButton>
            </CCol>
          </CRow>
          {/* Conditionally render the selected report component */}
          <div style={{ marginTop: '20px' }}>
            {selectedReport && reportComponents[selectedReport]}
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default SuperAdmin;
