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








const AppSidebar = () => {
  const dispatch = useDispatch()
  // const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  // const sidebarShow = useSelector((state) => state.sidebarShow)

  const [sidebarShow, setSidebarShow] = useState(true);
  const [unfoldable, setUnfoldable] = useState(false);
  const [role, setRole] = useState(null);


  useEffect(() => {
    // Retrieve the user role from localStorage
    const storedRole = localStorage.getItem('username');
    if (storedRole) {
      setRole(storedRole);
    }

    // Retrieve sidebar visibility and unfoldable state from localStorage (optional)
    const storedSidebarShow = localStorage.getItem('sidebarShow') === 'true';
    const storedUnfoldable = localStorage.getItem('sidebarUnfoldable') === 'true';
    setSidebarShow(storedSidebarShow || true);
    setUnfoldable(storedUnfoldable || false);
  }, []);

  useEffect(() => {
    // Store sidebar visibility and unfoldable state in localStorage
    localStorage.setItem('sidebarShow', sidebarShow);
    localStorage.setItem('sidebarUnfoldable', unfoldable);
  }, [sidebarShow, unfoldable]);

  // const role = useSelector((state) => state.userRole); // Access the correct property
  let navigation;

  switch (role) {
    case 'dummy':   
      navigation = adminNavItems;
      break;
    // case 'TEST7982':
    //   navigation = distributorNavItems;
    //   break;
    // case 'agent':
    //   navigation = agentNavItems;
    //   break;
    default:
      navigation = distributorNavItems; // Default or empty navigation
      break;
  }   

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
        <CSidebarBrand to="/">
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
