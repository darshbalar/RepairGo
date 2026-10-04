const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");

/* =========================================================
   JWT
========================================================= */

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* =========================================================
   OTP GENERATOR
========================================================= */

const generateOtpCode = () => {
  return Math.floor(
    100000 +
      Math.random() * 900000
  ).toString();
};

/* =========================================================
   SEND OTP
========================================================= */

exports.sendOtp = async (
  req,
  res
) => {
  try {
    const { phone } = req.body;

    if (
      !phone ||
      !/^[0-9]{10}$/.test(phone)
    ) {
      return res.status(400).json({
        message:
          "Valid 10-digit phone number is required",
      });
    }

    const otp =
      generateOtpCode();

    const expiresAt =
      new Date(
        Date.now() +
          5 * 60 * 1000
      );

    await Otp.findOneAndUpdate(
      {
        phone,
      },

      {
        phone,
        otp,
        expiresAt,
      },

      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    /*
      DEMO MODE

      Real SMS integration will be
      added later.
    */

    console.log(
      `[MOCK SMS] OTP for ${phone}: ${otp}`
    );

    res.json({
      message:
        "OTP sent successfully",

      demoOtp: otp,
    });
  } catch (error) {
    console.error(
      "Send OTP error:",
      error
    );

    res.status(500).json({
      message:
        "Could not send OTP",

      error:
        error.message,
    });
  }
};

/* =========================================================
   VERIFY OTP
========================================================= */

const verifyOtpOrThrow =
  async (
    phone,
    otp
  ) => {
    const record =
      await Otp.findOne({
        phone,
      });

    if (!record) {
      throw new Error(
        "OTP not requested for this number, or it has expired"
      );
    }

    if (
      record.expiresAt <
      new Date()
    ) {
      await Otp.deleteOne({
        phone,
      });

      throw new Error(
        "OTP has expired, please request a new one"
      );
    }

    if (
      record.otp !== otp
    ) {
      throw new Error(
        "Incorrect OTP"
      );
    }

    /*
      OTP successfully used
    */

    await Otp.deleteOne({
      phone,
    });
  };

/* =========================================================
   VALIDATE IDENTITY
   LOCAL DEMO VERIFICATION
========================================================= */

const validateIdentity =
  ({
    identityType,
    identityNumber,
    identityDocument,
    selfie,
  }) => {
    if (
      !identityType ||
      !identityNumber ||
      !identityDocument ||
      !selfie
    ) {
      return {
        valid: false,

        message:
          "Identity document, identity number and selfie are required",
      };
    }

    const cleanNumber =
      String(
        identityNumber
      )
        .trim()
        .replace(
          /\s+/g,
          ""
        );

    /*
      Demo identity validation.

      We don't call an external KYC provider yet.

      We only validate the submitted identity
      number according to the selected document.
    */

    if (
      identityType ===
      "pan"
    ) {
      if (
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(
          cleanNumber
        )
      ) {
        return {
          valid: false,

          message:
            "Invalid PAN number format",
        };
      }
    }

    if (
      identityType ===
      "aadhaar"
    ) {
      if (
        !/^[0-9]{12}$/.test(
          cleanNumber
        )
      ) {
        return {
          valid: false,

          message:
            "Aadhaar number must contain 12 digits",
        };
      }
    }

    if (
      identityType ===
      "driving_license"
    ) {
      if (
        cleanNumber.length <
        8
      ) {
        return {
          valid: false,

          message:
            "Invalid driving licence number",
        };
      }
    }

    if (
      identityType ===
      "voter_id"
    ) {
      if (
        cleanNumber.length <
        8
      ) {
        return {
          valid: false,

          message:
            "Invalid voter ID number",
        };
      }
    }

    return {
      valid: true,
      normalizedNumber:
        cleanNumber,
    };
  };

/* =========================================================
   TECHNICIAN SIGNUP
========================================================= */

exports.technicianSignup =
  async (
    req,
    res
  ) => {
    try {
      const {
        name,
        email,
        phone,
        otp,

        identityType,
        identityNumber,
        identityDocument,
        selfie,

        category,
        experience,
        skills,

        state,
        city,
        serviceLocation,

        coverageType,

        longitude,
        latitude,
      } = req.body;

      /* ===================================================
         BASIC VALIDATION
      =================================================== */

      if (
        !name ||
        !email ||
        !phone ||
        !otp ||
        !identityType ||
        !identityNumber ||
        !identityDocument ||
        !selfie ||
        !category ||
        !experience ||
        !skills ||
        !state ||
        !city ||
        !serviceLocation ||
        !coverageType
      ) {
        return res.status(400).json({
          message:
            "Please fill all required fields",
        });
      }

      /* ===================================================
         PHONE
      =================================================== */

      if (
        !/^[0-9]{10}$/.test(
          phone
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid 10-digit phone number",
        });
      }

      /* ===================================================
         EMAIL
      =================================================== */

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid email address",
        });
      }

      /* ===================================================
         CATEGORY
      =================================================== */

      const allowedCategories =
        [
          "electrician",
          "plumber",
          "ac_repair",
          "appliance_repair",
          "carpenter",
        ];

      if (
        !allowedCategories.includes(
          category
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid service category",
        });
      }

      /* ===================================================
         EXPERIENCE
      =================================================== */

      const allowedExperience =
        [
          "0-1",
          "1-3",
          "3-5",
          "5+",
        ];

      if (
        !allowedExperience.includes(
          experience
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid experience value",
        });
      }

      /* ===================================================
         SKILLS
      =================================================== */

      if (
        !Array.isArray(
          skills
        ) ||
        skills.length === 0
      ) {
        return res.status(400).json({
          message:
            "Please select at least one skill",
        });
      }

      /* ===================================================
         COVERAGE
      =================================================== */

      const allowedCoverage =
        [
          "5km",
          "10km",
          "15km",
          "entire_city",
        ];

      if (
        !allowedCoverage.includes(
          coverageType
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid service coverage",
        });
      }

      let finalRadiusKm =
        0;

      if (
        coverageType ===
        "5km"
      ) {
        finalRadiusKm = 5;
      }

      if (
        coverageType ===
        "10km"
      ) {
        finalRadiusKm = 10;
      }

      if (
        coverageType ===
        "15km"
      ) {
        finalRadiusKm = 15;
      }

      /*
        entire_city = 0
      */

      /* ===================================================
         CHECK EXISTING PHONE
      =================================================== */

      const existingPhone =
        await User.findOne({
          phone,
        });

      if (existingPhone) {
        return res.status(400).json({
          message:
            "An account with this phone number already exists",
        });
      }

      /* ===================================================
         CHECK EXISTING EMAIL
      =================================================== */

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const existingEmail =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (existingEmail) {
        return res.status(400).json({
          message:
            "An account with this email already exists",
        });
      }

      /* ===================================================
         VERIFY OTP FIRST
      =================================================== */

      await verifyOtpOrThrow(
        phone,
        otp
      );

      /* ===================================================
         DEMO IDENTITY VERIFICATION
      =================================================== */

      const identityResult =
        validateIdentity({
          identityType,
          identityNumber,
          identityDocument,
          selfie,
        });

      if (
        !identityResult.valid
      ) {
        return res.status(400).json({
          message:
            identityResult.message,
        });
      }

      /* ===================================================
         LOCATION
      =================================================== */

      const finalLongitude =
        Number(longitude) ||
        0;

      const finalLatitude =
        Number(latitude) ||
        0;

      /* ===================================================
         CREATE VERIFIED TECHNICIAN
      =================================================== */

      const technician =
        await User.create({
          name:
            name.trim(),

          email:
            normalizedEmail,

          phone:
            phone.trim(),

          /*
            Technician currently doesn't
            need customer password login.
          */

          role:
            "technician",

          /* Identity */

          identityType,

          identityNumber:
            identityResult.normalizedNumber,

          identityDocument:
            identityDocument,

          selfie:
            selfie,

          /* Professional */

          category,

          experience,

          skills:
            skills.map(
              (skill) =>
                String(skill).trim()
            ),

          /* Location */

          state:
            state.trim(),

          city:
            city.trim(),

          serviceLocation:
            serviceLocation.trim(),

          coverageType,

          radiusKm:
            finalRadiusKm,

          location: {
            type:
              "Point",

            coordinates: [
              finalLongitude,
              finalLatitude,
            ],
          },

          /*
            DEMO VERIFICATION

            OTP + identity validation passed,
            so technician becomes active immediately.
          */

          verificationStatus:
            "verified",

          profileStatus:
            "active",

          verifiedAt:
            new Date(),

          verificationNote:
            "Demo identity cross-verification completed successfully.",

          isAvailable:
            true,
        });

      /* ===================================================
         TOKEN
      =================================================== */

      const token =
        generateToken(
          technician._id
        );

      /* ===================================================
         RESPONSE
      =================================================== */

      return res.status(201).json({
        message:
          "Technician verified and profile activated successfully",

        token,

        user: {
          id:
            technician._id,

          name:
            technician.name,

          email:
            technician.email,

          phone:
            technician.phone,

          role:
            technician.role,

          category:
            technician.category,

          experience:
            technician.experience,

          skills:
            technician.skills,

          state:
            technician.state,

          city:
            technician.city,

          serviceLocation:
            technician.serviceLocation,

          coverageType:
            technician.coverageType,

          verificationStatus:
            technician.verificationStatus,

          profileStatus:
            technician.profileStatus,

          isAvailable:
            technician.isAvailable,

          verifiedAt:
            technician.verifiedAt,
        },
      });
    } catch (error) {
      console.error(
        "Technician signup error:",
        error
      );

      return res.status(400).json({
        message:
          error.message ||
          "Technician registration failed",
      });
    }
  };

