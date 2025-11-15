const express = require("express");
const router = express.Router();
const feeCampaignController = require("../controllers/fee_campaign.controller");
const { verifyToken, isLeader } = require("../middlewares/auth.middleware");
const {
    getFeeCampaignsRequest,
    createFeeCampaignRequest,
    updateFeeCampaignRequest,
} = require("../requests/FeeCampaignRequest");
// Validation middleware removed

router.use(verifyToken);

router.get("/", feeCampaignController.getAllFeeCampaigns);

router.get("/:id", feeCampaignController.getFeeCampaignById);

router.post("/", feeCampaignController.createFeeCampaign);

router.put("/:id", feeCampaignController.updateFeeCampaign);

router.delete("/:id", feeCampaignController.deleteFeeCampaign);

module.exports = router;
