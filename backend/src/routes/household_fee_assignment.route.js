const express = require("express");
const router = express.Router();
const householdFeeAssignmentController = require("../controllers/household_fee_assignment.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getHouseholdFeeAssignmentsRequest,
    createHouseholdFeeAssignmentRequest,
    updateHouseholdFeeAssignmentRequest,
} = require("../requests/HouseholdFeeAssignmentRequest");
const validate = require("../middlewares/handleValidation");

router.use(verifyToken);

router.get(
    "/",
    getHouseholdFeeAssignmentsRequest,
    validate,
    householdFeeAssignmentController.getAllHouseholdFeeAssignments
);

router.get(
    "/:id",
    householdFeeAssignmentController.getHouseholdFeeAssignmentById
);

router.post(
    "/",
    isLeader,
    createHouseholdFeeAssignmentRequest,
    validate,
    householdFeeAssignmentController.createHouseholdFeeAssignment
);

router.put(
    "/:id",
    isLeader,
    updateHouseholdFeeAssignmentRequest,
    validate,
    householdFeeAssignmentController.updateHouseholdFeeAssignment
);

router.delete(
    "/:id",
    isLeader,
    householdFeeAssignmentController.deleteHouseholdFeeAssignment
);

module.exports = router;
