const express = require("express");
const router = express.Router();
const feeTypeController = require("../controllers/fee_type.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getFeeTypesRequest,
    createFeeTypeRequest,
    updateFeeTypeRequest,
} = require("../requests/FeeTypeRequest");
// Removed validation middleware

router.use(verifyToken);

router.get("/", getFeeTypesRequest, feeTypeController.getAllFeeTypes);

router.get("/:id", feeTypeController.getFeeTypeById);

router.post("/", createFeeTypeRequest, feeTypeController.createFeeType);

router.put("/:id", updateFeeTypeRequest, feeTypeController.updateFeeType);

router.delete("/:id", feeTypeController.deleteFeeType);

module.exports = router;
