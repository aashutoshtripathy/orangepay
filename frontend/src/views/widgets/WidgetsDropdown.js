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
  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0); // State to store total balance
  const [data, setData] = useState(null);







  const dispatch = useDispatch();
  // const userRole = useSelector((state) => state.userRole);


  // const setUserRole = useSelector((state) => state.userRole)

  useEffect(() => {
    // Retrieve the user role from localStorage and set it in local state
    const role = localStorage.getItem('username');
    if (role) {
      setUserRole(role);
    }
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList`);
        const result = response.data.fetchUser || [];

        // Filter the users with an existing (truthy) userId
        const usersWithUserId = result.filter(user => user.userId && user.userId.length > 0);

        // Set the filtered user data
        setData(usersWithUserId);
        setUserCount(usersWithUserId.length);

        // Log or set the count of users with an existing userId
        console.log(`Number of users with userId: ${usersWithUserId.length}`);


        const totalBalanceResponse = await axios.get(`/getTotalBalance`);
        const roundedBalance = Math.round(totalBalanceResponse.data.totalBalance);

        // Set the total balance as the rounded value
        setTotalBalance(roundedBalance);

        console.log(`Total Balance: ${roundedBalance}`);
        console.log(`Total Balance: ${totalBalanceResponse.data.totalBalance}`);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);





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

  return (
    <>
      {userRole === 'dummy' && (
        <>
          <CRow className={props.className} xs={{ gutter: 4 }}>
          <CCol sm={6} xl={4} xxl={3}>
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
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="primary"
                value={
                  <>
                    {userCount}{' '}
                    <span className="fs-6 fw-normal">
                      (<CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="User Management"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //     <CDropdownItem>
                //       <Link to="/add-user" style={{textDecoration:"none"}}>Add User</Link>
                //     </CDropdownItem>
                //     <CDropdownItem>
                //       <Link to="/view-user" style={{textDecoration:"none"}}>View User</Link>
                //     </CDropdownItem>
                //     </CDropdownMenu>
                //   </CDropdown>
                // }
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
                title="Reports"
                // action={
                //   <CDropdown alignment="end">
                //     <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                //       <CIcon icon={cilOptions} />
                //     </CDropdownToggle>
                //     <CDropdownMenu>
                //     <CDropdownItem><Link to="" style={{textDecoration:"none"}}>Reports</Link></CDropdownItem>
                //     <CDropdownItem><Link to="/fund-report" style={{textDecoration:"none"}}>Fund Reports</Link></CDropdownItem>
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

      {userRole !== 'dummy' && (
        <>
          <CRow className={props.className} xs={{ gutter: 4 }}>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="primary"
                value={
                  <>
                    4 Types of{' '}
                    <span className="fs-6 fw-normal">
                      {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                    </span>
                  </>
                }
                title="Servicves"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Bill Payment</CDropdownItem>
                      <CDropdownItem>Topup</CDropdownItem>
                      <CDropdownItem>Get Prepaid Balance</CDropdownItem>
                      <CDropdownItem>Cancelation Request</CDropdownItem>
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
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                color="info"
                value={
                  <>
                    $6.200{' '}
                    <span className="fs-6 fw-normal">
                      (40.9% <CIcon icon={cilArrowTop} />)
                    </span>
                  </>
                }
                title="My Account"
                action={
                  <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                      <CIcon icon={cilOptions} />
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Transactions Report-Ezetap</CDropdownItem>
                      <CDropdownItem>Transactions Report-OrangePay</CDropdownItem>
                      <CDropdownItem>Fund Request</CDropdownItem>
                      <CDropdownItem>Fund Transfer</CDropdownItem>
                      <CDropdownItem>Fund Report</CDropdownItem>
                      <CDropdownItem>Reports</CDropdownItem>
                      <CDropdownItem>Top-Up Report</CDropdownItem>
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
                          label: 'My First dataset',
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
