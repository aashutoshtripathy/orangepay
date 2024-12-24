import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const OrangePayReports = React.lazy(() => import('./views/pages/reports/OrangePayReportt.js'))
const EzetapReports = React.lazy(() => import('./views/pages/reports/EzeTapReport'))
const Profile = React.lazy(() => import('./views/pages/profile/Profile'))
const RequestFundPage = React.lazy(() => import('./views/pages/profile/RequestFundPage.js'))
const RequestedUser = React.lazy(() => import('./views/pages/requesteduser/RequestedUser'))
const FundRequest = React.lazy(() => import('./views/pages/fundrequest/FundRequesttt.js'))
const FundRequests = React.lazy(() => import('./views/pages/fundrequest/fundRequests'))
const ViewUser = React.lazy(() => import('./views/pages/reports/ViewUser'))
const CallMe = React.lazy(() => import('./views/pages/supportdesk/CallMe'))
const ContactUs = React.lazy(() => import('./views/pages/supportdesk/ContactUs.js'))
const Query = React.lazy(() => import('./views/pages/supportdesk/Query'))
const Active = React.lazy(() => import('./views/pages/mynetwork/ActiveAgent'))
const InActive = React.lazy(() => import('./views/pages/mynetwork/InActiveAgent'))
const ChangePassword = React.lazy(() => import('./views/pages/profile/ChangePassword'))
const ChangeTpin = React.lazy(() => import('./views/pages/profile/ChangeTpin.js'))
const MonthlyBill = React.lazy(() => import('./views/pages/databasemanagement/MonthlyBilling'))
const SwitchDatabase = React.lazy(() => import('./views/pages/databasemanagement/SwitchDatabase'))
const SwitchGetway = React.lazy(() => import('./views/pages/databasemanagement/SwitchGetway'))
const sbdata = React.lazy(() => import('./views/pages/databasemanagement/SbData.js'))
const Reports = React.lazy(() => import('./views/pages/reports/Reports'))
const DailyCollectionReports = React.lazy(() => import('./views/pages/reports/DailyCollection.js'))
const DailyFundReports = React.lazy(() => import('./views/pages/reports/Reports'))
const AddUser = React.lazy(() => import('./views/pages/usermangement/AddUser'))
const AddUserDistributor = React.lazy(() => import('./views/pages/usermangement/DistributorAdd.js'))
const AddUserAdmin = React.lazy(() => import('./views/pages/usermangement/AdminAdd.js'))

const ManageUser = React.lazy(() => import('./views/pages/usermangement/ManageUser'))
const ConsumerDetails = React.lazy(() => import('./views/pages/usermangement/ConsumerDetails'))
const ManageRePosting = React.lazy(() => import('./views/pages/usermangement/ManageRePosting'))
const ManageRRFLimit = React.lazy(() => import('./views/pages/usermangement/ManageRRFLimit'))
const ManageUserService = React.lazy(() => import('./views/pages/usermangement/ManageUserService'))
const ManageUnclaimedTXN = React.lazy(() => import('./views/pages/usermangement/ManageUnclaimedTXN'))
const ManageRRF = React.lazy(() => import('./views/pages/usermangement/ManageRRF'))
const ManageBillFetch = React.lazy(() => import('./views/pages/usermangement/ManageBillFetch'))
const FundReport = React.lazy(() => import('./views/pages/reports/FundReport'))
const RejectedUser = React.lazy(() => import('./views/pages/usermangement/RejectedUser.js'))
const UpdateUser = React.lazy(() => import('./views/pages/profile/UpdateProfile.js'))
const Payment = React.lazy(() => import('./views/pages/payment/Payment.js'))
const PaymentOnline = React.lazy(() => import('./views/pages/payment/PaymentOnline.js'))
const PaymentOn = React.lazy(() => import('./views/pages/payment/PaymentOn.js'))
const Topup = React.lazy(() => import('./views/pages/payment/Topup.js'))
const Prepaid = React.lazy(() => import('./views/pages/payment/Prepaid.js'))
const PrepaidRecharge = React.lazy(() => import('./views/pages/payment/PrepaidRecharge.js'))
const Cancelation = React.lazy(() => import('./views/pages/payment/Cancelation.js'))
const CancellationDetails = React.lazy(() => import('./views/pages/payment/CancellationDetails.js'))
const Permission = React.lazy(() => import('./views/pages/payment/Permission.js'))
const ViewDetails = React.lazy(() => import('./views/pages/requesteduser/ViewTable.js'))
const ViewDetailss = React.lazy(() => import('./views/pages/reports/ViewDetailss.js'))
const FundDetails = React.lazy(() => import('./views/pages/fundrequest/FundRequestDatails.js'))
const Passbook = React.lazy(() => import('./views/pages/passbook/Passbookk.js'))
const CancellationHistory = React.lazy(() => import('./views/pages/usermangement/CancellationHistoryyy.js'))
const CancellationRequest = React.lazy(() => import('./views/pages/usermangement/CancellationRequest.js'))
const CancellationDetailss = React.lazy(() => import('./views/pages/usermangement/CancellationDetailss.js'))
const WalletReport = React.lazy(() => import('./views/pages/reports/WalletReportt.js'))
const TopupReport = React.lazy(() => import('./views/pages/reports/TopupReportt.js'))

