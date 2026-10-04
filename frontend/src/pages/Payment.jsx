import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Banknote,
  Check,
  MapPin,
  Pencil,
} from "lucide-react";

import { useCart } from "../context/CartContext";

import api from "../services/api";


function Payment() {
  const navigate = useNavigate();


  const {
    cart,
    subtotal,
    discount,
    total,
    clearCart,
  } = useCart();


  const [paymentMethod, setPaymentMethod] = useState("online");


  const [address, setAddress] = useState(() => {
    const savedAddress =
      localStorage.getItem("repairgo_address");

    return savedAddress
      ? JSON.parse(savedAddress)
      : null;
  });


  const [showAddressForm, setShowAddressForm] =
    useState(false);


  const [form, setForm] = useState({
    name: "",
    phone: "",
    house: "",
    area: "",
    city: "Surat",
    pincode: "",
  });


  const [error, setError] = useState("");

  const [placingOrder, setPlacingOrder] =
    useState(false);


  // =====================================================
  // HANDLE ADDRESS INPUT
  // =====================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  // =====================================================
  // SAVE ADDRESS
  // =====================================================

  const handleSaveAddress = (e) => {
    e.preventDefault();

    setError("");


    if (
      !form.name ||
      !form.phone ||
      !form.house ||
      !form.area ||
      !form.city ||
      !form.pincode
    ) {
      setError(
        "Please fill all address details."
      );

      return;
    }


    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }


    if (!/^\d{6}$/.test(form.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }


    localStorage.setItem(
      "repairgo_address",
      JSON.stringify(form)
    );


    setAddress(form);

    setShowAddressForm(false);

    setError("");
  };


  // =====================================================
  // EDIT ADDRESS
  // =====================================================

  const handleEditAddress = () => {
    if (address) {
      setForm({
        name: address.name || "",
        phone: address.phone || "",
        house: address.house || "",
        area: address.area || "",
        city: address.city || "Surat",
        pincode: address.pincode || "",
      });
    }


    setError("");

    setShowAddressForm(true);
  };


  // =====================================================
  // CREATE BOOKING
  // =====================================================

  const handleContinue = async () => {
    setError("");


    // ---------------------------------------------------
    // USER LOGIN CHECK
    // ---------------------------------------------------

    const token = localStorage.getItem("token");


    if (!token) {
      navigate("/login", {
        state: {
          from: "/payment",
        },
      });

      return;
    }


    // ---------------------------------------------------
    // CART VALIDATION
    // ---------------------------------------------------

    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");

      return;
    }


    // ---------------------------------------------------
    // ADDRESS VALIDATION
    // ---------------------------------------------------

    if (!address) {
      setError(
        "Please add your service address first."
      );

      setShowAddressForm(true);

      return;
    }


    try {
      setPlacingOrder(true);


      // =================================================
      // CONVERT CART ITEMS INTO BACKEND SERVICES
      // =================================================
      //
      // IMPORTANT:
      //
      // category is now sent to backend.
      //
      // Example:
      //
      // category: "plumber"
      // category: "electrician"
      // category: "ac_repair"
      //
      // We support both:
      //
      // item.category
      // item.categoryId
      //
      // =================================================

      const services = cart.map((item) => ({
        serviceId: String(item.id),

        name: item.name,

        price: Number(item.price),

        quantity: Number(
          item.quantity || 1
        ),

        // IMPORTANT FOR TECHNICIAN MATCHING
        category:
          item.category ||
          item.categoryId,
      }));


      // =================================================
      // BOOKING DATA
      // =================================================

      const bookingData = {
        services,

        subtotal: Number(subtotal),

        discount: Number(discount),

        total: Number(total),

        paymentMethod,

        serviceAddress: {
          name: address.name,

          phone: address.phone,

          house: address.house,

          area: address.area,

          city: address.city,

          pincode: address.pincode,
        },
      };


      // Debug information
      console.log(
        "Creating RepairGo booking:",
        bookingData
      );


      // =================================================
      // SEND BOOKING TO BACKEND
      // =================================================

      const response = await api.post(
        "/bookings",
        bookingData
      );


      const booking =
        response.data.booking;


      // =================================================
      // SAVE LAST BOOKING
      // =================================================

      localStorage.setItem(
        "repairgo_last_booking",
        JSON.stringify(booking)
      );


      // =================================================
      // CLEAR CART
      // =================================================

      clearCart();


      // =================================================
      // GO TO SUCCESS PAGE
      // =================================================

      navigate(
        "/order-success",
        {
          replace: true,
        }
      );

    } catch (err) {
      console.error(
        "Booking creation failed:",
        err
      );


      const message =
        err.response?.data?.message ||
        "Could not place your booking. Please try again.";


      setError(message);

    } finally {
      setPlacingOrder(false);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="payment-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="payment-header">

        <div
          className="payment-brand"
          onClick={() => navigate("/")}
        >

          <div className="payment-brand-badge">
            RG
          </div>

          <span>
            RepairGo
          </span>

        </div>

      </header>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="payment-main">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          className="payment-back-button"
          onClick={() => navigate("/checkout")}
          disabled={placingOrder}
        >

          <ArrowLeft size={18} />

          Back to Checkout

        </button>


        <div className="payment-layout">


          {/* =================================================
              LEFT SIDE
              BILL SUMMARY + ADDRESS
          ================================================= */}

          <section className="payment-left">


            {/* =================================================
                BILL SUMMARY
            ================================================= */}

            <div className="payment-summary-card payment-left-summary">

              <h2>
                Bill Summary
              </h2>


              {/* SERVICES */}

              <div className="payment-summary-services">

                {cart.map((item) => (

                  <div
                    className="payment-summary-row"
                    key={item.id}
                  >

                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>

                  </div>

                ))}

              </div>


              <div className="payment-summary-divider" />


              {/* ITEM TOTAL */}

              <div className="payment-summary-row">

                <span>
                  Item total
                </span>

                <strong>
                  ₹{subtotal}
                </strong>

              </div>


              {/* DISCOUNT */}

              {discount > 0 && (

                <div className="payment-summary-row payment-discount">

                  <span>
                    FIRST100
                  </span>

                  <strong>
                    -₹{discount}
                  </strong>

                </div>

              )}


              <div className="payment-summary-divider" />


              {/* TOTAL */}

              <div className="payment-total-row">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{total}
                </strong>

              </div>

            </div>


            {/* =================================================
                SERVICE ADDRESS
            ================================================= */}

            <div className="payment-card payment-address-card">


              <div className="payment-section-heading">

                <div>

                  <h2>
                    Service Address
                  </h2>

                  <p>
                    Where should our professional visit?
                  </p>

                </div>


                {address &&
                  !showAddressForm && (

                    <button
                      className="address-edit-button"
                      onClick={handleEditAddress}
                      disabled={placingOrder}
                    >

                      <Pencil size={15} />

                      Edit

                    </button>

                  )}

              </div>


              {/* =================================================
                  SAVED ADDRESS
              ================================================= */}

              {address &&
              !showAddressForm ? (

                <div className="saved-address-card">

                  <div className="saved-address-icon">

                    <MapPin size={20} />

                  </div>


                  <div className="saved-address-content">

                    <strong>
                      {address.name}
                    </strong>

                    <span>
                      {address.house},{" "}
                      {address.area}
                    </span>

                    <span>
                      {address.city} -{" "}
                      {address.pincode}
                    </span>

                    <span>
                      Phone: {address.phone}
                    </span>

                  </div>

                </div>

              ) : (

                /* =================================================
                   ADDRESS FORM
                ================================================= */

                <form
                  className="address-form"
                  onSubmit={handleSaveAddress}
                >

                  <div className="address-form-row">


                    <div className="address-field">

                      <label>
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />

                    </div>


                    <div className="address-field">

                      <label>
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                      />

                    </div>

                  </div>


                  <div className="address-field">

                    <label>
                      House / Flat / Building
                    </label>

                    <input
                      type="text"
                      name="house"
                      value={form.house}
                      onChange={handleChange}
                      placeholder="e.g. Flat 204, ABC Apartment"
                    />

                  </div>


                  <div className="address-field">

                    <label>
                      Area / Street
                    </label>

                    <input
                      type="text"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      placeholder="e.g. Athwa Gate"
                    />

                  </div>


                  <div className="address-form-row">


                    <div className="address-field">

                      <label>
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                      />

                    </div>


                    <div className="address-field">

                      <label>
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength="6"
                      />

                    </div>

                  </div>


                  {error && (

                    <div className="address-error">
                      {error}
                    </div>

                  )}


                  <button
                    type="submit"
                    className="save-address-button"
                    disabled={placingOrder}
                  >

                    <MapPin size={17} />

                    Save Address

                  </button>

                </form>

              )}

            </div>

          </section>


          {/* =================================================
              RIGHT SIDE
              PAYMENT
          ================================================= */}

          <aside className="payment-right">


            <div className="payment-card payment-method-card">


              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="payment-title">

                <div className="payment-title-icon">

                  <CreditCard size={23} />

                </div>


                <div>

                  <h1>
                    Payment
                  </h1>

                  <p>
                    Choose your preferred payment method
                  </p>

                </div>

              </div>


              {/* =================================================
                  PAYMENT METHODS
              ================================================= */}

              <div className="payment-section payment-method-section">

                <h2>
                  Payment Method
                </h2>


                <div className="payment-methods">


                  {/* =================================================
                      ONLINE PAYMENT
                  ================================================= */}

                  <div
                    className={`payment-method ${
                      paymentMethod === "online"
                        ? "payment-method-selected"
                        : ""
                    }`}
                    onClick={() =>
                      !placingOrder &&
                      setPaymentMethod("online")
                    }
                  >

                    <div className="payment-method-icon">

                      <CreditCard size={21} />

                    </div>


                    <div className="payment-method-content">

                      <strong>
                        Online Payment
                      </strong>

                      <span>
                        UPI, Credit Card, Debit Card
                      </span>

                    </div>


                    {paymentMethod === "online" && (

                      <div className="payment-method-check">

                        <Check size={16} />

                      </div>

                    )}

                  </div>


                  {/* =================================================
                      CASH PAYMENT
                  ================================================= */}

                  <div
                    className={`payment-method ${
                      paymentMethod === "cash"
                        ? "payment-method-selected"
                        : ""
                    }`}
                    onClick={() =>
                      !placingOrder &&
                      setPaymentMethod("cash")
                    }
                  >

                    <div className="payment-method-icon">

                      <Banknote size={21} />

                    </div>


                    <div className="payment-method-content">

                      <strong>
                        Cash Payment
                      </strong>

                      <span>
                        Pay in cash after service completion
                      </span>

                    </div>


                    {paymentMethod === "cash" && (

                      <div className="payment-method-check">

                        <Check size={16} />

                      </div>

                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  SELECTED PAYMENT
              ================================================= */}

              <div className="payment-selected-box">

                <span>
                  Selected payment method
                </span>

                <strong>
                  {paymentMethod === "online"
                    ? "Online Payment"
                    : "Cash Payment"}
                </strong>

              </div>


              {/* =================================================
                  SECURITY
              ================================================= */}

              <div className="payment-security">

                <ShieldCheck size={19} />

                <span>
                  Your payment information is secure
                </span>

              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

              {error &&
                !showAddressForm && (

                  <div className="address-error payment-main-error">

                    {error}

                  </div>

                )}


              {/* =================================================
                  CONTINUE
              ================================================= */}

              <button
                className="payment-continue-button"
                onClick={handleContinue}
                disabled={placingOrder}
              >

                {placingOrder
                  ? "Placing Booking..."
                  : paymentMethod === "online"
                    ? "Continue to Payment"
                    : "Confirm Booking"}

              </button>


            </div>

          </aside>


        </div>

      </main>

    </div>
  );
}


export default Payment;