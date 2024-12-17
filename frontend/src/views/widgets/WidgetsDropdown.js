import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CSpinner,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { useSelector, useDispatch } from 'react-redux';
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import axios from 'axios'
// import { setUserRole } from '../../store'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const [userRole, setUserRole] = useState('');
  const [totalPayments, setTotalPayments] = useState('');
  const [totalPaymentss, setTotalPaymentss] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [userCounts, setUserCounts] = useState(0);
  const [userCountss, setUserCountss] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalBalances, setTotalBalances] = useState(0);
  const [data, setData] = useState(null);
  const userId = localStorage.getItem('userId')







  const dispatch = useDispatch();
  // const userRole = useSelector((state) => state.userRole);


  // const setUserRole = useSelector((state) => state.userRole)

  useEffect(() => {
    // Retrieve the user role from localStorage and set it in local state
    const role = localStorage.getItem('status');
    if (role) {
      setUserRole(role);
    }
  }, []);



  const [filterType, setFilterType] = useState('all');

  const filterByDate = (items, filterType) => {
    const today = new Date();
    
    return items.filter((item) => {
      const date = new Date(item.paymentdate || item.createdAt); 
      if (isNaN(date)) return false;
  
      switch (filterType) {
        case 'day':
          return date.toDateString() === today.toDateString();
        case 'month':
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        case 'year':
          return date.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const userResponse = await axios.get(`/api/v1/users/fetchUserList`);
        const users = userResponse.data.fetchUser || [];
        // setData(users.filter(user => user.userId && user.userId.length > 0));
        // setUserCount(users.length);
  
        // Fetch balance data
        const balanceResponse = await axios.get(`/api/v1/users/fundrequests`);
        const initialBalance = balanceResponse.data.fundRequests || [];
        setUserCountss(initialBalance.length)



        const balanceResponsee = await axios.get(`/api/v1/users/fund-request/${userId}`);
        const initialBalances = balanceResponsee.data.fundRequest || [];
  
        // Fetch payments data
        const paymentsResponse = await axios.get(`/api/v1/users/getTotalPayments`);
        const paymentsData = paymentsResponse.data.data || [];
        setUserCounts(paymentsData.length)
        

        const paymentsResponseData = await axios.get(`/api/v1/users/getPayments/${userId}`);
        const paymentsDataa = paymentsResponseData.data.balance || [];
        
        // Log fetched payment data for debugging
        console.log("Amount:", paymentsDataa);
        
        // Filter payments and balances based on filterType
        const filteredPayments = filterByDate(paymentsData, filterType);
        const filteredPaymentss = filterByDate(paymentsDataa, filterType);
        const filteredBalance = filterByDate(initialBalance, filterType);
        const filteredBalances = filterByDate(initialBalances, filterType);
        const filteredUsers = filterByDate(users, filterType);
  
        // Calculate total payments and balance based on filtered data
        setTotalPayments(filteredPayments.reduce((acc, item) => acc + parseFloat(item.paidamount || 0), 0));
        setTotalPaymentss(filteredPaymentss.reduce((acc, item) => acc + parseFloat(item.paidamount || 0), 0));
        setUserCount(filteredUsers.length);
        setTotalBalance(
          filteredBalance.reduce((acc, item) => {
            // Add condition to check for status being 'success'
            if (item.status === 'approved') {
              return acc + parseFloat(item.fundAmount || 0);
            }
            return acc;
          }, 0));
          setTotalBalances(
            filteredBalances.reduce((acc, item) => {
              // Add condition to check for status being 'success'
              if (item.status === 'approved') {
                return acc + parseFloat(item.fundAmount || 0);
              }
              return acc;
            }, 0));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [filterType]); // Re-fetch data when filterType changes
  
  // const handleFilterChange = (type) => setFilterType(type);



  const handleFilterChange = (type) => {
    setLoading(true);  // Start loader
    setFilterType(type)

    setTimeout(() => {
      setLoading(false);  // Stop loader after data is fetched
    }, 3000);  // Adjust the timeout to simulate the data fetching duration
  };
  




  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])


  const validTotalPayments = !isNaN(parseFloat(totalPayments)) ? parseFloat(totalPayments) : 0;
  const validTotalPaymentss = !isNaN(parseFloat(totalPaymentss)) ? parseFloat(totalPaymentss) : 0;

  return (
    <>
      {userRole === 'Activated' && (
        <>
          <CRow className={props.className} xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
              color="warning"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>₹ {validTotalPayments.toFixed(2)}  ({userCounts})</>       
                  )
              }
                title="Collection Amount"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
              color="info"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>₹ {totalBalance.toFixed(2)}  ({userCountss})</>
                )
              }
                title="Fund Amount"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    ref={widgetChartRef2}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'Recharge amount',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              color="primary"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>{userCount}</>
                )
              }
                title="Agent Management"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                    </CDropdown>
                 }
                chart={
                  <CChartLine
                    ref={widgetChartRef1}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-primary'),
                          data: [65, 59, 84, 84, 51, 55, 40],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: 30,
                          max: 89,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            {/* <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="info"
                value={
                  <>
                    {totalBalance}{' '}
                    <span className="fs-6 fw-normal">
                      (<CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="Fund Management"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //       <CDropdownItem><Link to="/active" style={{textDecoration:"none"}}>Agent Management</Link></CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                chart={
                  <CChartLine
                    ref={widgetChartRef2}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'Recharge amount',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol> */}
            {/* <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="warning"
                value={
                  <>
                    2.49%{' '}
                    <span className="fs-6 fw-normal">
                      (84.7% <CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="Database Management"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //     <CDropdownItem><Link to="/switch-database" style={{textDecoration:"none"}}>Switch Database</Link></CDropdownItem>
                //     <CDropdownItem><Link to="/switch-getway" style={{textDecoration:"none"}}>Switch Getway</Link></CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol> */}
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="danger"
                value={
                  <>
                    44K{' '}
                    <span className="fs-6 fw-normal">
                      (-23.6% <CIcon icon={cilArrowBottom} />)
                    </span>
                  </>
                }
                title="Reports"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //     <CDropdownItem><Link to="" style={{textDecoration:"none"}}>Reports</Link></CDropdownItem>
                //     <CDropdownItem><Link to="/fund-report" style={{textDecoration:"none"}}></Link></CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
        </>
      )}




