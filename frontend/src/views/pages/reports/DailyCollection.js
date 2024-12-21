import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Card, CardBody, CardHeader, Spinner, Input, Button, Row, Col } from 'reactstrap';
import './DailyCollection.css';

const columns = [
  { name: 'Paid Amount', selector: 'paidamount', sortable: true },
  { name: 'Receipt No', selector: 'reciptno', sortable: true },
  { name: 'Bill Post On', selector: 'billposton', sortable: true },
  { name: 'Gateway', selector: 'getway', sortable: true },
  { name: 'Card Txn Type', selector: 'cardtxntype', sortable: true },
  { name: 'Terminal ID', selector: 'terminalid', sortable: true },
  { name: 'MID', selector: 'mid', sortable: true },
  { name: 'Name on Card', selector: 'nameoncard', sortable: true },
  { name: 'Remarks', selector: 'remarks', sortable: true },
  { name: 'Login ID', selector: 'loginid', sortable: true },
  { name: 'RRN', selector: 'rrn', sortable: true },
  { name: 'VPA', selector: 'vpa', sortable: true },
  { name: 'Bill Amount', selector: 'billamount', sortable: true },
  { name: 'Payment Date', selector: 'paymentdate', sortable: true },
  { name: 'Latitude', selector: 'latitude', sortable: true },
  { name: 'Longitude', selector: 'longitude', sortable: true },
  { name: 'Fetch Type', selector: 'fetchtype', sortable: true },
  { name: 'Consumer Mob', selector: 'consumermob', sortable: true },
  { name: 'LTH/T', selector: 'ltht', sortable: true },
  { name: 'Due Date', selector: 'duedate', sortable: true },
  { name: 'Brand Code', selector: 'brandcode', sortable: true },
  { name: 'Division', selector: 'division', sortable: true },
  { name: 'Sub Division', selector: 'subdivision', sortable: true },
  { name: 'Consumer Name', selector: 'consumerName', sortable: true },
  { name: 'Commission', selector: 'commission', sortable: true },
  { name: 'TDS', selector: 'tds', sortable: true },
  { name: 'Net Commission', selector: 'netCommission', sortable: true },
  { name: 'Balance After Deduction', selector: 'balanceAfterDeduction', sortable: true },
  { name: 'Balance After Commission', selector: 'balanceAfterCommission', sortable: true },
];

const DailyCollection = () => {

  const today = new Date().toISOString().split('T')[0];

  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await axios.get('/api/v1/users/getTotalPaymentss', {
        params: { startDate, endDate },
      });
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchData(startDate, endDate);
  };

  return (
    <div className="container mt-4">
      <Card>
        <CardHeader>
          <h1>Daily Collection Report</h1>
        </CardHeader>
        <CardBody>
          <Row className="mb-3">
            <Col md={4}>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
              />
            </Col>
            <Col md={4}>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
              />
            </Col>
            <Col md={2}>
              <Input
                type="select"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              >
                <option value="" disabled>Select Type</option>
                <option value="">Type</option>
                <option value="">Type</option>
                <option value="">Type</option>
                <option value="">Type</option>
                <option value="">Type</option>
                <option value="">Type</option>
                <option value="">Type</option>
              </Input>
            </Col>
            <Col md={2}>
              <Button color="primary" onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>
          {loading ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              pagination
              highlightOnHover
              striped
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DailyCollection;