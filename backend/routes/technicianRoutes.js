const express = require("express");
const router = express.Router();
const { searchNearbyTechnicians } = require("../controllers/technicianController");
const protect = require("../middleware/authMiddleware");

// Protected: only logged-in customers should search (keeps technician data from being scraped publicly)
router.get("/search", protect, searchNearbyTechnicians);

module.exports = router;
