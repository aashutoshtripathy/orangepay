import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CContainer,
  CButton
} from '@coreui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewTable = () => {
  // State to hold the fetched table data
  const [tableData, setTableData] = useState([]);
  const { userId } = useParams();


  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetch-data/${userId}`);
        console.log("API Response:", response.data);
        setTableData(response.data.data);  // Ensure you're setting the correct field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [userId]);


  const handleAction = (action, user) => {
    console.log(`${action} action triggered for user:`, user);
    // Implement your logic for Accept, Reject, and Download actions here
  };
  
  return (
    <CContainer fluid>
      <CTable striped hover bordered responsive>
        {/* Table Header */}
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Field</CTableHeaderCell>
            {tableData.map((user, index) => (
              <CTableHeaderCell key={index}>User</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        {/* Table Body */}
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">Name</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.name}>{user.name}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Father Or Husband Name</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.fatherOrHusbandName}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Date of Birth</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.dob}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Aadhar Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.aadharNumber}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Pan Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.panNumber}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Mobile Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.mobileNumber}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Gender</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.gender}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Marital Status</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.maritalStatus}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Education</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.education}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Address</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.address}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">E-Mail</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.email}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Division</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.division}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Sub-Division</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.subDivision}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Section</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.section}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Consumer Id</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.consumerId}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">District</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.district}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Pin Code</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.pincode}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Bank</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.bank}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Bank Account Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.accountno}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">IFSC Code</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.ifsc}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Discom</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.discom}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Action</CTableHeaderCell>
            <CButton
                  color="success"
                  onClick={() => handleAction('Accept', user)}
                >
                  Accept
                </CButton>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CContainer>
  );
};

export default ViewTable;
