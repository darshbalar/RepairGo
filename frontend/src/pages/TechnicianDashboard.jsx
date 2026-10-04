import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  Clock3,
  MapPin,
  IndianRupee,
  Power,
  XCircle,
  LogOut,
  User,
  Wrench,
  History,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

function TechnicianDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/technician-auth", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "technician") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/technician-auth", { replace: true });
        return;
      }

      setUser(parsedUser);
      setIsAvailable(Boolean(parsedUser.isAvailable));
      loadDashboard();
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/technician-auth", { replace: true });
    }
  }, [navigate]);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [requestResponse, bookingResponse] = await Promise.all([
        api.get("/bookings/technician/requests"),
        api.get("/bookings/my"),
      ]);

      setRequests(requestResponse.data?.bookings || []);
      setBookings(bookingResponse.data?.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load technician dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvailability = async () => {
    try {
      setActionLoading("availability");

      const newValue = !isAvailable;

      const { data } = await api.patch(
        "/bookings/technician/availability",
        {
          isAvailable: newValue,
        }
      );

      setIsAvailable(data.isAvailable);

      const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      savedUser.isAvailable = data.isAvailable;

      localStorage.setItem(
        "user",
        JSON.stringify(savedUser)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update availability."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      setActionLoading(bookingId);

      await api.patch(`/bookings/${bookingId}/accept`);

      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "This request is no longer available."
      );

      await loadDashboard();
    } finally {
      setActionLoading("");
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      setActionLoading(bookingId);

      await api.patch(`/bookings/${bookingId}/decline`);

      setRequests((current) =>
        current.filter((booking) => booking._id !== bookingId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not decline this request."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  const activeBookings = bookings.filter(
    (booking) => booking.status === "accepted"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  if (loading && !user) {
    return (
      <div className="technician-dashboard-loading">
        Loading professional dashboard...
      </div>
    );
  }

  return (
    <div className="technician-dashboard">

      {/* HEADER */}
      <header className="professional-header">
        <div className="professional-logo">
          <div className="professional-logo-box">RG</div>
          <div>
            <strong>RepairGo</strong>
            <span>Professional</span>
          </div>
        </div>

        <div className="professional-header-right">

          <button
            className="refresh-button"
            onClick={loadDashboard}
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>

          <div className="professional-profile">
            <div className="professional-avatar">
              <User size={19} />
            </div>

            <div>
              <strong>{user?.name || "Professional"}</strong>
              <span>
                {user?.category
                  ? user.category.replaceAll("_", " ")
                  : "Technician"}
              </span>
            </div>
          </div>

          <button
            className="professional-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="professional-main">

        {/* WELCOME */}
        <section className="professional-welcome">

          <div>
            <p className="professional-eyebrow">
              PROFESSIONAL DASHBOARD
            </p>

            <h1>
              Welcome back, {user?.name?.split(" ")[0] || "Professional"} 👋
            </h1>

            <p>
              Manage your service requests and bookings from here.
            </p>
          </div>

          <button
            className={
              isAvailable
                ? "availability-toggle online"
                : "availability-toggle offline"
            }
            onClick={handleAvailability}
            disabled={actionLoading === "availability"}
          >
            <span className="availability-dot" />

            <span>
              {actionLoading === "availability"
                ? "Updating..."
                : isAvailable
                ? "Online"
                : "Offline"}
            </span>

            <Power size={17} />
          </button>

        </section>

        {/* ERROR */}
        {error && (
          <div className="professional-error">
            <XCircle size={18} />
            <span>{error}</span>

            <button onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="professional-stats">

          <div className="professional-stat-card">
            <div className="stat-icon request">
              <Bell size={21} />
            </div>

            <div>
              <span>New Requests</span>
              <strong>{requests.length}</strong>
            </div>
          </div>

          <div className="professional-stat-card">
            <div className="stat-icon active">
              <Wrench size={21} />
            </div>

            <div>
              <span>Active Bookings</span>
              <strong>{activeBookings.length}</strong>
            </div>
          </div>

          <div className="professional-stat-card">
            <div className="stat-icon completed">
              <CheckCircle size={21} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedBookings.length}</strong>
            </div>
          </div>

          <div className="professional-stat-card">
            <div className="stat-icon category">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Service Category</span>
              <strong>
                {user?.category
                  ? user.category.replaceAll("_", " ")
                  : "-"}
              </strong>
            </div>
          </div>

        </section>

        {/* REQUESTS */}
        <section className="professional-section">

          <div className="section-heading">
            <div>
              <h2>New Service Requests</h2>
              <p>
                Requests matching your service category and area.
              </p>
            </div>

            <span className="request-count">
              {requests.length} Requests
            </span>
          </div>

          {!isAvailable && (
            <div className="offline-message">
              <Power size={20} />

              <div>
                <strong>You are currently offline</strong>
                <p>
                  Turn on your availability to receive new service
                  requests.
                </p>
              </div>
            </div>
          )}

          {isAvailable && requests.length === 0 && (
            <div className="empty-professional-state">
              <Bell size={34} />

              <h3>No new requests</h3>

              <p>
                New matching customer requests will appear here.
              </p>
            </div>
          )}

          <div className="professional-request-list">

            {requests.map((booking) => (
              <RequestCard
                key={booking._id}
                booking={booking}
                loading={actionLoading === booking._id}
                onAccept={() => handleAccept(booking._id)}
                onDecline={() => handleDecline(booking._id)}
              />
            ))}

          </div>

        </section>

        {/* ACTIVE BOOKINGS */}
        <section className="professional-section">

          <div className="section-heading">
            <div>
              <h2>My Active Bookings</h2>
              <p>
                Customers whose service you have accepted.
              </p>
            </div>
          </div>

          {activeBookings.length === 0 ? (
            <div className="empty-professional-state compact">
              <Wrench size={30} />

              <h3>No active booking</h3>

              <p>
                Accept a service request to see it here.
              </p>
            </div>
          ) : (
            <div className="professional-request-list">
              {activeBookings.map((booking) => (
                <ActiveBookingCard
                  key={booking._id}
                  booking={booking}
                />
              ))}
            </div>
          )}

        </section>

        {/* HISTORY */}
        <section className="professional-section">

          <div className="section-heading">
            <div>
              <h2>Booking History</h2>
              <p>Your previous service bookings.</p>
            </div>

            <History size={20} />
          </div>

          {completedBookings.length === 0 ? (
            <div className="empty-professional-state compact">
              <History size={28} />

              <h3>No completed bookings yet</h3>

              <p>
                Your completed jobs will appear here.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {completedBookings.map((booking) => (
                <HistoryCard
                  key={booking._id}
                  booking={booking}
                />
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
}


/* =========================
   REQUEST CARD
========================= */

function RequestCard({
  booking,
  loading,
  onAccept,
  onDecline,
}) {
  return (
    <article className="professional-request-card">

      <div className="request-card-top">

        <div className="request-service-info">

          <div className="request-service-icon">
            <Wrench size={22} />
          </div>

          <div>
            <span className="request-label">
              SERVICE REQUEST
            </span>

            <h3>
              {booking.services?.[0]?.category
                ?.replaceAll("_", " ")
                ?.replace(/\b\w/g, (letter) =>
                  letter.toUpperCase()
                ) || "Repair Service"}
            </h3>
          </div>

        </div>

        <div className="request-amount">
          <span>Booking Amount</span>

          <strong>
            <IndianRupee size={15} />
            {booking.total}
          </strong>
        </div>

      </div>

      <div className="request-divider" />

      <div className="customer-info-grid">

        <div className="customer-info">

          <span>Customer</span>

          <strong>
            {booking.customerId?.name || "Customer"}
          </strong>

        </div>

        <div className="customer-info">

          <span>Phone</span>

          <strong>
            {booking.customerId?.phone || "-"}
          </strong>

        </div>

        <div className="customer-info address">

          <span>
            <MapPin size={15} />
            Service Address
          </span>

          <strong>
            {formatAddress(booking.serviceAddress)}
          </strong>

        </div>

      </div>

      <div className="requested-services">

        <span>Requested Services</span>

        <div className="service-tags">

          {booking.services?.map((service) => (
            <span key={service.serviceId}>
              {service.name}
              {service.quantity > 1
                ? ` × ${service.quantity}`
                : ""}
            </span>
          ))}

        </div>

      </div>

      <div className="request-actions">

        <button
          className="decline-request"
          onClick={onDecline}
          disabled={loading}
        >
          <XCircle size={17} />
          Decline
        </button>

        <button
          className="accept-request"
          onClick={onAccept}
          disabled={loading}
        >
          <CheckCircle size={17} />

          {loading
            ? "Processing..."
            : "Accept Request"}
        </button>

      </div>

    </article>
  );
}


/* =========================
   ACTIVE BOOKING
========================= */

function ActiveBookingCard({ booking }) {
  return (
    <article className="professional-active-card">

      <div className="active-card-header">

        <div>
          <span>ACTIVE SERVICE</span>

          <h3>
            {booking.services?.[0]?.name ||
              "Repair Service"}
          </h3>
        </div>

        <div className="active-status">
          <span />
          Accepted
        </div>

      </div>

      <div className="active-card-body">

        <div>
          <span>Customer</span>
          <strong>
            {booking.customerId?.name || "Customer"}
          </strong>
        </div>

        <div>
          <span>Phone</span>
          <strong>
            {booking.customerId?.phone || "-"}
          </strong>
        </div>

        <div>
          <span>Amount</span>
          <strong>₹{booking.total}</strong>
        </div>

        <div className="active-address">
          <span>
            <MapPin size={15} />
            Service Address
          </span>

          <strong>
            {formatAddress(booking.serviceAddress)}
          </strong>
        </div>

      </div>

    </article>
  );
}


/* =========================
   HISTORY CARD
========================= */

function HistoryCard({ booking }) {
  return (
    <div className="history-card">

      <div>
        <strong>
          {booking.services?.[0]?.name ||
            "Repair Service"}
        </strong>

        <span>
          {booking.customerId?.name || "Customer"}
        </span>
      </div>

      <div>
        <strong>₹{booking.total}</strong>

        <span className="completed-badge">
          Completed
        </span>
      </div>

    </div>
  );
}


/* =========================
   HELPERS
========================= */

function formatAddress(address) {
  if (!address) return "Address not available";

  return [
    address.house,
    address.area,
    address.city,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

export default TechnicianDashboard;