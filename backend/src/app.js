const express = require("express");
const authRoute = require("./routes/auth.route");
const householdRoute = require("./routes/household.route");
const residentRoute = require("./routes/resident.route");
const vehicleRoute = require("./routes/vehicle.route");
const errorHandler = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

// Middleware parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

// Routes
app.use("/api/", authRoute);
app.use("/api/households", householdRoute);
app.use("/api/residents", residentRoute);
app.use("/api/vehicles", vehicleRoute);
// Handle 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
