import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const submitSignup = async (longitude, latitude) => {
      try {
        const { data } = await api.post("/auth/signup", { ...form, longitude, latitude });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } catch (err) {
        setError(err.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => submitSignup(position.coords.longitude, position.coords.latitude),
      () => submitSignup(0, 0)
    );
  };

  return (
    <div className="page">
      <div className="brand">RepairGo</div>
      <div className="subtitle">Create a customer account</div>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="link-row">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
      <div className="link-row">
        Are you a technician? <Link to="/technician-auth">Register here</Link>
      </div>
    </div>
  );
}

export default Signup;