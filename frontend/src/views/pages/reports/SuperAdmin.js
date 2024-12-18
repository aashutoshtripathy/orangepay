import React, { useState } from 'react';
import { CButton, CContainer, CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Passbook from '../passbook/Passbook';
// Import other report components as needed

import WalletReport from './WalletReport';
import OrangePayReport from './OrangePayReport';
import FundRequest from '../fundrequest/FundRequest';
import TransactionHistory from '../usermangement/TransactionHistory';
import CancellationHistory from '../usermangement/CancellationHistory';
import TopupReport from './TopupReport';

const SuperAdmin = () => {
  const location = useLocation();
  const { id, name, status } = location.state || {};  const navigate = useNavigate();
  const { userId } = useParams(); 
  const [selectedReport, setSelectedReport] = useState(null); 

  const handleButtonClick = (reportType) => {
    setSelectedReport(reportType); 
    
    
  };

  const reportComponents = {
    passbook: <Passbook userId={userId} />,
    walletReport: <WalletReport userId={userId} />,
    commissionReport: <TransactionHistory userId={userId} />,
    orangepayReport: <OrangePayReport userId={userId} />,
    fundRequestReport: <FundRequest userId={userId} />,
    cancellationReport: <CancellationHistory userId={userId} />,
    topupReport: <TopupReport userId={userId} />,
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#f36c23", fontWeight: "800" }}>
            Reports Dashboard
          </h3>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <p><strong>Agent ID:</strong> {id}</p>
            <p><strong>Agent Name:</strong> {name}</p>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow className="text-center">
            <CCol md={2}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('passbook')}>
                Passbook
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('walletReport')}>
                Wallet Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('commissionReport')}>
                Commission Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('orangepayReport')}>
                OrangePay Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('fundRequestReport')}>
                Fund Report
              </CButton>
            </CCol>
            <CCol md={2}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('topupReport')}>
                TopUp Report
              </CButton>
            </CCol>
            <CCol md={2} style={{marginTop:"7px"}}>
              <CButton color="primary" style={{backgroundColor:"#f36c23", border:"none"}} onClick={() => handleButtonClick('cancellationReport')}>
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
