import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react';
import axios from 'axios';

const Passbook = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/getPayment/${userId}`);
        const result = response.data.balance ? response.data.balance : [];
        result.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setTransactions(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Passbook</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <CTable striped bordered hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Date/Time</CTableHeaderCell>
              <CTableHeaderCell>Service</CTableHeaderCell>
              <CTableHeaderCell>TransactionID</CTableHeaderCell>
              <CTableHeaderCell>Opening Balance</CTableHeaderCell>
              <CTableHeaderCell>Requested Amount</CTableHeaderCell>
              <CTableHeaderCell>Commission Earned</CTableHeaderCell>
              <CTableHeaderCell>Final Balance</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {transactions.map(transaction => (
              <React.Fragment key={transaction.id}>
                {/* <CTableRow>
                  <CTableDataCell>{new Date(transaction.createdon).toLocaleDateString(undefined, options)}</CTableDataCell>
                  <CTableDataCell>
                    {transaction.description} + Reward
                    <CBadge color="success">Credit</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{transaction.transactionId}</CTableDataCell>
                  <CTableDataCell>{!isNaN(transaction.netCommission) ? Math.abs(transaction.netCommission) : 0} (Reward)</CTableDataCell>
                  <CTableDataCell>{Math.abs(transaction.balanceAfterCommission).toFixed(2)}</CTableDataCell>
                </CTableRow> */}
                <CTableRow>
                  <CTableDataCell>{new Date(transaction.createdon).toLocaleDateString(undefined, options)}</CTableDataCell>
                  <CTableDataCell>
                    {transaction.description} - Bill Payment
                    <CBadge color="danger">Debit</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{transaction.transactionId}</CTableDataCell>
                  <CTableDataCell>{Math.abs(transaction.balanceAfterDeduction).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>{transaction.billamount}</CTableDataCell>
                  <CTableDataCell>{!isNaN(transaction.netCommission) ? Math.abs(transaction.netCommission).toFixed(2) : '0'} (Reward)</CTableDataCell>
                  <CTableDataCell>{Math.abs(transaction.balanceAfterCommission).toFixed(2)}</CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default Passbook;
