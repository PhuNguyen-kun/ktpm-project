const express = require("express");
const authRoute = require("./routes/auth.route");
const householdRoute = require("./routes/household.route");
const residentRoute = require("./routes/resident.route");
const vehicleRoute = require("./routes/vehicle.route");
const feeTypeRoute = require("./routes/fee_type.route");
const feeCampaignRoute = require("./routes/fee_campaign.route");
const householdFeeAssignmentRoute = require("./routes/household_fee_assignment.route");
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
app.use("/api/fee-types", feeTypeRoute);
app.use("/api/fee-campaigns", feeCampaignRoute);
app.use("/api/household-fee-assignments", householdFeeAssignmentRoute);
// Handle 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
