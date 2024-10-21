  import React from 'react'
  import CIcon from '@coreui/icons-react'
  import { useSelector, useDispatch } from 'react-redux';
  import {
    cilBell,
    cilCalculator,
    cilChartPie,
    cilCursor,  
    cilDescription,
    cilDrop,
    cilNotes, 
    cilPencil,
    cilPuzzle,
    cilSpeedometer,
    cilStar,
  } from '@coreui/icons'
  import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'


  const userId = localStorage.getItem('userId');

  



// navigationItems.js
export const adminNavItems = [
  // Admin-specific navigation items
  {
    component: CNavItem,  
    name: 'OrangePay',
    to: `/dashboard/${userId}`,
    // to:`/dashboard`,
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
   {
    component: CNavGroup,
    name: 'Management',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Agent Management', to: '/active' },
      { component: CNavItem, name: 'sbdata', to: '/sbdata' },
      // { component: CNavItem, name: 'Inactive Agent', to: '/inactive' },
    ],
  },
  {
    component: CNavGroup,
    name: 'User Management',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Add User' , to: '/add-user' },
      { component: CNavItem, name: 'Fund Request', to: `/fundrequests` },
      { component: CNavItem, name: 'Cancellation Request', to: `/cancellationrequests` },
      // { component: CNavItem, name: 'Manage User', to: '/manage-user' },
      // { component: CNavItem, name: 'Manage User Service', to: '/manage-user-service' },
      // { component: CNavItem, name: 'Manage RePosting Bill', to: '/manage-reposting-bill' },
      // { component: CNavItem, name: 'Manage Bill Fetch', to: '/manage-bill-fetch' },
      // { component: CNavItem, name: 'Manage RRF Mobile No.', to: '/manage-rrf-mobile' },
      // { component: CNavItem, name: 'Manage RRF Limit' , to: '/manage-rrf-limit' },
      // { component: CNavItem, name: 'Manage Unclaimed Txn', to: '/manage-unclaimed-txn'  },
      { component: CNavItem, name: 'Rejected User',  to: '/reject-user' },
      { component: CNavItem, name: 'View User',  to: '/view-user' },
      // { component: CNavItem, name: 'View Consumer Details', to: '/view-consumer-details' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Service Management',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Database Management',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Switch Dataase' , to: '/switch-database' },
      { component: CNavItem, name: 'Switch getway' , to: '/switch-getway' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Reports' , to: '/report' },
      { component: CNavItem, name: 'Fund Reports' , to: '/fund-report' },
    ],
  },
];

export const distributorNavItems = (permissions , userId) =>  [
  // Distributor-specific navigation items
  {
    component: CNavItem,
    name: 'OrangePay',
    to: `/dashboard/${userId}`,
    //  to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavGroup,
    name: 'Services',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Bill Payment', to: '/Payment' , hidden: !permissions.billPayment,},
      { component: CNavItem, name: 'Topup', to: '/topup' , hidden: !permissions.topup, },
      { component: CNavItem, name: 'Get Prepaid Balance', to: '/prepaid-services' ,   hidden: !permissions.getPrepaidBalance, },
      { component: CNavItem, name: 'Cancelation Request', to: '/request-cancelation' ,   hidden: !permissions.requestCancellation, },
    ],
  },
  {
    component: CNavGroup,
    name: 'My Accounts',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Transactions Report-Ezetap', to: '/report-Ezetap' },
      { component: CNavItem, name: 'Transactions Report-OrangePay', to: '/report-OrangePay' },
      // { component: CNavItem, name: 'Fund Request', to: `/fundrequest/${userId}` },
      { component: CNavItem, name: 'Fund Transfer', to: '/report-OrangePay' },
      { component: CNavItem, name: 'Fund Report', to: `/fundrequest/${userId}` },
      { component: CNavItem, name: 'Reports', to: '/report-OrangePay' },
      { component: CNavItem, name: 'Top-Up Report', to: '/report-OrangePay' },
      { component: CNavItem, name: 'Commission History',  to: '/transaction-history' },
      { component: CNavItem, name: 'Cancellattion History',  to: '/cancellattion-history' },
    ],
  },
  {
    component: CNavGroup,
    name: 'My Profile',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      { component: CNavItem,  to: `/profile/${userId}` , name: 'View Profile',},
      { component: CNavItem,  to: `/passbook/${userId}` , name: 'Passbook',},
      { component: CNavItem,  to: `/Wallet-details/${userId}` , name: 'Wallet Report',},
      { component: CNavItem, name: 'Change Password' , to: '/change-password' },
      { component: CNavItem, name: 'Change TPIN' , to: '/change-tpin' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Support Desk',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Query' , to: '/query'  },
      { component: CNavItem, name: 'Call Me' , to: '/call-me'  },
    ],
  },
];

export const agentNavItems = [
  // Agent-specific navigation items
  {
    component: CNavItem,
    name: 'Tasks',
    to: '/tasks',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  // Add more items for agent
];
