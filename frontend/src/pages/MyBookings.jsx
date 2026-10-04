import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  CreditCard,
  Package,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const STATUS_COLORS = {
  pending: "#b5860b",
  accepted: "#1f5c56",
  declined: "#b3261e",
  completed: "#3a3a3a",
  cancelled: "#999",
};

function MyBookings() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/bookings/my");

      setBookings(data.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    setUpdatingId(bookingId);
    setError("");

    try {
      await api.patch(
        `/bookings/${bookingId}/status`,
        { status }
      );

      await loadBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update booking"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="page">

      {/* TOP BAR */}
      <div className="top-bar">

        <div
          className="brand"
          style={{ marginBottom: 0 }}
        >
          RepairGo
        </div>

        <button onClick={handleLogout}>
          Log out
        </button>

      </div>

      {/* HEADER */}
      <div className="subtitle">
        My Bookings
      </div>

      {currentUser?.role === "customer" && (
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "#1f5c56",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Book another service
        </button>
      )}

      {/* ERROR */}
      {error && (
        <div
          className="error-box"
          style={{ marginTop: 16 }}
        >
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ marginTop: 25 }}>
          <p
            style={{
              color: "#6b6b6b",
              fontSize: 14,
            }}
          >
            Loading your bookings...
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && bookings.length === 0 && (
        <div
          style={{
            marginTop: 25,
            padding: 30,
            border: "1px solid #e5e5e5",
            borderRadius: 14,
            textAlign: "center",
            background: "#fff",
          }}
        >
          <Package
            size={45}
            color="#999"
          />

          <h3 style={{ marginTop: 12 }}>
            No bookings yet
          </h3>

          <p
            style={{
              color: "#6b6b6b",
              fontSize: 14,
            }}
          >
            Book your first repair service with
            RepairGo.
          </p>

          <button
            className="btn"
            style={{ marginTop: 10 }}
            onClick={() => navigate("/")}
          >
            Browse Services
          </button>
        </div>
      )}

      {/* BOOKINGS */}
      <div style={{ marginTop: 22 }}>

        {!loading &&
          bookings.map((booking) => {

            const isTechnicianView =
              currentUser?.role === "technician";

            const services =
              booking.services || [];

            const address =
              booking.serviceAddress || {};

            return (
              <div
                key={booking._id}
                className="tech-card"
                style={{
                  marginBottom: 18,
                  padding: 20,
                }}
              >

                {/* BOOKING HEADER */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 15,
                  }}
                >

                  <div>

                    <h3
                      style={{
                        marginBottom: 5,
                      }}
                    >
                      Booking #{booking._id?.slice(-6)}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: "#777",
                      }}
                    >
                      <CalendarDays
                        size={14}
                        style={{
                          verticalAlign: "middle",
                          marginRight: 5,
                        }}
                      />

                      {formatDate(
                        booking.createdAt
                      )}
                    </p>

                  </div>

                  <span
                    style={{
                      color:
                        STATUS_COLORS[
                          booking.status
                        ] || "#777",

                      fontWeight: 700,

                      fontSize: 13,

                      padding: "6px 10px",

                      borderRadius: 20,

                      background: "#f5f5f5",

                      textTransform: "capitalize",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatStatus(
                      booking.status
                    )}
                  </span>

                </div>

                {/* TECHNICIAN / CUSTOMER */}
                {isTechnicianView ? (
                  <div
                    style={{
                      marginTop: 15,
                      padding: 12,
                      background: "#f8f8f8",
                      borderRadius: 10,
                    }}
                  >
                    <strong>
                      Customer
                    </strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: 14,
                      }}
                    >
                      {booking.customerId?.name ||
                        "Customer"}
                    </p>

                    {booking.customerId?.email && (
                      <p
                        style={{
                          margin: "3px 0 0",
                          fontSize: 13,
                          color: "#777",
                        }}
                      >
                        {booking.customerId.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 15,
                      padding: 12,
                      background: "#f8f8f8",
                      borderRadius: 10,
                    }}
                  >
                    <strong>
                      Technician
                    </strong>

                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: 14,
                      }}
                    >
                      {booking.technicianId?.name ||
                        "Technician will be assigned"}
                    </p>

                    {booking.technicianId?.email && (
                      <p
                        style={{
                          margin: "3px 0 0",
                          fontSize: 13,
                          color: "#777",
                        }}
                      >
                        {booking.technicianId.email}
                      </p>
                    )}
                  </div>
                )}

                {/* SERVICES */}
                <div style={{ marginTop: 18 }}>

                  <h4
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    Services
                  </h4>

                  {services.map(
                    (service, index) => (
                      <div
                        key={
                          service.serviceId ||
                          index
                        }
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: 15,
                          padding:
                            "9px 0",
                          borderBottom:
                            index !==
                            services.length - 1
                              ? "1px solid #eee"
                              : "none",
                        }}
                      >

                        <div>

                          <strong
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {service.name}
                          </strong>

                          <div
                            style={{
                              fontSize: 12,
                              color: "#777",
                              marginTop: 3,
                            }}
                          >
                            ₹{service.price} ×{" "}
                            {service.quantity}
                          </div>

                        </div>

                        <strong>
                          ₹
                          {Number(
                            service.price
                          ) *
                            Number(
                              service.quantity ||
                                1
                            )}
                        </strong>

                      </div>
                    )
                  )}

                </div>

                {/* BILL */}
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 15,
                    borderTop:
                      "1px solid #e5e5e5",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    <span>Subtotal</span>

                    <span>
                      ₹{booking.subtotal || 0}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      fontSize: 13,
                      marginBottom: 8,
                    }}
                  >
                    <span>Discount</span>

                    <span
                      style={{
                        color: "#1f5c56",
                      }}
                    >
                      - ₹
                      {booking.discount || 0}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    <span>Total</span>

                    <span>
                      ₹{booking.total || 0}
                    </span>
                  </div>

                </div>

                {/* PAYMENT */}
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    background: "#fafafa",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >

                    <span>
                      <CreditCard
                        size={15}
                        style={{
                          verticalAlign:
                            "middle",
                          marginRight: 5,
                        }}
                      />

                      Payment
                    </span>

                    <strong
                      style={{
                        textTransform:
                          "capitalize",
                      }}
                    >
                      {booking.paymentMethod ===
                      "cash"
                        ? "Cash on Service"
                        : "Online Payment"}
                    </strong>

                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      color: "#777",
                    }}
                  >
                    Status:{" "}
                    {booking.paymentStatus ===
                    "cash_on_service"
                      ? "Pay after service"
                      : formatStatus(
                          booking.paymentStatus
                        )}
                  </div>

                </div>

                {/* ADDRESS */}
                {address.city && (
                  <div
                    style={{
                      marginTop: 15,
                      padding: 12,
                      background: "#f8f8f8",
                      borderRadius: 10,
                    }}
                  >

                    <strong>
                      <MapPin
                        size={15}
                        style={{
                          verticalAlign:
                            "middle",
                          marginRight: 5,
                        }}
                      />

                      Service Address
                    </strong>

                    <p
                      style={{
                        margin:
                          "7px 0 0",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "#555",
                      }}
                    >
                      {address.name}
                      <br />
                      {address.house},{" "}
                      {address.area}
                      <br />
                      {address.city} -{" "}
                      {address.pincode}
                      <br />
                      Phone: {address.phone}
                    </p>

                  </div>
                )}

                {/* TECHNICIAN ACTIONS */}
                {isTechnicianView &&
                  booking.status ===
                    "pending" && (

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 16,
                      }}
                    >

                      <button
                        className="btn"
                        style={{
                          background:
                            "#1f5c56",
                        }}
                        disabled={
                          updatingId ===
                          booking._id
                        }
                        onClick={() =>
                          handleStatusChange(
                            booking._id,
                            "accepted"
                          )
                        }
                      >
                        {updatingId ===
                        booking._id
                          ? "Updating..."
                          : "Accept"}
                      </button>

                      <button
                        className="btn"
                        style={{
                          background:
                            "#b3261e",
                        }}
                        disabled={
                          updatingId ===
                          booking._id
                        }
                        onClick={() =>
                          handleStatusChange(
                            booking._id,
                            "declined"
                          )
                        }
                      >
                        Decline
                      </button>

                    </div>
                  )}

                {/* COMPLETE BUTTON */}
                {isTechnicianView &&
                  booking.status ===
                    "accepted" && (

                    <button
                      className="btn"
                      style={{
                        marginTop: 15,
                      }}
                      disabled={
                        updatingId ===
                        booking._id
                      }
                      onClick={() =>
                        handleStatusChange(
                          booking._id,
                          "completed"
                        )
                      }
                    >
                      Mark as Completed
                    </button>
                  )}

              </div>
            );
          })}

      </div>

      {/* REFRESH */}
      {!loading && bookings.length > 0 && (
        <button
          onClick={loadBookings}
          disabled={loading}
          style={{
            marginTop: 5,
            marginBottom: 25,
            background: "none",
            border: "none",
            color: "#1f5c56",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <RefreshCw size={15} />
          Refresh Bookings
        </button>
      )}

    </div>
  );
}

export default MyBookings;