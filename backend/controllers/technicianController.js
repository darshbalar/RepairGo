const User = require("../models/User");

// GET /api/technicians/search?category=electrician&longitude=72.83&latitude=21.17&maxDistanceKm=5
exports.searchNearbyTechnicians = async (req, res) => {
  try {
    const { category, longitude, latitude, maxDistanceKm } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: "longitude and latitude are required" });
    }

    const radiusInMeters = (maxDistanceKm ? Number(maxDistanceKm) : 10) * 1000; // default 10km

    // Build the base query: must be a technician, must be available
    const query = {
      role: "technician",
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    // Only filter by category if the customer specified one
    if (category) {
      query.category = category;
    }

    const technicians = await User.find(query).select("-password");

    res.json({
      count: technicians.length,
      technicians,
    });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
