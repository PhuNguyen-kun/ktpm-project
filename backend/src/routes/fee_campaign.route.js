const express = require("express");
const router = express.Router();
const feeCampaignController = require("../controllers/fee_campaign.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getFeeCampaignsRequest,
    createFeeCampaignRequest,
    updateFeeCampaignRequest,
} = require("../requests/FeeCampaignRequest");
const validate = require("../middlewares/handleValidation");

router.use(verifyToken);

router.get(
    "/",
    getFeeCampaignsRequest,
    validate,
    feeCampaignController.getAllFeeCampaigns
);

router.get("/:id", feeCampaignController.getFeeCampaignById);

router.post(
    "/",
    isLeader,
    createFeeCampaignRequest,
    validate,
    feeCampaignController.createFeeCampaign
);

router.put(
    "/:id",
    isLeader,
    updateFeeCampaignRequest,
    validate,
    feeCampaignController.updateFeeCampaign
);

router.delete("/:id", isLeader, feeCampaignController.deleteFeeCampaign);

module.exports = router;
