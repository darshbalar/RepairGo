import { useState } from "react";
import { Link } from "react-router-dom";

import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Building2,
  Wrench,
  ArrowRight,
  Eye,
  EyeOff,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  IndianRupee,
  Upload,
  LocateFixed,
  CheckCircle,
} from "lucide-react";

/* =========================================================
   INDIA STATES / UNION TERRITORIES + CITIES
========================================================= */

const INDIA_LOCATIONS = {
  "Andhra Pradesh": [
    "Amaravati",
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Tirupati",
    "Rajahmundry",
    "Kakinada",
    "Kadapa",
    "Anantapur",
    "Eluru",
    "Ongole",
    "Srikakulam",
    "Vizianagaram",
  ],

  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Tawang",
    "Bomdila",
    "Pasighat",
    "Ziro",
    "Aalo",
    "Tezu",
    "Namsai",
    "Roing",
  ],

  Assam: [
    "Dispur",
    "Guwahati",
    "Dibrugarh",
    "Jorhat",
    "Silchar",
    "Tezpur",
    "Nagaon",
    "Tinsukia",
    "Sivasagar",
    "Dhemaji",
    "Bongaigaon",
    "Barpeta",
    "Nalbari",
    "Diphu",
    "Karimganj",
  ],

  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Purnia",
    "Darbhanga",
    "Arrah",
    "Begusarai",
    "Katihar",
    "Munger",
    "Chhapra",
    "Samastipur",
    "Hajipur",
    "Sasaram",
    "Bihar Sharif",
  ],

  Chhattisgarh: [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Durg",
    "Rajnandgaon",
    "Jagdalpur",
    "Raigarh",
    "Ambikapur",
    "Dhamtari",
    "Mahasamund",
    "Kanker",
  ],

  Goa: [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
    "Ponda",
    "Bicholim",
    "Curchorem",
    "Canacona",
  ],

  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Junagadh",
    "Anand",
    "Bharuch",
    "Navsari",
    "Valsad",
    "Vapi",
    "Mehsana",
    "Morbi",
    "Nadiad",
    "Palanpur",
    "Godhra",
    "Dahod",
    "Botad",
    "Porbandar",
    "Veraval",
    "Patan",
    "Himmatnagar",
    "Amreli",
    "Bhuj",
    "Gondal",
    "Jetpur",
    "Kalol",
    "Deesa",
    "Surendranagar",
  ],

  Haryana: [
    "Chandigarh",
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
    "Sonipat",
    "Panchkula",
    "Bhiwani",
    "Sirsa",
    "Rewari",
    "Jind",
    "Kaithal",
    "Kurukshetra",
    "Palwal",
    "Narnaul",
    "Fatehabad",
  ],

  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Mandi",
    "Solan",
    "Kullu",
    "Manali",
    "Hamirpur",
    "Una",
    "Bilaspur",
    "Chamba",
    "Nahan",
    "Kangra",
    "Palampur",
    "Baddi",
  ],

  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
    "Hazaribagh",
    "Giridih",
    "Ramgarh",
    "Dumka",
    "Chaibasa",
    "Medininagar",
    "Gumla",
    "Lohardaga",
    "Sahibganj",
  ],

  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi",
    "Dharwad",
    "Belagavi",
    "Kalaburagi",
    "Davangere",
    "Ballari",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Hassan",
    "Mandya",
    "Raichur",
    "Vijayapura",
    "Bidar",
    "Chikkamagaluru",
    "Kolar",
    "Hospet",
    "Madikeri",
    "Chitradurga",
  ],

  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Kollam",
    "Thrissur",
    "Kannur",
    "Alappuzha",
    "Kottayam",
    "Palakkad",
    "Malappuram",
    "Kasaragod",
    "Idukki",
    "Pathanamthitta",
    "Wayanad",
  ],

  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
    "Murwara",
    "Singrauli",
    "Burhanpur",
    "Khandwa",
    "Vidisha",
    "Chhindwara",
    "Shivpuri",
    "Mandsaur",
    "Neemuch",
    "Betul",
    "Sehore",
    "Morena",
  ],

  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Thane",
    "Navi Mumbai",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Amravati",
    "Nanded",
    "Sangli",
    "Jalgaon",
    "Akola",
    "Latur",
    "Dhule",
    "Ahmednagar",
    "Chandrapur",
    "Satara",
    "Ratnagiri",
    "Beed",
    "Parbhani",
    "Yavatmal",
    "Wardha",
    "Bhandara",
    "Gondia",
  ],

  Manipur: [
    "Imphal",
    "Thoubal",
    "Churachandpur",
    "Ukhrul",
    "Senapati",
    "Bishnupur",
    "Kakching",
    "Tamenglong",
    "Jiribam",
  ],

  Meghalaya: [
    "Shillong",
    "Tura",
    "Jowai",
    "Nongpoh",
    "Nongstoin",
    "Williamnagar",
    "Baghmara",
    "Resubelpara",
  ],

  Mizoram: [
    "Aizawl",
    "Lunglei",
    "Champhai",
    "Kolasib",
    "Serchhip",
    "Lawngtlai",
    "Mamit",
    "Saiha",
  ],

  Nagaland: [
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Mon",
    "Phek",
    "Zunheboto",
    "Kiphire",
    "Longleng",
  ],

  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Brahmapur",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Baripada",
    "Bhadrak",
    "Jharsuguda",
    "Angul",
    "Dhenkanal",
    "Koraput",
    "Rayagada",
    "Bargarh",
    "Kendujhar",
    "Jeypore",
    "Balangir",
  ],

  Punjab: [
    "Chandigarh",
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Hoshiarpur",
    "Pathankot",
    "Moga",
    "Batala",
    "Abohar",
    "Phagwara",
    "Sangrur",
    "Barnala",
    "Kapurthala",
    "Firozpur",
    "Faridkot",
    "Gurdaspur",
  ],

  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Bharatpur",
    "Alwar",
    "Bhilwara",
    "Sikar",
    "Sri Ganganagar",
    "Pali",
    "Barmer",
    "Chittorgarh",
    "Bundi",
    "Tonk",
    "Kishangarh",
    "Hanumangarh",
    "Dausa",
    "Jaisalmer",
    "Nagaur",
    "Sawai Madhopur",
    "Jhunjhunu",
    "Banswara",
    "Dungarpur",
    "Rajsamand",
    "Beawar",
  ],

  Sikkim: [
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan",
    "Ravangla",
    "Singtam",
  ],

  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tiruppur",
    "Erode",
    "Vellore",
    "Thoothukudi",
    "Dindigul",
    "Thanjavur",
    "Tirunelveli",
    "Hosur",
    "Nagercoil",
    "Kanchipuram",
    "Karur",
    "Cuddalore",
    "Kumbakonam",
    "Namakkal",
    "Sivakasi",
    "Pudukkottai",
    "Ooty",
    "Dharmapuri",
    "Krishnagiri",
    "Ramanathapuram",
  ],

  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Ramagundam",
    "Mahbubnagar",
    "Nalgonda",
    "Suryapet",
    "Adilabad",
    "Siddipet",
    "Mancherial",
    "Jagtial",
    "Kamareddy",
    "Vikarabad",
  ],

  Tripura: [
    "Agartala",
    "Udaipur",
    "Dharmanagar",
    "Kailashahar",
    "Belonia",
    "Ambassa",
    "Khowai",
    "Sabroom",
  ],

  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Haldwani",
    "Nainital",
    "Rishikesh",
    "Roorkee",
    "Rudrapur",
    "Kashipur",
    "Almora",
    "Pithoragarh",
    "Srinagar",
    "Mussoorie",
    "Chamoli",
    "Uttarkashi",
    "Bageshwar",
    "Pauri",
  ],

  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
    "Agra",
    "Varanasi",
    "Prayagraj",
    "Meerut",
    "Noida",
    "Bareilly",
    "Aligarh",
    "Moradabad",
    "Saharanpur",
    "Gorakhpur",
    "Mathura",
    "Firozabad",
    "Jhansi",
    "Muzaffarnagar",
    "Ayodhya",
    "Rampur",
    "Shahjahanpur",
    "Farrukhabad",
    "Etawah",
    "Mirzapur",
    "Bulandshahr",
    "Hapur",
    "Basti",
    "Sitapur",
    "Bahraich",
    "Gonda",
    "Raebareli",
    "Unnao",
    "Azamgarh",
    "Ballia",
    "Jaunpur",
    "Banda",
    "Lalitpur",
    "Mainpuri",
    "Kasganj",
    "Amroha",
    "Sambhal",
  ],

  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Darjeeling",
    "Kharagpur",
    "Malda",
    "Bardhaman",
    "Haldia",
    "Baharampur",
    "Raiganj",
    "Jalpaiguri",
    "Cooch Behar",
    "Krishnanagar",
    "Balurghat",
    "Bankura",
    "Purulia",
  ],

  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Diglipur",
    "Mayabunder",
    "Rangat",
    "Car Nicobar",
    "Campbell Bay",
  ],

  Chandigarh: [
    "Chandigarh",
  ],

  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Silvassa",
  ],

  Delhi: [
    "New Delhi",
    "Delhi",
    "Dwarka",
    "Rohini",
    "Saket",
    "Karol Bagh",
    "Janakpuri",
    "Laxmi Nagar",
    "Pitampura",
    "Vasant Kunj",
  ],

  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Kathua",
    "Udhampur",
    "Rajouri",
    "Poonch",
    "Kupwara",
    "Pulwama",
    "Kulgam",
    "Bandipora",
    "Budgam",
    "Ganderbal",
    "Shopian",
  ],

  Ladakh: [
    "Leh",
    "Kargil",
    "Diskit",
    "Padum",
  ],

  Lakshadweep: [
    "Kavaratti",
    "Agatti",
    "Amini",
    "Andrott",
    "Minicoy",
  ],

  Puducherry: [
    "Puducherry",
    "Karaikal",
    "Mahe",
    "Yanam",
  ],
};

