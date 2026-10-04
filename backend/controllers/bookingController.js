const Booking = require("../models/Booking");
const User = require("../models/User");


// ============================================================
// CREATE BOOKING
// POST /api/bookings
// ============================================================

exports.createBooking = async (req, res) => {
  try {
    const {
      services,
      subtotal,
      discount,
      total,
      paymentMethod,
      serviceAddress,
    } = req.body;

    // --------------------------------------------------------
    // Basic validation
    // --------------------------------------------------------

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        message: "Please select at least one service",
      });
    }

    if (!serviceAddress) {
      return res.status(400).json({
        message: "Service address is required",
      });
    }

    if (!paymentMethod || !["online", "cash"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // --------------------------------------------------------
    // Validate address
    // --------------------------------------------------------

    const requiredAddressFields = [
      "name",
      "phone",
      "house",
      "area",
      "city",
      "pincode",
    ];

    for (const field of requiredAddressFields) {
      if (!serviceAddress[field]) {
        return res.status(400).json({
          message: `${field} is required in service address`,
        });
      }
    }

    // --------------------------------------------------------
    // All categories currently available in RepairGo
    // --------------------------------------------------------

    const allowedCategories = [
      "electrician",
      "plumber",
      "ac_repair",
      "appliance_repair",
      "carpenter",
      "ro_service",
      "tv_repair",
      "washing_machine",
      "home_cleaning",
    ];

    // --------------------------------------------------------
    // Clean services
    // --------------------------------------------------------

    const cleanedServices = services.map((service) => ({
      serviceId: String(service.serviceId || service.id),
      name: service.name,
      price: Number(service.price),
      quantity: Number(service.quantity || 1),
      category: service.category,
    }));

    // --------------------------------------------------------
    // Validate services
    // --------------------------------------------------------

    for (const service of cleanedServices) {
      if (
        !service.serviceId ||
        !service.name ||
        !service.category ||
        !allowedCategories.includes(service.category) ||
        Number.isNaN(service.price) ||
        service.price < 0 ||
        service.quantity < 1
      ) {
        console.log("Invalid service received:", service);

        return res.status(400).json({
          message: "Invalid service information",
        });
      }
    }

    // --------------------------------------------------------
    // Payment status
    // --------------------------------------------------------

    const paymentStatus =
      paymentMethod === "cash"
        ? "cash_on_service"
        : "pending";

    // --------------------------------------------------------
    // Create booking
    // --------------------------------------------------------

    const booking = await Booking.create({
      customerId: req.userId,

      technicianId: null,

      services: cleanedServices,

      subtotal: Number(subtotal || 0),
      discount: Number(discount || 0),
      total: Number(total || 0),

      paymentMethod,
      paymentStatus,

      serviceAddress: {
        name: serviceAddress.name,
        phone: serviceAddress.phone,
        house: serviceAddress.house,
        area: serviceAddress.area,
        city: serviceAddress.city,
        pincode: serviceAddress.pincode,
      },

      declinedBy: [],

      status: "pending",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Could not create booking",
      error: error.message,
    });
  }
};


// ============================================================
// GET MY BOOKINGS
// GET /api/bookings/my
// ============================================================

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        {
          customerId: req.userId,
        },
        {
          technicianId: req.userId,
        },
      ],
    })
      .populate(
        "customerId",
        "name email phone"
      )
      .populate(
        "technicianId",
        "name email phone category experience"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      bookings,
    });

  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Could not fetch bookings",
      error: error.message,
    });
  }
};


// ============================================================
// GET TECHNICIAN REQUESTS
// GET /api/bookings/technician/requests
// ============================================================

exports.getTechnicianRequests = async (req, res) => {
  try {
    const technician = await User.findById(req.userId);

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found",
      });
    }

    if (technician.role !== "technician") {
      return res.status(403).json({
        message: "Only technicians can access requests",
      });
    }

    if (technician.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Your profile is not verified yet",
      });
    }

    if (technician.profileStatus !== "active") {
      return res.status(403).json({
        message: "Your technician profile is inactive",
      });
    }

    if (!technician.isAvailable) {
      return res.json({
        requests: [],
        message: "You are currently unavailable",
      });
    }

    if (!technician.category) {
      return res.json({
        requests: [],
        message: "Technician category is not configured",
      });
    }

    const technicianCity =
      String(technician.city || "")
        .trim()
        .toLowerCase();

    if (!technicianCity) {
      return res.json({
        requests: [],
        message: "Technician service city is not configured",
      });
    }

    const bookings = await Booking.find({
      status: "pending",

      technicianId: null,

      declinedBy: {
        $ne: technician._id,
      },

      "services.category": technician.category,

      "serviceAddress.city": {
        $regex: `^${technicianCity}$`,
        $options: "i",
      },
    })
      .populate(
        "customerId",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      requests: bookings,
    });

  } catch (error) {
    console.error(
      "Get technician requests error:",
      error
    );

    res.status(500).json({
      message: "Could not fetch technician requests",
      error: error.message,
    });
  }
};


// ============================================================
// ACCEPT BOOKING
// PATCH /api/bookings/:id/accept
// ============================================================

