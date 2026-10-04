import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";

const CATEGORIES = [
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "ac_repair", label: "AC Repair" },
  { value: "appliance_repair", label: "Appliance Repair" },
  { value: "carpenter", label: "Carpenter" },
];

function SearchTechnicians() {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState(location.state?.category || "electrician");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [myCoords, setMyCoords] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = () => {
    setError("");
    setLoading(true);
    setSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setMyCoords({ longitude: position.coords.longitude, latitude: position.coords.latitude });
        try {
          const { data } = await api.get("/technicians/search", {
            params: {
              category,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              maxDistanceKm: 10,
            },
          });
          setTechnicians(data.technicians);
        } catch (err) {
          setError(err.response?.data?.message || "Search failed");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission is needed to find nearby technicians");
        setLoading(false);
      }
    );
  };

  const handleBook = async (tech) => {
    setBookingId(tech._id);
    setBookingSuccess("");
    setError("");
    try {
      await api.post("/bookings", {
        technicianId: tech._id,
        category: tech.category,
        problemDescription: "",
        longitude: myCoords?.longitude || 0,
        latitude: myCoords?.latitude || 0,
      });
      setBookingSuccess(`Booking request sent to ${tech.name}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="page">
      <div className="top-bar">
        <div className="brand" style={{ marginBottom: 0 }}>
          RepairGo
        </div>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <div className="subtitle">Find a technician near you</div>
      <Link to="/home" style={{ fontSize: 13, color: "#1f5c56", fontWeight: 600, marginRight: 16 }}>
        ← Home
      </Link>
      <Link to="/bookings" style={{ fontSize: 13, color: "#1f5c56", fontWeight: 600 }}>
        View my bookings →
      </Link>
      <div style={{ height: 16 }} />

      {error && <div className="error-box">{error}</div>}

      <div className="field">
        <label>What do you need fixed?</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <button className="btn" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search nearby"}
      </button>

      <div style={{ marginTop: 24 }}>
        {searched && !loading && technicians.length === 0 && (
          <p style={{ color: "#6b6b6b", fontSize: 14 }}>
            No technicians found nearby for this category yet.
          </p>
        )}

        {technicians.map((tech) => (
          <div className="tech-card" key={tech._id}>
            <h3>{tech.name}</h3>
            <p>{tech.category.replace("_", " ")} · ₹{tech.hourlyRate}/hr</p>
            <p>Rating: {tech.rating > 0 ? tech.rating.toFixed(1) : "New"}</p>
            <button
              className="btn"
              style={{ marginTop: 10 }}
              onClick={() => handleBook(tech)}
              disabled={bookingId === tech._id}
            >
              {bookingId === tech._id ? "Booking..." : "Book Now"}
            </button>
          </div>
        ))}

        {bookingSuccess && <p style={{ color: "#1f5c56", fontSize: 13, marginTop: 8 }}>{bookingSuccess}</p>}
      </div>
    </div>
  );
}

export default SearchTechnicians;