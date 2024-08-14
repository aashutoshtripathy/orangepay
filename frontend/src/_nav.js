import React from 'react'
import CIcon from '@coreui/icons-react'
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

const _nav = [
  {
    component: CNavItem,
    name: 'OrangePay',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  // {
  //   component: CNavTitle,
  //   name: 'User Management',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Add User',
  //   // to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavGroup,
    name: 'User Management',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add User',
        // to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'View User',
        // to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Manage User',
        // to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Manage User Service',
        // to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Manage RePosting Bill',
        // to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'Manage Bill Fetch',
        // to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Manage RRF Mobile No.',
        // to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'View Consumer Details',
        // to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Manage RRF Limit',
        // to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Manage Unclaimed Txn',
        // to: '/base/popovers',
      },
      // {
      //   component: CNavItem,
      //   name: 'Progress',
      //   to: '/base/progress',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Spinners',
      //   to: '/base/spinners',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tables',
      //   to: '/base/tables',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tabs',
      //   to: '/base/tabs',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Tooltips',
      //   to: '/base/tooltips',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Service Management',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    // items: [
    //   {
    //     component: CNavItem,
    //     name: 'Buttons',
    //     to: '/buttons/buttons',
    //   },
    //   {
    //     component: CNavItem,
    //     name: 'Buttons groups',
    //     to: '/buttons/button-groups',
    //   },
    //   {
    //     component: CNavItem,
    //     name: 'Dropdowns',
    //     to: '/buttons/dropdowns',
    //   },
    // ],
  },
  {
    component: CNavGroup,
    name: 'Database Management',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Monthly Billing Master',
        // to: '/forms/form-control',
      },
      // {
      //   component: CNavItem,
      //   name: 'Select',
      //   to: '/forms/select',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Checks & Radios',
      //   to: '/forms/checks-radios',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Range',
      //   to: '/forms/range',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Input Group',
      //   to: '/forms/input-group',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Floating Labels',
      //   to: '/forms/floating-labels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Layout',
      //   to: '/forms/layout',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Validation',
      //   to: '/forms/validation',
      // },
    ],
  },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Reports',
        // to: '/forms/form-control',
      },
      // {
      //   component: CNavItem,
      //   name: 'Select',
      //   to: '/forms/select',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Checks & Radios',
      //   to: '/forms/checks-radios',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Range',
      //   to: '/forms/range',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Input Group',
      //   to: '/forms/input-group',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Floating Labels',
      //   to: '/forms/floating-labels',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Layout',
      //   to: '/forms/layout',
      // },
      // {
      //   component: CNavItem,
      //   name: 'Validation',
      //   to: '/forms/validation',
      // },
    ],
  },
//   {
//     component: CNavItem,
//     name: 'Reports',
//     to: '/charts',
//     icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavGroup,
//     name: 'Icons',
//     icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'CoreUI Free',
//         to: '/icons/coreui-icons',
//         badge: {
//           color: 'success',
//           text: 'NEW',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'CoreUI Flags',
//         to: '/icons/flags',
//       },
//       {
//         component: CNavItem,
//         name: 'CoreUI Brands',
//         to: '/icons/brands',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Notifications',
//     icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Alerts',
//         to: '/notifications/alerts',
//       },
//       {
//         component: CNavItem,
//         name: 'Badges',
//         to: '/notifications/badges',
//       },
//       {
//         component: CNavItem,
//         name: 'Modal',
//         to: '/notifications/modals',
//       },
//       {
//         component: CNavItem,
//         name: 'Toasts',
//         to: '/notifications/toasts',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Widgets',
//     to: '/widgets',
//     icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
//     badge: {
//       color: 'info',
//       text: 'NEW',
//     },
//   },
//   {
//     component: CNavTitle,
//     name: 'Extras',
//   },
//   {
//     component: CNavGroup,
//     name: 'Pages',
//     icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Login',
//         to: '/login',
//       },
//       {
//         component: CNavItem,
//         name: 'Register',
//         to: '/register',
//       },
//       {
//         component: CNavItem,
//         name: 'Error 404',
//         to: '/404',
//       },
//       {
//         component: CNavItem,
//         name: 'Error 500',
//         to: '/500',
//       },
//       {
//         component: CNavItem,
//         name: 'RequestedUser',
//         to: '/requests',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Docs',
//     href: 'https://coreui.io/react/docs/templates/installation/',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//   },
]

export default _nav
