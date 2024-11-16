import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'


import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'


// import { logo } from 'src/assets/brand/logo'
// import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
// import { _nav as navigation } from '../_nav';
import { adminNavItems, distributorNavItems, agentNavItems } from '../_nav'; // Adjust import as necessary
import axios from 'axios'








const AppSidebar = () => {
  const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)

  // const [sidebarShow, setSidebarShow] = useState(true);
  // const [unfoldable, setUnfoldable] = useState(false);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState({}) // To store API response for permissions
  const userId = localStorage.getItem('userId')



  useEffect(() => {
    // Retrieve the user role from localStorage
    const storedRole = localStorage.getItem('status');
    if (storedRole) {
      setRole(storedRole);
    }

    // Retrieve sidebar visibility and unfoldable state from localStorage (optional)
    // const storedSidebarShow = localStorage.getItem('sidebarShow') === 'true';
    // const storedUnfoldable = localStorage.getItem('sidebarUnfoldable') === 'true';
    // setSidebarShow(storedSidebarShow || true);
    // setUnfoldable(storedUnfoldable || false);
  }, []);

  // useEffect(() => {
  //   // Store sidebar visibility and unfoldable state in localStorage
  //   localStorage.setItem('sidebarShow', sidebarShow);
  //   localStorage.setItem('sidebarUnfoldable', unfoldable);
  // }, [sidebarShow, unfoldable]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList/${userId}`);
        const result = response.data.fetchUser || {};
  
        // Store the permissions for sidebar visibility
        setPermissions({
          topup: result.topup || false,
          billPayment: result.billPayment || false,
          requestCancellation: result.requestCancellation || false,
          getPrepaidBalance: result.getPrepaidBalance || false,
          fundRequest: result.fundRequest || false,
        });
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };
  
    fetchData();
  }, [userId]);

  // const role = useSelector((state) => state.userRole); // Access the correct property
  let navItems = [];

  switch (role) {
    case 'Activated':
      navItems = adminNavItems;
      break;
    // case 'agent':
    //   navItems = agentNavItems;
    //   break;
    default:
      navItems = distributorNavItems(permissions,userId); // Use the distributorNavItems function if it takes permissions
      break;
  }
 

  const filteredNavItems = navItems.filter(item => {
    // Example: check if the item needs certain permissions
    if (item.name === 'Topup' && !permissions.topup) {
      return false;
    }
    if (item.name === 'Bill Payment' && !permissions.billPayment) {
      return false;
    }
    if (item.name === 'Bill Payment' && !permissions.getPrepaidBalance) {
      return false;
    }
    if (item.name === 'Bill Payment' && !permissions.requestCancellation) {
      return false;
    }
    // Add other permission checks as needed
    return !item.hidden; // Filter out hidden items
  });
  

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        {/* <CSidebarBrand to="/"> */}
        <h2
              style={{
                color: '#f36c23',
                fontSize: '36px',
                fontWeight: 'bold',
                fontFamily: 'Cooper Black',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              OrangePay
            </h2>
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        {/* </CSidebarBrand> */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={filteredNavItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
