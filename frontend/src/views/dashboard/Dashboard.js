import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames'
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'; 


import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import { useParams } from 'react-router-dom';
import usePreventBackNavigation from '../../components/usePreventBackNavigation ';


// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { setUserRole } from '../../store';


const Dashboard = () => {
  // usePreventBackNavigation(`/dashboard/`);
  // const { user } = response.data.data;

  // const { id } = user; 

  //  const [userRole, setUserRole] = useState('');

  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     try {
  //       const response = await axios.get('/fetch_data');
  //       setUserRole(response.data.name);
  //     } catch (error) {
  //       console.error('Failed to fetch user role:', error);
  //     }
  //   };

  //   fetchUserRole();
  // }, []);


  // useEffect(() => {
  //   // Retrieve the username from local storage
  //   const username = localStorage.getItem('username')
  //   setUserRole(username)
  // }, [])


  const [userCount, setUserCount] = useState(0);
  // const [userCounts, setUserCounts] = useState(0);
  const [userCountss, setUserCountss] = useState(0);
  const [userCountsss, setUserCountsss] = useState(0);


  const [userRole, setUserRole] = useState('')
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState('month'); // Default interval
  const [chartData, setChartData] = useState(null); // State to hold chart data
  const maxUsers = 100; // Define the total/maximum number of users
  const [totalBalance, setTotalBalance] = useState(0); // State to store total balance
  const [userCounts, setUserCounts] = useState({ pending: 0, rejected: 0, blocked: 0 });
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Define the COLORS array





  useEffect(() => {
    // Retrieve the user role from localStorage
    const role = localStorage.getItem('username')
    console.log(role)
    if (role) {
      setUserRole(role)
    }
  }, [])













  // const dispatch = useDispatch();
  // const userRole = useSelector((state) => state.userRole);

  // useEffect(() => {
  //   // Retrieve the user role from localStorage and set it in Redux
  //   const role = localStorage.getItem('userRole');
  //   if (role) {
  //     dispatch(setUserRole(role));
  //   }
  // }, [dispatch]);
  const calculatePercentage = (count, total) => {
    return total > 0 ? Math.min((count / total) * 100, 100).toFixed(2) : 0;
  };





  const progressExample = [
    { title: 'Total Fund Amount', value: `${totalBalance}`, percent: 20, color: 'info' },
    { title: 'Agents', value: `${userCount} Users`, percent: calculatePercentage(userCount, maxUsers), color: 'success' },
    { title: 'Rejected User', value: `${userCountss} Users`, percent: 80, color: 'danger' },
    { title: 'New Request', value: `${userCounts}`, percent: 40.15, color: 'primary' },
    { title: 'Blocked User', value: `${userCountss}`, percent: 40.15, color: 'danger' },
  ]
  const progressExamples = [
    { title: 'Agents', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Total Reacharge', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Agents', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New User', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'New Request', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      // avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      // avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      // avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      // avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      // avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      // avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId); // Debugging line
        const response = await axios.get(`/status/${userId}`); // Updated API endpoint

        if (response.data.hasChanged) {
          alert('Your account has been updated, logging you out.');
          // Call the logout API
          await axios.post('/logout');
          // Clear local storage and redirect to login
          localStorage.clear();
          window.location.href = '/login'; // Redirect to login page
        }
      } catch (error) {
        console.error('Failed to check user status:', error.response ? error.response.data : error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(checkUserStatus, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);




  const handleIntervalChange = (value) => {
    setSelectedInterval(value);
    fetchData(value); // Fetch new chart data based on the selected interval
  };

  // const fetchChartData = (interval) => {
  //   // Replace with actual data fetching logic based on the interval
  //   console.log(`Fetching data for interval: ${interval}`);
  //   // For demonstration, you can set some mock data
  //   setChartData(`Data for ${interval}`);
  // };

  // useEffect(() => {
  //   // Fetch initial chart data on component mount
  //   fetchChartData(selectedInterval);
  // }, []);

  // const fetchChartData = (interval) => {
  //   console.log(`Fetching data for interval: ${interval}`);
  //   setUserCounts({
  //     pending: 10, 
  //     rejected: 5,
  //     blocked: 3,
  //   });
  // };

  // useEffect(() => {
  //   fetchChartData(selectedInterval);
  // }, [selectedInterval]);

  
  const fetchData = async () => {
    try {
      const [userListResponse, fundRequestsResponse, fetchDataResponse, rejectedDataResponse] = await Promise.all([
        axios.get('/fetchUserList'),
        axios.get('/fundrequests'),
        axios.get('/fetch_data'),
        axios.get('/fetch_data_rejected')
      ]);
  
      // Process user list
      const userList = userListResponse.data.fetchUser || [];
      const usersWithUserId = userList.filter(user => user.userId && user.userId.length > 0);
      setData(usersWithUserId);
      setUserCount(usersWithUserId.length);
  
      // Process fund requests
      const fundRequests = fundRequestsResponse.data.fundRequests || [];
      const calculatedBalance = fundRequests.reduce((acc, item) => {
        return item.status === 'approved' ? acc + parseFloat(item.fundAmount || 0) : acc;
      }, 0);
      setTotalBalance(calculatedBalance);
  
      // Process user statuses
      const userStatusData = fetchDataResponse.data.data || [];
      const pendingUsers = userStatusData.filter(user => user.status === 'Pending');
      
      // Update userCounts with pending, rejected, and blocked counts
      const rejectedUsers = rejectedDataResponse.data.data || [];
      setUserCounts({
        pending: pendingUsers.length,
        rejected: rejectedUsers.filter(user => user.status === 'Rejected').length,
        blocked: rejectedUsers.filter(user => user.status === 'Blocked').length
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchData();
  },[])
  const [selectedSlice, setSelectedSlice] = useState(null);
  const handlePieClick = (data, index) => {
    // data is the data of the clicked slice, index is the index of the slice
    setSelectedSlice({
      name: data.name,
      value: data.value,
    });
  };




  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startMonth = "January"; // Change as needed
  const endMonth = currentDate.toLocaleString("default", { month: "long" }); // Current month

  const dateRange = `${startMonth} - ${endMonth} ${currentYear}`;
  
  


  return (
    <>
      {userRole === 'dummy' && (
        <>
          <WidgetsDropdown className="mb-4" />
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Charts
                  </h4>
                  <div className="small text-body-secondary">{dateRange}</div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                  <CButtonGroup className="float-end me-3">
                    {['day', 'month', 'year'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === selectedInterval}
                        onClick={() => handleIntervalChange(value)} // Set the interval on click
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup>

                </CCol>
              </CRow>
              <MainChart selectedInterval={selectedInterval} />
              


            </CCardBody>
            <CCardFooter>
              <CRow
                xs={{ cols: 1, gutter: 4 }}
                sm={{ cols: 2 }}
                lg={{ cols: 4 }}
                xl={{ cols: 5 }}
                className="mb-2 text-center"
              >
                {progressExample.map((item, index, items) => (
                  <CCol
                    className={classNames({
                      'd-none d-xl-block': index + 1 === items.length,
                    })}
                    key={index}
                  >
                    <div className="text-body-secondary">{item.title}</div>
                    <div className="fw-semibold text-truncate">
                      {item.value} ({item.percent}%)
                    </div>
                    <CProgress thin className="mt-2" color={item.color} value={item.percent} />

                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </>
      )}




      {userRole !== 'dummy' && (
        <>
          <WidgetsDropdown className="mb-4" />
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Charts
                  </h4>
                  <div className="small text-body-secondary">{dateRange}</div>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                  <CButtonGroup className="float-end me-3">
                    {['Day', 'Month', 'Year'].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === selectedInterval}
                        onClick={() => handleIntervalChange(value)} // Set the interval on click
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup>

                </CCol>
              </CRow>
              <MainChart selectedInterval={selectedInterval} />
            </CCardBody>
            <CCardFooter>
              <CRow
                xs={{ cols: 1, gutter: 4 }}
                sm={{ cols: 2 }}
                lg={{ cols: 4 }}
                xl={{ cols: 5 }}
                className="mb-2 text-center"
              >
                {progressExample.map((item, index, items) => (
                  <CCol
                    className={classNames({
                      'd-none d-xl-block': index + 1 === items.length,
                    })}
                    key={index}
                  >
                    <div className="text-body-secondary">{item.title}</div>
                    <div className="fw-semibold text-truncate">
                      {item.value} ({item.percent}%)
                    </div>
                    <CProgress thin className="mt-2" color={item.color} value={item.percent} />

                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </>
      )}




      {userRole === 'distributor' && (
        <CCard className="mb-4">
          <CCardBody>
            <div>Distributor-specific content goes here</div>
            {/* Add content specific to distributor */}
          </CCardBody>
        </CCard>
      )}






    </>

  )
}

export default Dashboard
