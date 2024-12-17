import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilDollar,
} from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
// import { setUserRole } from '../store'


const AppHeader = () => {
  const headerRef = useRef()
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');






  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // const userRole = useSelector((state) => state.userRole);


  // const setUserRole = useSelector((state) => state.userRole)

  useEffect(() => {
    // Retrieve the user role from localStorage and set it in local state
    const role = localStorage.getItem('status');
    if (role) {
      setUserRole(role);
    }
  }, []);






  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId); // Debugging line
        const response = await axios.get(`/api/v1/users/status/${userId}`); // Updated API endpoint

        if (response.data.hasChanged) {
          alert('Your account has been updated, logging you out.');
          // Call the logout API
          await axios.post('/api/v1/users/logout');
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

  




  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/fetchUserById/${userId}`);
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);






  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId)

    if (!userId) {
      console.error('Invalid userId format:', userId);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      try {
        console.log('Fetching balance for userId:', userId); // Add this line
        const response = await axios.get(`/api/v1/users/balance/${userId}`);
        console.log('Balance response:', response.data); // Add this line
        setBalance(response.data.balance);
      } catch (err) {
        console.error('Error fetching balance:', err.message); // Modify this line
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    const interval = setInterval(() => {
      fetchBalance();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);







  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])



  function formatBalance(balance) {
    if (balance === null || isNaN(balance)) return '₹ 0.00';

    // Split the number into whole and decimal parts
    const [whole, decimal] = balance.toFixed(2).split('.');

    // Format the whole part with commas every three digits
    const formattedWhole = whole.replace(/(\d)(?=(\d{2})+(\d{1})$)/g, '$1,');

    return `₹ ${formattedWhole}.${decimal}`;
  }




  // let balance = 10;
  { loading && <p>Loading...</p> }
  { error && <p>Error: {error}</p> }


  return (
    <>
      {userRole === 'Activated' && (
        <>
          <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
            <CContainer className="border-bottom px-4" fluid>
              <CHeaderToggler
                onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
                style={{ marginInlineStart: '-14px' }}
              >
                <CIcon icon={cilMenu} size="lg" />
              </CHeaderToggler>
              <h2
                style={{
                  color: '#f36c23',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  fontFamily: 'Cooper Black',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                  // flexShrink: 0, // Prevent shrinking when the sidebar is toggled
                  display: !sidebarShow ? 'block' : 'none', // Ensure it doesn't disappear
                }}
              >
                OrangePay
              </h2>
              <CHeaderNav className="d-none d-md-flex">
                <CNavItem className='d-flex align-items-center'>
                  <CNavLink to={`/dashboard/${userId}`} as={NavLink}>
                    <span className="font-weight-normal">Welcome, </span>
                    <span className="font-weight-bold">{user.name}</span>
                  </CNavLink>
                </CNavItem>
                <CNavItem className='d-flex align-items-center'>
                  <CNavLink href="#">SuperAdmin</CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Agent Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Manager Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Distributor Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Admin Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink to='/fundrequests' as={NavLink}  className="border p-2 m-1 rounded bg-transparent text-dark">
                  <div className="d-flex flex-column">
                      <span>Fund Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
              </CHeaderNav>
              <CHeaderNav className="ms-auto">
                <CNavItem>
                  <CNavLink href="#">
                    <CIcon icon={cilBell} size="lg" />
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="#">
                    <CIcon icon={cilList} size="lg" />
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink href="#">
                    <CIcon icon={cilEnvelopeOpen} size="lg" />
                  </CNavLink>
                </CNavItem>
              </CHeaderNav>
              <CHeaderNav>
                <li className="nav-item py-1">
                  <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
                </li>
                <CDropdown variant="nav-item" placement="bottom-end">
                  <CDropdownToggle caret={false}>
                    {colorMode === 'dark' ? (
                      <CIcon icon={cilMoon} size="lg" />
                    ) : colorMode === 'auto' ? (
                      <CIcon icon={cilContrast} size="lg" />
                    ) : (
                      <CIcon icon={cilSun} size="lg" />
                    )}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem
                      active={colorMode === 'light'}
                      className="d-flex align-items-center"
                      as="button"
                      type="button"
                      onClick={() => setColorMode('light')}
                    >
                      <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                    </CDropdownItem>
                    <CDropdownItem
                      active={colorMode === 'dark'}
                      className="d-flex align-items-center"
                      as="button"
                      type="button"
                      onClick={() => setColorMode('dark')}
                    >
                      <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                    </CDropdownItem>
                    <CDropdownItem
                      active={colorMode === 'auto'}
                      className="d-flex align-items-center"
                      as="button"
                      type="button"
                      onClick={() => setColorMode('auto')}
                    >
                      <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <li className="nav-item py-1">
                  <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
                </li>
                <AppHeaderDropdown />
              </CHeaderNav>
            </CContainer>
            <CContainer className="px-4" fluid>
              <AppBreadcrumb />
            </CContainer>
          </CHeader>
        </>
      )}
      {userRole === 'Approved' && (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
          <CContainer className="border-bottom px-4" fluid>
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              style={{ marginInlineStart: '-14px' }}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
            <h2
              style={{
                color: '#f36c23',
                fontSize: '36px',
                fontWeight: 'bold',
                fontFamily: 'Cooper Black',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                flexShrink: 0, // Prevent shrinking when the sidebar is toggled
                display: !sidebarShow ? 'block' : 'none', // Ensure it doesn't disappear
              }}
            >
              OrangePay
            </h2>
            <CHeaderNav className="d-none d-md-flex">
              <CNavItem>
                <CNavLink to={`/dashboard/${userId}`} as={NavLink}>
                  <span className="font-weight-bold">Welcome, </span>
                  <span className="font-weight-bold">{user.name}</span>
                  <span className="font-weight-bold"> Agent</span>

                </CNavLink>
              </CNavItem>
              {/* <CNavItem>
            <CNavLink >Agent</CNavLink>
          </CNavItem> */}
              {/* <CNavItem>
            <CNavLink to='/requests' as={NavLink}>Requests</CNavLink>
          </CNavItem> */}
            </CHeaderNav>
            <CHeaderNav className="ms-auto">
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilBell} size="lg" />
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  {/* <CIcon icon={cilDollar} size="lg" /> */}
                  <span style={{ fontWeight: 'bold', color: balance === 0 ? 'red' : 'green' }}>
                    <FontAwesomeIcon
                      // icon={faRupeeSign}
                      style={{
                        color: balance === 0 ? 'red' : 'green',
                        fontWeight: 'bold', // Make the icon bolder
                        marginRight: '5px', // Add space to the right of the icon
                      }}
                    />
                    <span style={{ fontWeight: 'bold' }}>
                      {formatBalance(balance)}

                    </span>
                  </span>


                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilEnvelopeOpen} size="lg" />
                </CNavLink>
              </CNavItem>
            </CHeaderNav>
            <CHeaderNav>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <CDropdown variant="nav-item" placement="bottom-end">
                <CDropdownToggle caret={false}>
                  {colorMode === 'dark' ? (
                    <CIcon icon={cilMoon} size="lg" />
                  ) : colorMode === 'auto' ? (
                    <CIcon icon={cilContrast} size="lg" />
                  ) : (
                    <CIcon icon={cilSun} size="lg" />
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                  >
                    <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                  >
                    <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                  >
                    <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <AppHeaderDropdown />
            </CHeaderNav>
          </CContainer>
          <CContainer className="px-4" fluid>
            <AppBreadcrumb />
          </CContainer>
        </CHeader>
      )}


{userRole === 'Access' && (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
          <CContainer className="border-bottom px-4" fluid>
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              style={{ marginInlineStart: '-14px' }}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
            <h2
              style={{
                color: '#f36c23',
                fontSize: '36px',
                fontWeight: 'bold',
                fontFamily: 'Cooper Black',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                flexShrink: 0, // Prevent shrinking when the sidebar is toggled
                display: !sidebarShow ? 'block' : 'none', // Ensure it doesn't disappear
              }}
            >
              OrangePay
            </h2>
            <CHeaderNav className="d-none d-md-flex">
              <CNavItem>
                <CNavLink to={`/dashboard/${userId}`} as={NavLink}>
                  <span className="font-weight-bold">Welcome, </span>
                  <span className="font-weight-bold">{user.name}</span>
                  <span className="font-weight-bold"> Manager</span>

                </CNavLink>
              </CNavItem>
              {/* <CNavItem>
            <CNavLink >Agent</CNavLink>
          </CNavItem> */}
              {/* <CNavItem>
            <CNavLink to='/requests' as={NavLink}>Requests</CNavLink>
          </CNavItem> */}
            </CHeaderNav>
            <CHeaderNav className="ms-auto">
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilBell} size="lg" />
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  {/* <CIcon icon={cilDollar} size="lg" /> */}
                  <span style={{ fontWeight: 'bold', color: balance === 0 ? 'red' : 'green' }}>
                    <FontAwesomeIcon
                      // icon={faRupeeSign}
                      style={{
                        color: balance === 0 ? 'red' : 'green',
                        fontWeight: 'bold', // Make the icon bolder
                        marginRight: '5px', // Add space to the right of the icon
                      }}
                    />
                    <span style={{ fontWeight: 'bold' }}>
                      {formatBalance(balance)}

                    </span>
                  </span>


                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilEnvelopeOpen} size="lg" />
                </CNavLink>
              </CNavItem>
            </CHeaderNav>
            <CHeaderNav>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <CDropdown variant="nav-item" placement="bottom-end">
                <CDropdownToggle caret={false}>
                  {colorMode === 'dark' ? (
                    <CIcon icon={cilMoon} size="lg" />
                  ) : colorMode === 'auto' ? (
                    <CIcon icon={cilContrast} size="lg" />
                  ) : (
                    <CIcon icon={cilSun} size="lg" />
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                  >
                    <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                  >
                    <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                  >
                    <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <AppHeaderDropdown />
            </CHeaderNav>
          </CContainer>
          <CContainer className="px-4" fluid>
            <AppBreadcrumb />
          </CContainer>
        </CHeader>
      )}



{userRole === 'Approve' && (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
          <CContainer className="border-bottom px-4" fluid>
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              style={{ marginInlineStart: '-14px' }}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
            <h2
              style={{
                color: '#f36c23',
                fontSize: '36px',
                fontWeight: 'bold',
                fontFamily: 'Cooper Black',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                flexShrink: 0, // Prevent shrinking when the sidebar is toggled
                display: !sidebarShow ? 'block' : 'none', // Ensure it doesn't disappear
              }}
            >
              OrangePay
            </h2>
            <CHeaderNav className="d-none d-md-flex">
              <CNavItem>
                <CNavLink to={`/dashboard/${userId}`} as={NavLink}>
                  <span className="font-weight-bold">Welcome, </span>
                  <span className="font-weight-bold">{user.name}</span>
                  <span className="font-weight-bold"> Distributor</span>
                </CNavLink>
              </CNavItem>
              {/* <CNavItem>
            <CNavLink >Agent</CNavLink>
          </CNavItem> */}
              {/* <CNavItem>
            <CNavLink to='/requests' as={NavLink}>Requests</CNavLink>
          </CNavItem> */}
            </CHeaderNav>
            <CHeaderNav className="ms-auto">
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilBell} size="lg" />
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  {/* <CIcon icon={cilDollar} size="lg" /> */}
                  <span style={{ fontWeight: 'bold', color: balance === 0 ? 'red' : 'green' }}>
                    <FontAwesomeIcon
                      // icon={faRupeeSign}
                      style={{
                        color: balance === 0 ? 'red' : 'green',
                        fontWeight: 'bold', // Make the icon bolder
                        marginRight: '5px', // Add space to the right of the icon
                      }}
                    />
                    <span style={{ fontWeight: 'bold' }}>
                      {formatBalance(balance)}

                    </span>
                  </span>


                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilEnvelopeOpen} size="lg" />
                </CNavLink>
              </CNavItem>
            </CHeaderNav>
            <CHeaderNav>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <CDropdown variant="nav-item" placement="bottom-end">
                <CDropdownToggle caret={false}>
                  {colorMode === 'dark' ? (
                    <CIcon icon={cilMoon} size="lg" />
                  ) : colorMode === 'auto' ? (
                    <CIcon icon={cilContrast} size="lg" />
                  ) : (
                    <CIcon icon={cilSun} size="lg" />
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                  >
                    <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                  >
                    <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                  >
                    <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <AppHeaderDropdown />
            </CHeaderNav>
          </CContainer>
          <CContainer className="px-4" fluid>
            <AppBreadcrumb />
          </CContainer>
        </CHeader>
      )}


{userRole === 'Active' && (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
          <CContainer className="border-bottom px-4" fluid>
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              style={{ marginInlineStart: '-14px' }}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
            <h2
              style={{
                color: '#f36c23',
                fontSize: '36px',
                fontWeight: 'bold',
                fontFamily: 'Cooper Black',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                flexShrink: 0, // Prevent shrinking when the sidebar is toggled
                display: !sidebarShow ? 'block' : 'none', // Ensure it doesn't disappear
              }}
            >
              OrangePay
            </h2>
            <CHeaderNav className="d-none d-md-flex">
                <CNavItem className='d-flex align-items-center'>
                <CNavLink to={`/dashboard/${userId}`} as={NavLink}>
                  <span className="font-weight-bold">Welcome, </span>
                  <span className="font-weight-bold">{user.name}</span>
                  <span className="font-weight-bold"> Admin</span>

                </CNavLink>
              </CNavItem>
              <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Agent Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Manager Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Distributor Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  {/* <CNavLink to='/requests' as={NavLink}>Agent Requests</CNavLink> */}
                  {/* <CNavLink to='/requests' as={NavLink} className="border p-2 m-1 rounded bg-transparent text-dark">
                    <div className="d-flex flex-column">
                      <span>Admin Requests</span> 
                    </div>
                  </CNavLink> */}
                </CNavItem>
                <CNavItem>
                  <CNavLink to='/fundrequests' as={NavLink}  className="border p-2 m-1 rounded bg-transparent text-dark">
                  <div className="d-flex flex-column">
                      <span>Fund Requests</span>
                    </div>
                  </CNavLink>
                </CNavItem>
              {/* <CNavItem>
            <CNavLink >Agent</CNavLink>
          </CNavItem> */}
              {/* <CNavItem>
            <CNavLink to='/requests' as={NavLink}>Requests</CNavLink>
          </CNavItem> */}
            </CHeaderNav>
            <CHeaderNav className="ms-auto">
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilBell} size="lg" />
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  {/* <CIcon icon={cilDollar} size="lg" /> */}
                  {/* <span style={{ fontWeight: 'bold', color: balance === 0 ? 'red' : 'green' }}>
                    <FontAwesomeIcon
                      // icon={faRupeeSign}
                      style={{
                        color: balance === 0 ? 'red' : 'green',
                        fontWeight: 'bold', // Make the icon bolder
                        marginRight: '5px', // Add space to the right of the icon
                      }}
                    />
                    <span style={{ fontWeight: 'bold' }}>
                      {formatBalance(balance)}

                    </span>
                  </span> */}


                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#">
                  <CIcon icon={cilEnvelopeOpen} size="lg" />
                </CNavLink>
              </CNavItem>
            </CHeaderNav>
            <CHeaderNav>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <CDropdown variant="nav-item" placement="bottom-end">
                <CDropdownToggle caret={false}>
                  {colorMode === 'dark' ? (
                    <CIcon icon={cilMoon} size="lg" />
                  ) : colorMode === 'auto' ? (
                    <CIcon icon={cilContrast} size="lg" />
                  ) : (
                    <CIcon icon={cilSun} size="lg" />
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                  >
                    <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                  >
                    <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                  >
                    <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <AppHeaderDropdown />
            </CHeaderNav>
          </CContainer>
          <CContainer className="px-4" fluid>
            <AppBreadcrumb />
          </CContainer>
        </CHeader>
      )}
    </>
  )
}

export default AppHeader
