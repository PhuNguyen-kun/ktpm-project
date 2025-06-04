const express = require("express");
const router = express.Router();
const residentController = require("../controllers/resident.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getResidentsRequest,
    createResidentRequest,
    updateResidentRequest,
} = require("../requests/ResidentRequest");
const validate = require("../middlewares/handleValidation");

router.use(verifyToken);

router.get(
    "/",
    getResidentsRequest,
    validate,
    residentController.getAllResidents
);

router.get("/:id", residentController.getResidentById);

router.post(
    "/",
    isLeader,
    createResidentRequest,
    validate,
    residentController.createResident
);

router.put(
    "/:id",
    isLeader,
    updateResidentRequest,
    validate,
    residentController.updateResident
);

router.delete("/:id", isLeader, residentController.deleteResident);

module.exports = router;