const SuperAdminReport = React.lazy(() => import('./views/pages/reports/SuperAdmin.js'))
const RepostingBill = React.lazy(() => import('./views/pages/reports/RepostingBill.js'))


const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))
const TransactionHistory = React.lazy(() => import('./views/pages/usermangement/TransactionHistoryyyy.js'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  // { path: '/login', name: 'Login Page', element: Login },
  { path: '/report-OrangePay', name: 'OrangePay Reports', element: OrangePayReports },
  { path: '/report-Ezetap', name: 'Ezetap Reports', element: EzetapReports },
  { path: '/profile/:userId', name: 'Profile Page', element: Profile },
  { path: '/dashboard/:id',  name: 'Dashboard', element: Dashboard },
  { path: '/fundrequest/:userId', name: 'Fund Request', element: FundRequest },
  { path: '/requests', name: 'RequestedUser', element: RequestedUser },
  { path: '/fundrequests', name: 'Fund Request', element: FundRequests },
  { path: '/view-user', name: 'VIEW USER', element: ViewUser },
  { path: '/transaction-history', name: 'COMISSION HISTORY', element: TransactionHistory },
  { path: '/call-me', name: 'CALL ME', element: CallMe },
  { path: '/query', name: 'QUERY', element: Query },
  { path: '/active',  name: 'Active Agents', element: Active },
  { path: '/inactive', name: 'IN-ACTIVE', element: InActive },
  { path: '/change-password', name: 'CHANGE PASSWORD', element: ChangePassword },
  { path: '/change-tpin', name: 'CHANGE TPIN', element: ChangeTpin },
  { path: '/monthly-billing', name: 'Monthly Billing Master', element: MonthlyBill },
  { path: '/report', name: 'Report', element: Reports },
  { path: '/daily-collection-report', name: 'Report', element: DailyCollectionReports },
  { path: '/daily-fund-report', name: 'Report', element: DailyFundReports },
  { path: '/add-user', name: 'Add User', element: AddUser },
  { path: '/add-user-distributor', name: 'Add User', element: AddUserDistributor },
  { path: '/add-user-admin', name: 'Add User', element: AddUserAdmin },
  { path: '/manage-user', name: 'Manage User', element: ManageUser },
  { path: '/manage-user-service', name: 'Report', element: ManageUserService },
  { path: '/manage-reposting-bill', name: 'Report', element: ManageRePosting },
  { path: '/manage-bill-fetch', name: 'Report', element: ManageBillFetch },
  { path: '/switch-database', name: 'Report', element: SwitchDatabase },
  { path: '/switch-getway', name: 'Report', element: SwitchGetway },
  { path: '/manage-rrf-mobile', name: 'Report', element: ManageRRF },
  { path: '/view-consumer-details', name: 'Report', element: ConsumerDetails },
  { path: '/manage-rrf-limit', name: 'Report', element: ManageRRFLimit },
  { path: '/manage-unclaimed-txn', name: 'Report', element: ManageUnclaimedTXN },
  { path: '/fund-report', name: 'Report', element: FundReport },
  { path: '/reject-user', name: 'Rejected User', element: RejectedUser },
  { path: '/payment', name: 'Payment', element: Payment },
  { path: '/permission/:userId', name: 'Payment', element: Permission },
  { path: '/topup', name: 'TopUp', element: Topup },
  { path: '/prepaid-balance-services', name: 'Prepaid-Balance', element: Prepaid },
  // { path: '/prepaid-balance-services', name: 'Prepaid-Balance', element: PrepaidRecharge },
  { path: '/request-cancelation', name: 'Request-Cancelation', element: Cancelation },
  { path: '/request-cancelation-details', name: 'Cancelation-Details', element: CancellationDetails },
  { path: '/update-user/:userId', name: 'Update User', element: UpdateUser },
  { path: '/view-details/:userId', name: 'View Details', element: ViewDetails },
  { path: '/fund-details/:userId', name: 'Fund Details', element: FundDetails },
  { path: '/passbook/:userId', name: 'Passbook', element: Passbook },
  { path: '/cancellattion-history', name: 'Cancellation History', element: CancellationHistory },
  { path: '/cancellationrequests', name: 'Cancellation Request', element: CancellationRequest },
  { path: '/cancellation-details', name: 'Cancellation Details', element: CancellationDetailss },
  { path: '/Wallet-details/:userId', name: 'Wallet Details', element: WalletReport },
  { path: '/Topup-details/:userId', name: 'Wallet Details', element: TopupReport },
  { path: '/sbdata', name: 'Data', element: sbdata },
  { path: '/view-detailss', name: 'Agent Details', element: ViewDetailss },
  { path: '/reports/:userId', name: 'View Details', element: SuperAdminReport },
  { path: '/paymentonline', name: 'Payment', element: PaymentOnline },
  { path: '/paymenton', name: 'Payment', element: PaymentOn },
  { path: '/contact-us', name: 'Contact Us', element: ContactUs },
  { path: '/request-fund', name: 'Request Fund', element: RequestFundPage },
  { path: '/re-posting-bill', name: 'Request Fund', element: RepostingBill },
 
  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', element: Colors },
  // { path: '/theme/typography', name: 'Typography', element: Typography },
  // { path: '/base', name: 'Base', element: Cards, exact: true },
  // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tabs', name: 'Tabs', element: Tabs },
  // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  // { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
