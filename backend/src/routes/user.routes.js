import { Router } from "express";
import { deleteUser, fetchData, fetchWalletBalance, registeredUser, reports , registerTransaction, fetchFundRequests, fetchIdData, loginUser, registerUser, updateUser, user , fundRequest , fetchFundRequest ,  approveFundRequest , rejectFundRequest  } from "../controller/user.controller.js";


const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/transaction").post(registerTransaction)
router.route("/reports").get(reports)
router.route("/balance/:userId").get(fetchWalletBalance)
router.route("/fund-request/:userId").get(fetchFundRequest)
router.route("/fundrequests").get(fetchFundRequests)
router.route("/fundrequests").patch(approveFundRequest)
router.route("/fundrequests").patch(rejectFundRequest)
router.route("/registered/:id").post(registeredUser)
router.route("/fund-request").post(fundRequest)
router.route("/submit_form").post(user)
router.route("/fetch_data").get(fetchData)
router.route("/update_data/:id").put(updateUser)
router.route("/fetch_unique_data/:id").get(fetchIdData)
router.route("/delete/:id").delete(deleteUser)



export default router