/* =========================================================
   SERVICE CATEGORIES
========================================================= */

const CATEGORIES = [
  {
    value: "electrician",
    label: "Electrician",
    icon: "⚡",
  },
  {
    value: "plumber",
    label: "Plumber",
    icon: "🔧",
  },
  {
    value: "ac_repair",
    label: "AC Repair",
    icon: "❄️",
  },
  {
    value: "appliance_repair",
    label: "Appliance Repair",
    icon: "🔌",
  },
  {
    value: "carpenter",
    label: "Carpenter",
    icon: "🪚",
  },
];

/* =========================================================
   CATEGORY-WISE SKILLS
========================================================= */

const SKILL_OPTIONS = {
  electrician: [
    "Electrical Wiring",
    "Switch & Socket Repair",
    "Fan Installation",
    "Light Installation",
  ],

  plumber: [
    "Pipe Repair",
    "Tap Repair",
    "Leakage Repair",
    "Bathroom Plumbing",
  ],

  ac_repair: [
    "AC Service",
    "AC Installation",
    "AC Gas Filling",
    "AC Repair",
  ],

  appliance_repair: [
    "Washing Machine Repair",
    "Refrigerator Repair",
    "Microwave Repair",
    "RO Repair",
  ],

  carpenter: [
    "Furniture Repair",
    "Door Repair",
    "Wood Work",
    "Furniture Assembly",
  ],
};

