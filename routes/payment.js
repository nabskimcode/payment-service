const express = require("express");
const router = express.Router();

const {
  payment,
  postEvents,
  successfulpay,
  cancelorder,
} = require("../controllers/payment");

//router.post("/pay", payment);
router.post("/postEvent", payment);
router.get("/success", successfulpay);
router.get("/cancel", cancelorder);
router.post("/cancel", cancelorder);
module.exports = router;
