// import { legacy_createStore as createStore } from 'redux';

// // Retrieve user role from localStorage
// const savedUserRole = localStorage.getItem('username') || '';

// // Initial state
// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
//   isAuthenticated: false,
//   userRole: savedUserRole, // Initialize with the saved user role
// };

// // Action types
// const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
// const SET_USER_ROLE = 'SET_USER_ROLE';
// const LOGOUT = 'LOGOUT';


// // Reducer
// const changeState = (state = initialState, action) => {
//   switch (action.type) {
//     case 'set': 
//       return { ...state, ...action };
//     case SET_AUTHENTICATION:
//       return { ...state, isAuthenticated: action.isAuthenticated };
//     case SET_USER_ROLE:
//       // Update localStorage whenever userRole changes
//       localStorage.setItem('userRole', action.userRole);
//       return { ...state, userRole: action.userRole };
//       case LOGOUT:
//         // Clear localStorage and reset state
//         localStorage.removeItem('username');
//         localStorage.removeItem('userRole');
//         return { ...initialState, sidebarShow: state.sidebarShow, theme: state.theme };
//       default:
//       return state;
//   }
// };

// // Create store
// const store = createStore(changeState); 

// export default store;


// // export const LOGOUT = 'LOGOUT';

// export const logout = () => ({
//   type: LOGOUT,
// });


// import { legacy_createStore as createStore } from 'redux';

// // Retrieve user role from localStorage
// const savedUserRole = localStorage.getItem('username') || '';

// // Initial state
// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
//   isAuthenticated: false,
//   userRole: savedUserRole, // Initialize with the saved user role
// };

// // Action types
// const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
// const SET_USER_ROLE = 'SET_USER_ROLE';
// const LOGOUT = 'LOGOUT';

// // Reducer
// const changeState = (state = initialState, action) => {
//   switch (action.type) {
//     case 'set':
//       return { ...state, ...action };
//     case SET_AUTHENTICATION:
//       return { ...state, isAuthenticated: action.isAuthenticated };
//     case SET_USER_ROLE:
//       // Update localStorage whenever userRole changes
//       localStorage.setItem('userRole', action.userRole);
//       return { ...state, userRole: action.userRole };
//     case LOGOUT:
//       // Clear localStorage and reset state
//       localStorage.removeItem('username');
//       localStorage.removeItem('userRole');
//       return { ...initialState, sidebarShow: state.sidebarShow, theme: state.theme };
//     default:
//       return state;
//   }
// };

// // Create store
// const store = createStore(changeState);

// export default store;

// // Action creators

// // Set authentication action creator
// export const setAuthentication = (isAuthenticated) => ({
//   type: SET_AUTHENTICATION,
//   isAuthenticated,
// });

// // Set user role action creator
// export const setUserRole = (role) => ({
//   type: SET_USER_ROLE,
//   userRole: role,
// });

// // Logout action creator
// export const logout = () => ({
//   type: LOGOUT,
// });
import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store