/* =========================================================
   EXPERIENCE
========================================================= */

const EXPERIENCE_OPTIONS = [
  {
    value: "0-1",
    label: "0–1 Years",
    description: "Just starting",
  },
  {
    value: "1-3",
    label: "1–3 Years",
    description: "Some experience",
  },
  {
    value: "3-5",
    label: "3–5 Years",
    description: "Experienced",
  },
  {
    value: "5+",
    label: "5+ Years",
    description: "Highly experienced",
  },
];

/* =========================================================
   COVERAGE
========================================================= */

const COVERAGE_OPTIONS = [
  {
    value: "5km",
    label: "5 km",
  },
  {
    value: "10km",
    label: "10 km",
  },
  {
    value: "15km",
    label: "15 km",
  },
  {
    value: "entire_city",
    label: "Entire City",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

function TechnicianAuth() {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("signup");

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    /* Step 1 */

    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",

    identityType: "",
    identityNumber: "",
    identityDocument: null,
    selfie: null,

    /* Step 2 */

    category: "",
    experience: "",
    skills: [],

    /* Step 3 */

    state: "",
    city: "",
    serviceLocation: "",
    coverageType: "",

    longitude: "",
    latitude: "",

    /* Agreement */

    agreement: false,
  });

  const [otp, setOtp] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);

  const [otpSent, setOtpSent] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =======================================================
     HANDLE INPUT
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");
    setSuccess("");

    setForm((current) => ({
      ...current,
      [name]: value,

      ...(name === "state"
        ? {
            city: "",
          }
        : {}),
    }));
  };

  /* =======================================================
     NEXT / VALIDATION
  ======================================================= */

  const handleNext = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* STEP 1 */

    if (step === 1) {
      if (
        !form.name.trim() ||
        !form.phone.trim() ||
        !form.email.trim() ||
        !form.password ||
        !form.confirmPassword ||
        !form.identityType ||
        !form.identityNumber.trim() ||
        !form.identityDocument ||
        !form.selfie
      ) {
        setError(
          "Please fill all required fields."
        );

        return;
      }

      if (
        !/^[0-9]{10}$/.test(
          form.phone
        )
      ) {
        setError(
          "Please enter a valid 10-digit phone number."
        );

        return;
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email
        )
      ) {
        setError(
          "Please enter a valid email address."
        );

        return;
      }

      if (
        form.password.length < 6
      ) {
        setError(
          "Password must be at least 6 characters."
        );

        return;
      }

      if (
        form.password !==
        form.confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      setStep(2);

      return;
    }

    /* STEP 2 */

    if (step === 2) {
      if (!form.category) {
        setError(
          "Please select your service category."
        );

        return;
      }

      if (!form.experience) {
        setError(
          "Please select your experience."
        );

        return;
      }

      if (
        form.skills.length === 0
      ) {
        setError(
          "Please select at least one skill."
        );

        return;
      }

      setStep(3);

      return;
    }

    /* STEP 3 */

    if (step === 3) {
      if (
        !form.state ||
        !form.city ||
        !form.serviceLocation.trim() ||
        !form.coverageType
      ) {
        setError(
          "Please complete all service location details."
        );

        return;
      }

      setStep(4);
    }
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    setError("");
    setSuccess("");

    if (step > 1) {
      setStep(
        (current) => current - 1
      );
    }
  };

  /* =======================================================
     SKILL SELECT
  ======================================================= */

  const toggleSkill = (skill) => {
    setError("");

    setForm((current) => ({
      ...current,

      skills:
        current.skills.includes(
          skill
        )
          ? current.skills.filter(
              (item) =>
                item !== skill
            )
          : [
              ...current.skills,
              skill,
            ],
    }));
  };

  /* =======================================================
     CURRENT LOCATION
  ======================================================= */

  const handleCurrentLocation =
    () => {
      setError("");
      setSuccess("");

      if (
        !navigator.geolocation
      ) {
        setError(
          "Location is not supported by this browser."
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((current) => ({
            ...current,

            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,
          }));

          setSuccess(
            "Current location captured successfully."
          );
        },

        () => {
          setError(
            "Unable to access your location. Please allow location permission."
          );
        }
      );
    };

  /* =======================================================
     SEND OTP
  ======================================================= */

  const handleSendOtp =
    async () => {
      setError("");
      setSuccess("");

      if (!form.agreement) {
        setError(
          "Please accept the agreement before submitting."
        );

        return;
      }

      if (
        !/^[0-9]{10}$/.test(
          form.phone
        )
      ) {
        setError(
          "Please enter a valid 10-digit phone number."
        );

        return;
      }

      setSubmitting(true);

      try {
        const response =
          await fetch(
            "https://repairgo-h1wz.onrender.com/api/auth/send-otp",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                phone: form.phone,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Could not send OTP"
          );
        }

        setOtpSent(true);

        setSuccess(
          "OTP sent successfully. Enter the OTP to verify your phone."
        );

        /* Demo */

        console.log(
          "RepairGo Demo OTP:",
          data.demoOtp
        );
      } catch (err) {
        setError(
          err.message ||
            "Could not send OTP."
        );
      } finally {
        setSubmitting(false);
      }
    };

    const handleLoginSendOtp = async () => {
  setError("");
  setSuccess("");

  if (!/^[0-9]{10}$/.test(loginPhone)) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(
      "https://repairgo-h1wz.onrender.com/api/auth/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: loginPhone,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Could not send OTP"
      );
    }

    setLoginOtpSent(true);

    setSuccess(
      "OTP sent successfully. Enter the OTP to login."
    );

    console.log(
      "RepairGo Login Demo OTP:",
      data.demoOtp
    );
  } catch (err) {
    setError(
      err.message || "Could not send OTP."
    );
  } finally {
    setSubmitting(false);
  }
};

  /* =======================================================
     VERIFY OTP + CREATE ACCOUNT
  ======================================================= */

  const handleVerifyAndSubmit =
    async () => {
      setError("");
      setSuccess("");

      if (
        otp.length !== 6
      ) {
        setError(
          "Please enter the 6-digit OTP."
        );

        return;
      }

      setSubmitting(true);

      try {
        const response =
          await fetch(
            "https://repairgo-h1wz.onrender.com/api/auth/technician-signup",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name:
                  form.name.trim(),

                email:
                  form.email
                    .toLowerCase()
                    .trim(),

                phone:
                  form.phone.trim(),

                otp,

                identityType:
                  form.identityType,

                identityNumber:
                  form.identityNumber.trim(),

                identityDocument:
                  form.identityDocument
                    ?.name || null,

                selfie:
                  form.selfie?.name ||
                  null,

                /* Step 2 */

                category:
                  form.category,

                experience:
                  form.experience,

                skills:
                  form.skills,

                /* Step 3 */

                state:
                  form.state.trim(),

                city:
                  form.city.trim(),

                serviceLocation:
                  form.serviceLocation.trim(),

                coverageType:
                  form.coverageType,

                longitude:
                  Number(
                    form.longitude
                  ) || 0,

                latitude:
                  Number(
                    form.latitude
                  ) || 0,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Technician registration failed."
          );
        }

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        setSuccess(
          "Identity verified successfully! Your RepairGo professional profile is now active."
        );
        setTimeout(() => {
          window.location.href = "/technician-dashboard";
        }, 1200);
      } catch (err) {
        setError(
          err.message ||
            "Technician registration failed."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /* =======================================================
     SELECTED VALUES FOR REVIEW
  ======================================================= */

  const selectedCategory =
    CATEGORIES.find(
      (item) =>
        item.value ===
        form.category
    );

  const selectedCoverage =
    COVERAGE_OPTIONS.find(
      (item) =>
        item.value ===
        form.coverageType
    );

  const selectedExperience =
    EXPERIENCE_OPTIONS.find(
      (item) =>
        item.value ===
        form.experience
    );

  const selectedIdentity =
    {
      pan: "PAN Card",

      driving_license:
        "Driving Licence",

      aadhaar:
        "Aadhaar Card",

      voter_id:
        "Voter ID",
    }[form.identityType] ||
    form.identityType;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="technician-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="technician-navbar">

        <Link
          to="/"
          className="technician-navbar-logo"
        >
          <div className="rg-logo">
            RG
          </div>

          <span>
            RepairGo
          </span>
        </Link>

        <div className="technician-search">

          <span className="search-icon">

            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-4-4" />
            </svg>

          </span>

          <input
            placeholder="Search for a service..."
          />

        </div>

        <div className="technician-navbar-actions">

          <Link
            to="/technician-auth"
            className="become-technician"
          >
            Become a Technician
          </Link>

          <Link
            to="/login"
            className="navbar-login"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="navbar-signup"
          >
            Sign Up
          </Link>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="technician-main">

        {/* =================================================
            LEFT PROMO
        ================================================= */}

        <section className="technician-promo">

          <div className="promo-content">

            <h1>
              Join RepairGo
              <br />
              as a Technician
            </h1>

            <p>
              Get service requests from
              customers in your area and grow
              your business with RepairGo.
            </p>

            <div className="promo-features">

              <PromoFeature
                icon={
                  <IndianRupee
                    size={22}
                  />
                }
                text={
                  <>
                    Get nearby service
                    <br />
                    requests
                  </>
                }
              />

              <PromoFeature
                icon={
                  <CalendarDays
                    size={22}
                  />
                }
                text="Work on your own time"
              />

              <PromoFeature
                icon={
                  <BarChart3
                    size={22}
                  />
                }
                text="Increase your earnings"
              />

              <PromoFeature
                icon={
                  <ShieldCheck
                    size={22}
                  />
                }
                text={
                  <>
                    Be a part of a trusted
                    <br />
                    platform
                  </>
                }
              />

            </div>

          </div>

          <div className="technician-image-wrapper">

            <div className="technician-image-circle" />

            <img
              src="/technician/technician.png"
              alt="RepairGo Technician"
              className="technician-image"
            />

          </div>

        </section>

        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <section className="technician-form-wrapper">

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="signup-progress">

            {[1, 2, 3, 4].map(
              (item, index) => (

                <div
                  className="progress-wrapper"
                  key={item}
                >

                  <div className="progress-step">

                    <div
                      className={
                        step >= item
                          ? "progress-circle active"
                          : "progress-circle"
                      }
                    >
                      {item}
                    </div>

                    <span
                      className={
                        step === item
                          ? "progress-label active"
                          : "progress-label"
                      }
                    >
                      {item === 1 &&
                        "Basic Info"}

                      {item === 2 &&
                        "Service Details"}

                      {item === 3 &&
                        "Location"}

                      {item === 4 &&
                        "Review"}
                    </span>

                  </div>

                  {index < 3 && (
                    <div
                      className={
                        step > item
                          ? "progress-line active"
                          : "progress-line"
                      }
                    />
                  )}

                </div>

              )
            )}

          </div>

          {/* =================================================
              FORM CONTENT
          ================================================= */}

          <div className="form-card-content">

            <div className="form-heading">

              <h2>
                Technician Sign Up
              </h2>

              <p>
                Create your account and start
                receiving service requests.
              </p>

            </div>

            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (

              <form
                onSubmit={handleNext}
                className="signup-form"
              >

                <div className="form-grid">

                  <FormField
                    label="Full Name"
                    required
                    icon={
                      <User size={20} />
                    }
                  >
                    <input
                      name="name"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your full name"
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    required
                    icon={
                      <Phone size={20} />
                    }
                  >
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your phone number"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </FormField>

                </div>

                <FormField
                  label="Email Address"
                  required
                  icon={
                    <Mail size={20} />
                  }
                  full
                >
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your email"
                  />
                </FormField>

                <FormField
                  label="Password"
                  required
                  icon={
                    <Lock size={20} />
                  }
                  full
                >

                  <div className="password-wrapper">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={
                        form.password
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Create a password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={20}
                        />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                </FormField>

                <FormField
                  label="Confirm Password"
                  required
                  icon={
                    <Lock size={20} />
                  }
                  full
                >
                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      form.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Confirm your password"
                  />
                </FormField>

                <div className="form-divider" />

                <div className="identity-title">

                  <h3>
                    Identity Verification
                  </h3>

                  <p>
                    Provide your identity details
                    for technician verification.
                  </p>

                </div>

                <div className="form-grid">

                  <FormField
                    label="Identity Document"
                    required
                    icon={
                      <ShieldCheck
                        size={20}
                      />
                    }
                  >

                    <select
                      name="identityType"
                      value={
                        form.identityType
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="">
                        Select Document
                      </option>

                      <option value="pan">
                        PAN Card
                      </option>

                      <option value="driving_license">
                        Driving Licence
                      </option>

                      <option value="aadhaar">
                        Aadhaar Card
                      </option>

                      <option value="voter_id">
                        Voter ID
                      </option>

                    </select>

                  </FormField>

                  <FormField
                    label="Identity Number"
                    required
                    icon={
                      <ShieldCheck
                        size={20}
                      />
                    }
                  >

                    <input
                      name="identityNumber"
                      value={
                        form.identityNumber
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter identity number"
                    />

                  </FormField>

                </div>

                <div className="form-grid">

                  <FormField
                    label="Identity Document"
                    required
                    icon={
                      <Upload size={20} />
                    }
                  >

                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setForm(
                          (current) => ({
                            ...current,

                            identityDocument:
                              e.target
                                .files?.[0] ||
                              null,
                          })
                        )
                      }
                    />

                  </FormField>

                  <FormField
                    label="Selfie"
                    required
                    icon={
                      <User size={20} />
                    }
                  >

                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) =>
                        setForm(
                          (current) => ({
                            ...current,

                            selfie:
                              e.target
                                .files?.[0] ||
                              null,
                          })
                        )
                      }
                    />

                  </FormField>

                </div>

                <label className="agreement-row">

                  <input
                    type="checkbox"
                    checked={
                      form.agreement
                    }
                    onChange={(e) =>
                      setForm(
                        (current) => ({
                          ...current,

                          agreement:
                            e.target.checked,
                        })
                      )
                    }
                  />

                  <span>
                    I confirm that the
                    information provided by me
                    is accurate and belongs to me.
                  </span>

                </label>

                {error && (
                  <div className="technician-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="next-button"
                >

                  <span>
                    Next
                  </span>

                  <ArrowRight
                    size={21}
                  />

                </button>

              </form>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (

              <div className="technician-step">

                <div className="step-heading">

                  <h3>
                    Service Details
                  </h3>

                  <p>
                    Tell us about your professional
                    experience and the services you provide.
                  </p>

                </div>

                {/* CATEGORY */}

                <div className="service-section">

                  <label className="service-main-label">

                    What service do you provide?

                    <span>*</span>

                  </label>

                  <div className="category-selection">

                    {CATEGORIES.map(
                      (category) => (

                        <button
                          type="button"
                          key={
                            category.value
                          }
                          className={
                            form.category ===
                            category.value
                              ? "category-option selected"
                              : "category-option"
                          }
                          onClick={() => {

                            setError("");

                            setForm(
                              (current) => ({
                                ...current,

                                category:
                                  category.value,

                                skills: [],
                              })
                            );

                          }}
                        >

                          <div className="category-option-icon">

                            {
                              category.icon
                            }

                          </div>

                          <span>
                            {
                              category.label
                            }
                          </span>

                          {form.category ===
                            category.value && (

                            <CheckCircle
                              size={19}
                              className="category-selected-icon"
                            />

                          )}

                        </button>

                      )
                    )}

                  </div>

                </div>

                {/* EXPERIENCE */}

                <div className="service-section">

                  <label className="service-main-label">

                    How much experience do you have?

                    <span>*</span>

                  </label>

                  <div className="experience-options">

                    {EXPERIENCE_OPTIONS.map(
                      (item) => (

                        <button
                          type="button"
                          key={
                            item.value
                          }
                          className={
                            form.experience ===
                            item.value
                              ? "experience-option selected"
                              : "experience-option"
                          }
                          onClick={() => {

                            setError("");

                            setForm(
                              (current) => ({
                                ...current,

                                experience:
                                  item.value,
                              })
                            );

                          }}
                        >

                          <strong>
                            {item.label}
                          </strong>

                          <span>
                            {
                              item.description
                            }
                          </span>

                        </button>

                      )
                    )}

                  </div>

                </div>

                {/* SKILLS */}

                <div className="service-section">

                  <label className="service-main-label">

                    Select your skills

                    <span>*</span>

                  </label>

                  <p className="service-helper-text">

                    Select all the services you are
                    comfortable providing.

                  </p>

                  <div className="skills-selection">

                    {(
                      SKILL_OPTIONS[
                        form.category
                      ] || []
                    ).map(
                      (skill) => (

                        <button
                          type="button"
                          key={skill}
                          className={
                            form.skills.includes(
                              skill
                            )
                              ? "skill-option selected"
                              : "skill-option"
                          }
                          onClick={() =>
                            toggleSkill(
                              skill
                            )
                          }
                        >

                          <span className="skill-check">

                            {form.skills.includes(
                              skill
                            )
                              ? "✓"
                              : "+"}

                          </span>

                          {skill}

                        </button>

                      )
                    )}

                  </div>

                </div>

                {error && (
                  <div className="technician-error">
                    {error}
                  </div>
                )}

                <div className="step-buttons">

                  <button
                    type="button"
                    className="back-button"
                    onClick={
                      handleBack
                    }
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="next-button"
                    onClick={() => {

                      if (
                        !form.category
                      ) {
                        setError(
                          "Please select your service category."
                        );

                        return;
                      }

                      if (
                        !form.experience
                      ) {
                        setError(
                          "Please select your experience."
                        );

                        return;
                      }

                      if (
                        form.skills
                          .length === 0
                      ) {
                        setError(
                          "Please select at least one skill."
                        );

                        return;
                      }

                      setError("");
                      setStep(3);

                    }}
                  >

                    Continue

                    <ArrowRight
                      size={20}
                    />

                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {step === 3 && (

              <div className="technician-step">

                <div className="step-heading">

                  <h3>
                    Service Location
                  </h3>

                  <p>
                    Tell us where you provide
                    services and how far you are
                    willing to travel.
                  </p>

                </div>

                <div className="form-grid">

                  {/* STATE */}

                  <FormField
                    label="State / Union Territory"
                    required
                    icon={
                      <MapPin
                        size={20}
                      />
                    }
                  >

                    <select
                      name="state"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select State / UT
                      </option>

                      {Object.keys(
                        INDIA_LOCATIONS
                      ).map(
                        (state) => (

                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>

                        )
                      )}

                    </select>

                  </FormField>

                  {/* CITY */}

                  <FormField
                    label="City"
                    required
                    icon={
                      <Building2
                        size={20}
                      />
                    }
                  >

                    <select
                      name="city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !form.state
                      }
                    >

                      <option value="">

                        {form.state
                          ? "Select City"
                          : "Select State First"}

                      </option>

                      {(
                        INDIA_LOCATIONS[
                          form.state
                        ] || []
                      ).map(
                        (city) => (

                          <option
                            key={city}
                            value={city}
                          >
                            {city}
                          </option>

                        )
                      )}

                    </select>

                  </FormField>

                </div>

                {/* SERVICE AREA */}

                <FormField
                  label="Service Location / Area"
                  required
                  icon={
                    <MapPin
                      size={20}
                    />
                  }
                  full
                >

                  <input
                    name="serviceLocation"
                    value={
                      form.serviceLocation
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your service area / locality"
                  />

                </FormField>

                {/* CURRENT LOCATION */}

                <button
                  type="button"
                  className="location-button"
                  onClick={
                    handleCurrentLocation
                  }
                >

                  <LocateFixed
                    size={18}
                  />

                  Use Current Location

                </button>

                {form.latitude &&
                  form.longitude && (

                    <div className="location-success">

                      <CheckCircle
                        size={17}
                      />

                      Location coordinates
                      captured.

                    </div>

                  )}

                {success && (

                  <div className="location-success">

                    <CheckCircle
                      size={17}
                    />

                    {success}

                  </div>

                )}

                {/* COVERAGE */}

                <div className="coverage-title">

                  <label>

                    Service Coverage

                    <span>*</span>

                  </label>

                </div>

                <div className="coverage-options">

                  {COVERAGE_OPTIONS.map(
                    (coverage) => (

                      <button
                        type="button"
                        key={
                          coverage.value
                        }
                        className={
                          form.coverageType ===
                          coverage.value
                            ? "coverage-option selected"
                            : "coverage-option"
                        }
                        onClick={() => {

                          setError("");

                          setForm(
                            (current) => ({
                              ...current,

                              coverageType:
                                coverage.value,
                            })
                          );

                        }}
                      >

                        {
                          coverage.label
                        }

                      </button>

                    )
                  )}

                </div>

                {error && (

                  <div className="technician-error">
                    {error}
                  </div>

                )}

                <div className="step-buttons">

                  <button
                    type="button"
                    className="back-button"
                    onClick={
                      handleBack
                    }
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="next-button"
                    onClick={() => {

                      if (
                        !form.state ||
                        !form.city ||
                        !form.serviceLocation.trim() ||
                        !form.coverageType
                      ) {
                        setError(
                          "Please complete all service location details."
                        );

                        return;
                      }

                      setError("");
                      setStep(4);

                    }}
                  >

                    Continue

                    <ArrowRight
                      size={20}
                    />

                  </button>

                </div>

              </div>
            )}

            {/* =================================================
                STEP 4
            ================================================= */}

            {step === 4 && (

              <div className="technician-step">

                <div className="step-heading">

                  <h3>
                    {otpSent
                      ? "Phone Verification"
                      : "Review & Submit"}
                  </h3>

                  <p>
                    {otpSent
                      ? "Enter the OTP sent to your registered phone number."
                      : "Review your information before submitting your technician application."}
                  </p>

                </div>

                {/* =================================================
                    REVIEW
                ================================================= */}

                {!otpSent ? (

                  <>

                    <div className="review-section">

                      {/* BASIC */}

                      <div className="review-card">

                        <div className="review-card-title">

                          <User
                            size={18}
                          />

                          Basic Information

                        </div>

                        <ReviewRow
                          label="Name"
                          value={
                            form.name
                          }
                        />

                        <ReviewRow
                          label="Phone"
                          value={
                            form.phone
                          }
                        />

                        <ReviewRow
                          label="Email"
                          value={
                            form.email
                          }
                        />

                        <ReviewRow
                          label="Identity"
                          value={
                            selectedIdentity
                          }
                        />

                        <ReviewRow
                          label="Identity Number"
                          value={maskIdentity(
                            form.identityNumber
                          )}
                        />

                        <ReviewRow
                          label="ID Document"
                          value={
                            form
                              .identityDocument
                              ?.name
                          }
                        />

                        <ReviewRow
                          label="Selfie"
                          value={
                            form.selfie
                              ?.name
                          }
                        />

                      </div>

                      {/* PROFESSIONAL */}

                      <div className="review-card">

                        <div className="review-card-title">

                          <Wrench
                            size={18}
                          />

                          Professional Details

                        </div>

                        <ReviewRow
                          label="Category"
                          value={
                            selectedCategory
                              ?.label
                          }
                        />

                        <ReviewRow
                          label="Experience"
                          value={
                            selectedExperience
                              ?.label
                          }
                        />

                        <ReviewRow
                          label="Skills"
                          value={
                            form.skills.join(
                              ", "
                            )
                          }
                        />

                      </div>

                      {/* LOCATION */}

                      <div className="review-card">

                        <div className="review-card-title">

                          <MapPin
                            size={18}
                          />

                          Service Location

                        </div>

                        <ReviewRow
                          label="State / UT"
                          value={
                            form.state
                          }
                        />

                        <ReviewRow
                          label="City"
                          value={
                            form.city
                          }
                        />

                        <ReviewRow
                          label="Area"
                          value={
                            form.serviceLocation
                          }
                        />

                        <ReviewRow
                          label="Coverage"
                          value={
                            selectedCoverage
                              ?.label
                          }
                        />

                        <ReviewRow
                          label="Coordinates"
                          value={
                            form.latitude &&
                            form.longitude
                              ? `${form.latitude}, ${form.longitude}`
                              : "Not captured"
                          }
                        />

                      </div>

                    </div>

                    {/* AGREEMENT */}

                    <label className="agreement-row">

                      <input
                        type="checkbox"
                        checked={
                          form.agreement
                        }
                        onChange={(e) =>
                          setForm(
                            (current) => ({
                              ...current,

                              agreement:
                                e.target
                                  .checked,
                            })
                          )
                        }
                      />

                      <span>
                        I confirm that all
                        information provided by me
                        is accurate and I agree to
                        RepairGo's technician
                        verification process.
                      </span>

                    </label>

                    {error && (

                      <div className="technician-error">
                        {error}
                      </div>

                    )}

                    {success && (

                      <div className="location-success">

                        <CheckCircle
                          size={17}
                        />

                        {success}

                      </div>

                    )}

                    <div className="step-buttons">

                      <button
                        type="button"
                        className="back-button"
                        onClick={
                          handleBack
                        }
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        className="next-button"
                        disabled={
                          submitting
                        }
                        onClick={
                          handleSendOtp
                        }
                      >

                        {submitting
                          ? "Sending OTP..."
                          : "Submit & Verify"}

                        {!submitting && (

                          <ArrowRight
                            size={20}
                          />

                        )}

                      </button>

                    </div>

                  </>

                ) : (

                  /* =================================================
                     OTP
                  ================================================= */

                  <div className="otp-verification">

                    <div className="otp-icon">

                      <ShieldCheck
                        size={28}
                      />

                    </div>

                    <h3>
                      Verify Your Phone Number
                    </h3>

                    <p>

                      We sent a 6-digit OTP to{" "}

                      <strong>
                        +91 {form.phone}
                      </strong>

                    </p>

                    <input
                      className="otp-input"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(
                              0,
                              6
                            )
                        )
                      }
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      inputMode="numeric"
                    />

                    {error && (

                      <div className="technician-error">
                        {error}
                      </div>

                    )}

                    {success && (

                      <div className="location-success">

                        <CheckCircle
                          size={17}
                        />

                        {success}

                      </div>

                    )}

                    <button
                      type="button"
                      className="next-button"
                      disabled={
                        submitting ||
                        otp.length !== 6
                      }
                      onClick={
                        handleVerifyAndSubmit
                      }
                    >

                      {submitting
                        ? "Verifying..."
                        : "Verify & Create Account"}

                      {!submitting && (

                        <CheckCircle
                          size={20}
                        />

                      )}

                    </button>

                  </div>

                )}

              </div>
            )}

            <div className="login-text">

              Already have an account?{" "}

              <Link to="/technician-auth">
                Login
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   REVIEW ROW
========================================================= */

function ReviewRow({
  label,
  value,
}) {
  return (
    <div className="review-row">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  );
}

/* =========================================================
   MASK IDENTITY
========================================================= */

function maskIdentity(
  value
) {
  if (!value) {
    return "-";
  }

  if (value.length <= 4) {
    return value;
  }

  return (
    "••••" +
    value.slice(-4)
  );
}

/* =========================================================
   PROMO FEATURE
========================================================= */

function PromoFeature({
  icon,
  text,
}) {
  return (
    <div className="promo-feature">

      <div className="promo-icon">
        {icon}
      </div>

      <div className="promo-feature-text">
        {text}
      </div>

    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required,
  optional,
  icon,
  children,
  full,
}) {
  return (
    <div
      className={
        full
          ? "form-field full"
          : "form-field"
      }
    >

      <label>

        {label}

        {required && (
          <span className="required">
            *
          </span>
        )}

        {optional && (
          <span className="optional">
            {" "}
            (Optional)
          </span>
        )}

      </label>

      <div className="input-wrapper">

        <span className="input-icon">
          {icon}
        </span>

        {children}

        {children?.type ===
          "select" && (

          <span className="select-arrow">
            ▾
          </span>

        )}

      </div>

    </div>
  );
}

export default TechnicianAuth;