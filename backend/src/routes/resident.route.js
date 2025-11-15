const express = require("express");
const router = express.Router();
const residentController = require("../controllers/resident.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getResidentsRequest,
    createResidentRequest,
    updateResidentRequest,
} = require("../requests/ResidentRequest");
// Removed validation middleware

router.use(verifyToken);

router.get("/", getResidentsRequest, residentController.getAllResidents);

router.get("/:id", residentController.getResidentById);

router.post(
    "/",
    isLeader,
    createResidentRequest,
    residentController.createResident
);

router.put(
    "/:id",
    isLeader,
    updateResidentRequest,
    residentController.updateResident
);

router.delete("/:id", isLeader, residentController.deleteResident);

module.exports = router;
