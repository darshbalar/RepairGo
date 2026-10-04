import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  CalendarDays,
  Home,
  MapPin,
  CreditCard,
} from "lucide-react";

import Navbar from "../components/Navbar";
import "../App.css";

function OrderSuccess() {
  const navigate = useNavigate();

  const booking = JSON.parse(
    localStorage.getItem("repairgo_last_booking") || "null"
  );

  if (!booking) {
    return (
      <div className="success-page">
        <Navbar />

        <div className="success-container">
          <div className="success-icon">
            <CheckCircle size={70} />
          </div>

          <h1>Booking Completed</h1>

          <p>
            Your booking details are not available on this device.
          </p>

          <div className="success-actions">
            <button
              className="success-primary-btn"
              onClick={() => navigate("/bookings")}
            >
              <CalendarDays size={18} />
              View My Bookings
            </button>

            <button
              className="success-secondary-btn"
              onClick={() => navigate("/")}
            >
              <Home size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bookingData = booking.booking || booking;

  const services = bookingData.services || [];
  const address = bookingData.serviceAddress || {};

  return (
    <div className="success-page">
      <Navbar />

      <div className="success-container">

        {/* SUCCESS ICON */}
        <div className="success-icon">
          <CheckCircle size={70} />
        </div>

        <h1>Booking Placed Successfully!</h1>

        <p>
          Your RepairGo service booking has been received successfully.
        </p>

        {/* BOOKING ID */}
        <div className="booking-id-box">
          <span>Booking ID</span>

          <strong>
            {bookingData._id || "Processing"}
          </strong>
        </div>

        {/* BOOKING STATUS */}
        <div className="booking-status-box">
          <span>Booking Status</span>

          <strong>
            {bookingData.status || "pending"}
          </strong>
        </div>

        {/* SERVICES */}
        <div className="success-card">

          <h3>Service Details</h3>

          {services.length > 0 ? (
            services.map((service) => (
              <div
                className="success-service-row"
                key={service.serviceId}
              >
                <div>
                  <strong>{service.name}</strong>

                  <span>
                    ₹{service.price} × {service.quantity}
                  </span>
                </div>

                <strong>
                  ₹
                  {Number(service.price) *
                    Number(service.quantity || 1)}
                </strong>
              </div>
            ))
          ) : (
            <p>No service details available.</p>
          )}

        </div>

        {/* BILL SUMMARY */}
        <div className="success-card">

          <h3>Bill Summary</h3>

          <div className="success-card-row">
            <span>Subtotal</span>
            <strong>₹{bookingData.subtotal || 0}</strong>
          </div>

          <div className="success-card-row">
            <span>Discount</span>
            <strong className="discount-text">
              - ₹{bookingData.discount || 0}
            </strong>
          </div>

          <div className="success-card-row total-row">
            <span>Total Amount</span>
            <strong>₹{bookingData.total || 0}</strong>
          </div>

        </div>

        {/* PAYMENT METHOD */}
        <div className="success-card">

          <h3>
            <CreditCard size={19} />
            Payment Method
          </h3>

          <div className="success-card-row">
            <span>Method</span>

            <strong>
              {bookingData.paymentMethod === "cash"
                ? "Cash on Service"
                : "Online Payment"}
            </strong>
          </div>

          <div className="success-card-row">
            <span>Payment Status</span>

            <strong>
              {bookingData.paymentStatus === "cash_on_service"
                ? "Pay after service"
                : bookingData.paymentStatus || "Pending"}
            </strong>
          </div>

        </div>

        {/* SERVICE ADDRESS */}
        <div className="success-card">

          <h3>
            <MapPin size={19} />
            Service Address
          </h3>

          <div className="address-details">

            <strong>
              {address.name}
            </strong>

            <span>
              {address.phone}
            </span>

            <span>
              {address.house}, {address.area}
            </span>

            <span>
              {address.city} - {address.pincode}
            </span>

          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="success-actions">

          <button
            className="success-primary-btn"
            onClick={() => navigate("/bookings")}
          >
            <CalendarDays size={18} />
            View My Bookings
          </button>

          <button
            className="success-secondary-btn"
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;