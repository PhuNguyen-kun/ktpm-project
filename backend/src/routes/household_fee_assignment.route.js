const express = require("express");
const router = express.Router();
const householdFeeAssignmentController = require("../controllers/household_fee_assignment.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getHouseholdFeeAssignmentsRequest,
    createHouseholdFeeAssignmentRequest,
    updateHouseholdFeeAssignmentRequest,
    batchCreateHouseholdFeeAssignmentRequest,
} = require("../requests/HouseholdFeeAssignmentRequest");
// Validation middleware removed

router.use(verifyToken);

router.get("/", householdFeeAssignmentController.getAllHouseholdFeeAssignments);

router.get(
    "/:id",
    householdFeeAssignmentController.getHouseholdFeeAssignmentById
);

router.post("/", householdFeeAssignmentController.createHouseholdFeeAssignment);

router.post(
    "/batch",
    householdFeeAssignmentController.batchCreateHouseholdFeeAssignments
);

router.put(
    "/:id",
    householdFeeAssignmentController.updateHouseholdFeeAssignment
);

router.delete(
    "/:id",
    householdFeeAssignmentController.deleteHouseholdFeeAssignment
);

module.exports = router;
