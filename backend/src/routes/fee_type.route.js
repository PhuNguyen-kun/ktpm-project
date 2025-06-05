const express = require("express");
const router = express.Router();
const feeTypeController = require("../controllers/fee_type.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getFeeTypesRequest,
    createFeeTypeRequest,
    updateFeeTypeRequest,
} = require("../requests/FeeTypeRequest");
const validate = require("../middlewares/handleValidation");

router.use(verifyToken);

router.get("/", getFeeTypesRequest, validate, feeTypeController.getAllFeeTypes);

router.get("/:id", feeTypeController.getFeeTypeById);

router.post(
    "/",
    isLeader,
    createFeeTypeRequest,
    validate,
    feeTypeController.createFeeType
);

router.put(
    "/:id",
    isLeader,
    updateFeeTypeRequest,
    validate,
    feeTypeController.updateFeeType
);

router.delete("/:id", isLeader, feeTypeController.deleteFeeType);

module.exports = router;
