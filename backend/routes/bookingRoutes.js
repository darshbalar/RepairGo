const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getTechnicianRequests,
  acceptBooking,
  declineBooking,
  updateTechnicianAvailability,
  updateBookingStatus,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");


// ============================================================
// CUSTOMER
// ============================================================

// Create new booking
router.post(
  "/",
  protect,
  createBooking
);


// Get customer's bookings
// Also returns assigned bookings for technician
router.get(
  "/my",
  protect,
  getMyBookings
);


// ============================================================
// TECHNICIAN
// ============================================================

// Get requests matching technician
router.get(
  "/technician/requests",
  protect,
  getTechnicianRequests
);


// Accept booking
router.patch(
  "/:id/accept",
  protect,
  acceptBooking
);


// Decline booking
router.patch(
  "/:id/decline",
  protect,
  declineBooking
);


// Change technician availability
router.patch(
  "/technician/availability",
  protect,
  updateTechnicianAvailability
);


// ============================================================
// GENERAL BOOKING STATUS
// ============================================================

// Complete / cancel booking
router.patch(
  "/:id/status",
  protect,
  updateBookingStatus
);


module.exports = router;