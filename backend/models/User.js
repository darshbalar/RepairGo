const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* =====================================================
       BASIC USER INFORMATION
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.role === "customer";
      },
    },

    role: {
      type: String,
      enum: ["customer", "technician"],
      required: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    /* =====================================================
       IDENTITY / VERIFICATION
    ===================================================== */

    identityType: {
      type: String,
      enum: [
        "pan",
        "driving_license",
        "aadhaar",
        "voter_id",
      ],
      default: null,
    },

    identityNumber: {
      type: String,
      default: null,
      trim: true,
    },

    identityDocument: {
      type: String,
      default: null,
    },

    selfie: {
      type: String,
      default: null,
    },

    /* =====================================================
       TECHNICIAN PROFESSIONAL DETAILS
    ===================================================== */

    category: {
      type: String,

      enum: [
        "electrician",
        "plumber",
        "ac_repair",
        "appliance_repair",
        "carpenter",
        null,
      ],

      default: null,
    },

    experience: {
      type: String,

      enum: [
        "0-1",
        "1-3",
        "3-5",
        "5+",
        null,
      ],

      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    /* =====================================================
       SERVICE LOCATION
    ===================================================== */

    state: {
      type: String,
      default: null,
      trim: true,
    },

    city: {
      type: String,
      default: null,
      trim: true,
    },

    serviceLocation: {
      type: String,
      default: null,
      trim: true,
    },

    coverageType: {
      type: String,

      enum: [
        "5km",
        "10km",
        "15km",
        "entire_city",
        null,
      ],

      default: null,
    },

    radiusKm: {
      type: Number,
      min: 0,
      default: 0,
    },

    /* =====================================================
       GEO LOCATION
       GeoJSON: [longitude, latitude]
    ===================================================== */

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    /* =====================================================
       VERIFICATION STATUS
    ===================================================== */

    verificationStatus: {
      type: String,

      enum: [
        "pending",
        "verified",
        "rejected",
      ],

      default: function () {
        return this.role === "technician"
          ? "pending"
          : null;
      },
    },

    profileStatus: {
      type: String,

      enum: [
        "active",
        "inactive",
      ],

      default: function () {
        return this.role === "technician"
          ? "inactive"
          : "active";
      },
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verificationNote: {
      type: String,
      default: null,
    },

    /* =====================================================
       AVAILABILITY
    ===================================================== */

    isAvailable: {
      type: Boolean,

      default: function () {
        return this.role === "technician"
          ? false
          : true;
      },
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   GEO INDEX
========================================================= */

userSchema.index({
  location: "2dsphere",
});

module.exports =
  mongoose.model("User", userSchema);