exports.acceptBooking = async (req, res) => {
  try {
    const technician = await User.findById(req.userId);

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found",
      });
    }

    if (technician.role !== "technician") {
      return res.status(403).json({
        message: "Only technicians can accept bookings",
      });
    }

    if (technician.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Technician is not verified",
      });
    }

    if (technician.profileStatus !== "active") {
      return res.status(403).json({
        message: "Technician profile is inactive",
      });
    }

    if (!technician.isAvailable) {
      return res.status(403).json({
        message: "You are currently unavailable",
      });
    }

    const existingBooking = await Booking.findById(
      req.params.id
    );

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const categoryMatches =
      existingBooking.services.some(
        (service) =>
          service.category === technician.category
      );

    if (!categoryMatches) {
      return res.status(403).json({
        message:
          "This booking does not match your service category",
      });
    }

    const technicianCity =
      String(technician.city || "")
        .trim()
        .toLowerCase();

    const bookingCity =
      String(
        existingBooking.serviceAddress.city || ""
      )
        .trim()
        .toLowerCase();

    if (
      !technicianCity ||
      !bookingCity ||
      technicianCity !== bookingCity
    ) {
      return res.status(403).json({
        message:
          "This booking is outside your service city",
      });
    }

    // --------------------------------------------------------
    // ATOMIC ACCEPT
    // --------------------------------------------------------

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,

        status: "pending",

        technicianId: null,

        declinedBy: {
          $ne: technician._id,
        },
      },

      {
        $set: {
          technicianId: technician._id,
          status: "accepted",
        },
      },

      {
        new: true,
      }
    )
      .populate(
        "customerId",
        "name email phone"
      )
      .populate(
        "technicianId",
        "name email phone category experience"
      );

    if (!booking) {
      return res.status(409).json({
        message:
          "This booking has already been accepted by another technician",
      });
    }

    res.json({
      message: "Booking accepted successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Accept booking error:",
      error
    );

    res.status(500).json({
      message: "Could not accept booking",
      error: error.message,
    });
  }
};


// ============================================================
// DECLINE BOOKING
// PATCH /api/bookings/:id/decline
// ============================================================

exports.declineBooking = async (req, res) => {
  try {
    const technician = await User.findById(req.userId);

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found",
      });
    }

    if (technician.role !== "technician") {
      return res.status(403).json({
        message: "Only technicians can decline requests",
      });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,

        status: "pending",

        technicianId: null,
      },

      {
        $addToSet: {
          declinedBy: technician._id,
        },
      },

      {
        new: true,
      }
    );

    if (!booking) {
      return res.status(409).json({
        message:
          "This booking has already been accepted or is no longer available",
      });
    }

    res.json({
      message: "Booking request declined",
      booking,
    });

  } catch (error) {
    console.error(
      "Decline booking error:",
      error
    );

    res.status(500).json({
      message: "Could not decline booking",
      error: error.message,
    });
  }
};


// ============================================================
// UPDATE TECHNICIAN AVAILABILITY
// PATCH /api/bookings/technician/availability
// ============================================================

exports.updateTechnicianAvailability = async (
  req,
  res
) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message:
          "isAvailable must be true or false",
      });
    }

    const technician = await User.findOneAndUpdate(
      {
        _id: req.userId,
        role: "technician",
      },

      {
        $set: {
          isAvailable,
        },
      },

      {
        new: true,
      }
    ).select(
      "name email role category verificationStatus profileStatus isAvailable"
    );

    if (!technician) {
      return res.status(404).json({
        message: "Technician not found",
      });
    }

    res.json({
      message: isAvailable
        ? "You are now available for service requests"
        : "You are now unavailable for service requests",

      technician,
    });

  } catch (error) {
    console.error(
      "Update technician availability error:",
      error
    );

    res.status(500).json({
      message:
        "Could not update technician availability",
      error: error.message,
    });
  }
};


// ============================================================
// UPDATE BOOKING STATUS
// PATCH /api/bookings/:id/status
// ============================================================

exports.updateBookingStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "declined",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const userId = req.userId.toString();

    const isCustomer =
      booking.customerId.toString() === userId;

    const isTechnician =
      booking.technicianId &&
      booking.technicianId.toString() === userId;

    if (!isCustomer && !isTechnician) {
      return res.status(403).json({
        message:
          "Not authorized to update this booking",
      });
    }

    if (
      status === "completed" &&
      !isTechnician
    ) {
      return res.status(403).json({
        message:
          "Only assigned technician can complete the booking",
      });
    }

    if (status === "accepted") {
      return res.status(400).json({
        message:
          "Use the technician accept endpoint",
      });
    }

    if (status === "declined") {
      return res.status(400).json({
        message:
          "Use the technician decline endpoint",
      });
    }

    booking.status = status;

    await booking.save();

    res.json({
      message: "Booking status updated",
      booking,
    });

  } catch (error) {
    console.error(
      "Update booking status error:",
      error
    );

    res.status(500).json({
      message: "Could not update booking status",
      error: error.message,
    });
  }
};