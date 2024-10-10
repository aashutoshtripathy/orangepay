import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { deleteUser, fetchData, fetchWalletBalance,changePassword,verifyAadhaar,fetchUserListbyId,updateUserCommission,updateUserPermissions,statuss,blockUserList,fetchFundRequestsById,fetchData_reject,fetchDataa,images, registeredUser, reports , registerTransaction, fetchFundRequests, fetchIdData, loginUser, registerUser, fetchUserList, updateUser , fundRequest , fetchFundRequest ,  approveFundRequest , rejectFundRequest , approveUserRequest , rejectUserRequest , fetchUserById , downloadUserImages , updateProfile , unblockUser , blockUser , logoutUser, fetchUserByIdd } from "../controller/user.controller.js";
import {processPayment, getPayment , fetchReward , BiharService , getTotalBalance} from "../controller/payment.controller.js"
import { initiateEzetapPayment } from "../controller/ezetap.controller.js";


const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/transaction").post(registerTransaction)
router.route("/reports").get(reports)
router.route("/getPayment/:userId").get(getPayment)
router.route("/balance/:userId").get(fetchWalletBalance)
router.route("/fund-request/:userId").get(fetchFundRequest)
router.route("/fundrequests").get(fetchFundRequests)
router.route("/fundrequests/:id").get(fetchFundRequestsById)
router.route("/fetchUserList").get(fetchUserList)
router.route("/getTotalBalance").get(getTotalBalance)
router.route("/fetchUserList/:userId").get(fetchUserListbyId)
router.route("/status/:userId").get(statuss)
router.route("/blockUserList").get(blockUserList)
router.route("/download-images/:aadharNumber").get(downloadUserImages)
router.route("/fetchUserById/:id").get(fetchUserById)
router.route("/fetchUserByIdd/:id").get(fetchUserByIdd)
router.route("/updateProfile/:id").put(updateProfile)
router.route("/fundrequests/:id/approve").patch(approveFundRequest)
router.route("/fundrequests/:id/reject").patch(rejectFundRequest)
router.route("/users/:id/approve").patch(approveUserRequest)
router.route("/users/:id/reject").patch(rejectUserRequest)
router.route("/registered/:id").post(registeredUser)
router.route("/fund-request").post(fundRequest)
router.route('/logout').post(logoutUser); 
router.route("/payment").post(processPayment)
router.route("/change-password").post(changePassword)
router.route("/verify-aadhaar").post(verifyAadhaar)
router.route("/BiharService/BillInterface").post(BiharService)
router.route("/block/:userId").post(blockUser)
router.route("/unblock/:userId").post(unblockUser)
router.route("/fetch_data").get(fetchData)
router.route("/images/:userId/:imageFileName").get(images)
router.route("/fetch-data/:userId").get(fetchDataa)
router.route("/fetch_data_rejected").get(fetchData_reject)
router.route("/update_data/:id").put(updateUser)
router.route("/fetch_unique_data/:id").get(fetchIdData)
router.route("/fetch_reward/:userId").get(fetchReward)
router.route("/delete/:id").delete(deleteUser)
router.route("/updateUserPermissions/:userId").put(updateUserPermissions)
router.route("/updateCommission/:userId").put(updateUserCommission)
router.route("/ezetap").post(initiateEzetapPayment)


export default router