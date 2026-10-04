import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // If user came from checkout/payment flow,
      // continue from there instead of going to Home.
      const redirectTo = location.state?.from || "/";

      navigate(redirectTo, { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="brand">RepairGo</div>

      <div className="subtitle">
        Log in to your account
      </div>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="field">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

      </form>

      <div className="link-row">
        New here?{" "}
        <Link to="/signup">
          Create an account
        </Link>
      </div>

      <div className="link-row">
        Are you a technician?{" "}
        <Link to="/technician-auth">
          Login here
        </Link>
      </div>

    </div>
  );
}

export default Login;