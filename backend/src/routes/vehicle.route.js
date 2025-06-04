const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getVehiclesRequest,
    createVehicleRequest,
    updateVehicleRequest,
} = require("../requests/VehicleRequest");
const validate = require("../middlewares/handleValidation");

router.use(verifyToken);

router.get("/", getVehiclesRequest, validate, vehicleController.getAllVehicles);

router.get("/:id", vehicleController.getVehicleById);

router.post(
    "/",
    isLeader,
    createVehicleRequest,
    validate,
    vehicleController.createVehicle
);

router.put(
    "/:id",
    isLeader,
    updateVehicleRequest,
    validate,
    vehicleController.updateVehicle
);

router.delete("/:id", isLeader, vehicleController.deleteVehicle);

module.exports = router;
