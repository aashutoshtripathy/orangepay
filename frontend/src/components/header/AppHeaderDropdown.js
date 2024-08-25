import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'          
import {        
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSelector, useDispatch } from 'react-redux';

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AppHeaderDropdown = () => {

  const navigate = useNavigate();

  // const [balance, setBalance] = useState(null);

  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.userRole);


  const [userId, setUserId] = useState(null)
  // const navigate = useNavigate()


  // useEffect(() => {
  //   if (!id) {
  //     console.error('Invalid userId format:', id);
  //     return;
  //   }

  //   const fetchBalance = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`/balance/${id}`);
  //       setBalance(response.data.balance);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchBalance();
  // }, [id]);




  // Fetch user details including user ID
  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Handle the case where the user ID is not available (e.g., redirect to login)
      console.log('No user ID found in localStorage');
    }
  }, []);

  // useEffect(() => {
  //   // Retrieve the user role from localStorage and set it in Redux
  //   const role = localStorage.removeItem('userRole');
  //   if (role) {
  //     dispatch(setUserRole(role));
  //   }
  // }, [dispatch]);


  
  // const handleLogout = () => {
  //   dispatch(logout()); // Dispatch the logout action to clear state and localStorage
  //   navigate('/login'); // Redirect to login page
  // };



    const handleLogout = () => {
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      // dispatch(setUserRole(null)); // Reset user role in Redux state if applicable
      navigate('/login'); // Redirect to login page
    };
  



  return (
    <>
    {userRole === 'dummy' &&(
      <>
      <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
       <CDropdownMenu className="pt-0" placement="bottom-end">
      {/*
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />*/}
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>   
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu> 
    </CDropdown>
    </>
  )}
  {userRole !== 'dummy' &&(
      <>
      <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
       <CDropdownMenu className="pt-0" placement="bottom-end">
      {/*  <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <Link to={`/profile/${userId}`} style={{ textDecoration: 'none' }}>
          <CDropdownItem>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          </Link>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
    </>
  )}
    </>
  )
}

export default AppHeaderDropdown
