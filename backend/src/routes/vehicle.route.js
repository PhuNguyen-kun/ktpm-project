const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getVehiclesRequest,
    createVehicleRequest,
    updateVehicleRequest,
} = require("../requests/VehicleRequest");
// Removed validation middleware

router.use(verifyToken);

router.get("/", getVehiclesRequest, vehicleController.getAllVehicles);

router.get("/:id", vehicleController.getVehicleById);

router.post(
    "/",
    isLeader,
    createVehicleRequest,
    vehicleController.createVehicle
);

router.put(
    "/:id",
    isLeader,
    updateVehicleRequest,
    vehicleController.updateVehicle
);

router.delete("/:id", isLeader, vehicleController.deleteVehicle);

module.exports = router;