{userRole === 'Active' && (
        <>
          <CRow className={props.className} xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>      
          <CWidgetStatsA
              color="warning"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>₹ {validTotalPayments.toFixed(2)}  ({userCounts})</>       
                  )
              }
                title="Collection Amount"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
              color="info"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>₹ {totalBalance.toFixed(2)}  ({userCountss})</>
                )
              }
                title="Fund Amount"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    ref={widgetChartRef2}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'Recharge amount',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              color="primary"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>{userCount}</>
                )
              }
                title="Agent Management"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                    </CDropdown>
                 }
                chart={
                  <CChartLine
                    ref={widgetChartRef1}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-primary'),
                          data: [65, 59, 84, 84, 51, 55, 40],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: 30,
                          max: 89,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            {/* <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="info"
                value={
                  <>
                    {totalBalance}{' '}
                    <span className="fs-6 fw-normal">
                      (<CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="Fund Management"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //       <CDropdownItem><Link to="/active" style={{textDecoration:"none"}}>Agent Management</Link></CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                chart={
                  <CChartLine
                    ref={widgetChartRef2}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'Recharge amount',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol> */}
            {/* <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="warning"
                value={
                  <>
                    2.49%{' '}
                    <span className="fs-6 fw-normal">
                      (84.7% <CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="Database Management"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //     <CDropdownItem><Link to="/switch-database" style={{textDecoration:"none"}}>Switch Database</Link></CDropdownItem>
                //     <CDropdownItem><Link to="/switch-getway" style={{textDecoration:"none"}}>Switch Getway</Link></CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol> */}
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="danger"
                value={
                  <>
                    44K{' '}
                    <span className="fs-6 fw-normal">
                      (-23.6% <CIcon icon={cilArrowBottom} />)
                    </span>
                  </>
                }
                title="Reports"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //     <CDropdownItem><Link to="" style={{textDecoration:"none"}}>Reports</Link></CDropdownItem>
                //     <CDropdownItem><Link to="/fund-report" style={{textDecoration:"none"}}></Link></CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
        </>
      )}


      

      {userRole === 'Approved' && (
        <>
          <CRow className={props.className} xs={{ gutter: 4 }}>
            <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              color="warning"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>₹ {validTotalPaymentss.toFixed(2)}</>
                )
              }
                title="Collection Amount"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
              color="info"
              value={
                loading ? (
                  <div>
                    <CSpinner color="light" size="sm" /> Please wait...
                  </div>
                ) : (
                  <>₹ {totalBalances.toFixed(2)}</>
                )
              }
                title="Fund Amount"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('day')}>Day</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('month')}>Month</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('year')}>Year</CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('total')}>Total</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    ref={widgetChartRef2}
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'Recharge amount',
                          backgroundColor: 'transparent',
                          borderColor: 'rgba(255,255,255,.55)',
                          pointBackgroundColor: getStyle('--cui-info'),
                          data: [1, 18, 9, 17, 34, 22, 11],
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          min: -9,
                          max: 39,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="warning"
                value={
                  <>
                    2.49%{' '}
                    <span className="fs-6 fw-normal">
                      (84.7% <CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="My Profile"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>View Profile</CDropdownItem>
                      <CDropdownItem>Change Password</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40],
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="danger"
                value={
                  <>
                    44K{' '}
                    <span className="fs-6 fw-normal">
                      (-23.6% <CIcon icon={cilArrowBottom} />)
                    </span>
                  </>
                }
                title="Support Desk"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Query</CDropdownItem>
                      <CDropdownItem>Call Me</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                }
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: '70px' }}
                    data={{
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                        'January',
                        'February',
                        'March',
                        'April',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          border: {
                            display: false,
                          },
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