/* =========================================================
   TECHNICIAN LOGIN
========================================================= */

exports.technicianLogin =
  async (
    req,
    res
  ) => {
    try {
      const {
        phone,
        otp,
      } = req.body;

      if (
        !phone ||
        !otp ||
        !/^[0-9]{10}$/.test(
          phone
        )
      ) {
        return res.status(400).json({
          message:
            "Valid phone number and OTP are required",
        });
      }

      await verifyOtpOrThrow(
        phone,
        otp
      );

      const technician =
        await User.findOne({
          phone,
          role:
            "technician",
        });

      if (!technician) {
        return res.status(404).json({
          message:
            "No technician account found with this number",
        });
      }

      /* ===================================================
         ONLY VERIFIED / ACTIVE TECHNICIANS
      =================================================== */

      if (
        technician.verificationStatus !==
        "verified"
      ) {
        return res.status(403).json({
          message:
            "Your technician profile is not verified yet",
        });
      }

      if (
        technician.profileStatus !==
        "active"
      ) {
        return res.status(403).json({
          message:
            "Your technician profile is inactive",
        });
      }

      const token =
        generateToken(
          technician._id
        );

      return res.json({
        message:
          "Technician login successful",

        token,

        user: {
          id:
            technician._id,

          name:
            technician.name,

          email:
            technician.email,

          phone:
            technician.phone,

          role:
            technician.role,

          category:
            technician.category,

          experience:
            technician.experience,

          skills:
            technician.skills,

          verificationStatus:
            technician.verificationStatus,

          profileStatus:
            technician.profileStatus,

          isAvailable:
            technician.isAvailable,
        },
      });
    } catch (error) {
      console.error(
        "Technician login error:",
        error
      );

      return res.status(400).json({
        message:
          error.message ||
          "Technician login failed",
      });
    }
  };