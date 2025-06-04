const express = require("express");
const router = express.Router();
const householdController = require("../controllers/household.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getHouseholdsRequest,
    createHouseholdRequest,
    updateHouseholdRequest,
} = require("../requests/HouseholdRequest");
const validate = require("../middlewares/handleValidation");

router.use(verifyToken);

router.get(
    "/",
    getHouseholdsRequest,
    validate,
    householdController.getAllHouseholds
);

router.get("/:id", householdController.getHouseholdById);

router.post(
    "/",
    isLeader,
    createHouseholdRequest,
    validate,
    householdController.createHousehold
);

router.put(
    "/:id",
    isLeader,
    updateHouseholdRequest,
    validate,
    householdController.updateHousehold
);

router.delete("/:id", isLeader, householdController.deleteHousehold);

module.exports = router;
