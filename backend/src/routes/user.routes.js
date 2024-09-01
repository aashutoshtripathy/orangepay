import { Router } from "express";
import { deleteUser, fetchData, fetchWalletBalance,fetchData_reject, registeredUser, reports , registerTransaction, fetchFundRequests, fetchIdData, loginUser, registerUser, fetchUserList, updateUser, user , fundRequest , fetchFundRequest ,  approveFundRequest , rejectFundRequest , approveUserRequest , rejectUserRequest , fetchUserById } from "../controller/user.controller.js";


const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/transaction").post(registerTransaction)
router.route("/reports").get(reports)
router.route("/balance/:userId").get(fetchWalletBalance)
router.route("/fund-request/:userId").get(fetchFundRequest)
router.route("/fundrequests").get(fetchFundRequests)
router.route("/fetchUserList").get(fetchUserList)
router.route("/fetchUserById/:id").get(fetchUserById)
router.route("/fundrequests/:id/approve").patch(approveFundRequest)
router.route("/fundrequests/:id/reject").patch(rejectFundRequest)
router.route("/users/:id/approve").patch(approveUserRequest)
router.route("/users/:id/reject").patch(rejectUserRequest)
router.route("/registered/:id").post(registeredUser)
router.route("/fund-request").post(fundRequest)
router.route("/submit_form").post(user)
router.route("/fetch_data").get(fetchData)
router.route("/fetch_data_rejected").get(fetchData_reject)
router.route("/update_data/:id").put(updateUser)
router.route("/fetch_unique_data/:id").get(fetchIdData)
router.route("/delete/:id").delete(deleteUser)



export default router