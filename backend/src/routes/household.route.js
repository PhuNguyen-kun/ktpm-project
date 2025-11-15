const express = require("express");
const router = express.Router();
const householdController = require("../controllers/household.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getHouseholdsRequest,
    createHouseholdRequest,
    updateHouseholdRequest,
} = require("../requests/HouseholdRequest");
// Removed validation middleware

router.use(verifyToken);

router.get("/", getHouseholdsRequest, householdController.getAllHouseholds);

router.get("/:id", householdController.getHouseholdById);

router.post(
    "/",
    isLeader,
    createHouseholdRequest,
    householdController.createHousehold
);

router.put(
    "/:id",
    isLeader,
    updateHouseholdRequest,
    householdController.updateHousehold
);

router.delete("/:id", isLeader, householdController.deleteHousehold);

module.exports = router;
