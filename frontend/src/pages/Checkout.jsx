import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  LogIn,
  Tag,
  ChevronRight,
  Pencil,
  Minus,
  Plus,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import "../App.css";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
    discount,
    total,
  } = useCart();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

    const handleLogin = () => {
    navigate("/login", {
        state: {
        from: "/payment",
        },
    });
    };

  const getServiceImage = (item) => {
    if (item.image) {
      return item.image;
    }

    if (item.categoryId) {
      return `/service-images/${item.categoryId}/${item.id}.png`;
    }

    return null;
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <div
            className="checkout-brand"
            onClick={() => navigate("/")}
          >
            <div className="checkout-brand-badge">RG</div>
            <span>RepairGo</span>
          </div>
        </header>

        <main className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add a service before proceeding to checkout.</p>

          <button
            className="checkout-empty-button"
            onClick={() => navigate("/")}
          >
            Browse Services
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* =====================================================
          CHECKOUT HEADER
          Only RepairGo logo
      ===================================================== */}
      <header className="checkout-header">
        <div
          className="checkout-brand"
          onClick={() => navigate("/")}
        >
          <div className="checkout-brand-badge">RG</div>
          <span>RepairGo</span>
        </div>
      </header>


      {/* =====================================================
          MAIN CHECKOUT
      ===================================================== */}
      <main className="checkout-main">

        {/* LEFT COLUMN */}
        <section className="checkout-left-column">

          <button
            className="checkout-back"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft size={17} />
            Back to Cart
          </button>

          <div className="checkout-heading">
            <h1>Checkout</h1>
            <p>
              Review your services before continuing
            </p>
          </div>


          {/* ACCOUNT */}
          {!token && (
                <div className="checkout-account-card">

                    <div className="checkout-account-info">

                    <div className="checkout-account-icon">
                        <UserRound size={22} />
                    </div>

                    <div>
                        <h2>Account</h2>
                        <p>
                        To book the service, please login or sign up.
                        </p>
                    </div>

                    </div>

                    <button
                    className="checkout-login-button"
                    onClick={handleLogin}
                    >
                    <LogIn size={18} />
                    <span>Login / Sign Up</span>
                    <ArrowRight size={18} />
                    </button>

                </div>
                )}


          {/* SMALL INFORMATION */}
          <div className="checkout-security-note">
            <div className="checkout-security-icon">
              ✓
            </div>

            <div>
              <strong>Secure booking</strong>
              <span>
                Your account is required before placing the booking.
              </span>
            </div>
          </div>

        </section>


        {/* RIGHT COLUMN */}
        <aside className="checkout-right-column">


          {/* =================================================
              SELECTED SERVICES
          ================================================= */}
          <div className="checkout-card checkout-services-card">

            <div className="checkout-card-header">
              <div>
                <h2>
                  Selected Services ({itemCount})
                </h2>

                <span>
                  {itemCount} service
                  {itemCount !== 1 ? "s" : ""} selected
                </span>
              </div>

              <button
                className="checkout-edit-button"
                onClick={() => navigate("/cart")}
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>


            <div className="checkout-service-list">

              {cart.map((item) => {
                const imagePath = getServiceImage(item);

                return (
                  <div
                    className="checkout-service-row"
                    key={item.id}
                  >

                    <div className="checkout-service-image">
                      {imagePath ? (
                        <img
                          src={imagePath}
                          alt={item.name}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <span>🔧</span>
                      )}
                    </div>


                    <div className="checkout-service-info">

                      <h3>{item.name}</h3>

                      <p>
                        {item.description ||
                          "Professional doorstep service"}
                      </p>

                    </div>


                    <div className="checkout-quantity">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        <Minus size={13} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        <Plus size={13} />
                      </button>

                    </div>


                    <div className="checkout-service-price">
                      ₹{item.price * item.quantity}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>


          {/* =================================================
              COUPON
          ================================================= */}
          <div className="checkout-card checkout-coupon-card">

            <div className="checkout-coupon-icon">
              <Tag size={19} />
            </div>

            <div className="checkout-coupon-text">
              <strong>Coupons & Offers</strong>

              <span>
                {discount > 0
                  ? `FIRST100 applied · You save ₹${discount}`
                  : "Login / Sign Up to view offers"}
              </span>
            </div>

            <ChevronRight size={19} />

          </div>


          {/* =================================================
              BILL SUMMARY
          ================================================= */}
          <div className="checkout-card checkout-bill-card">

            <h2>Bill Summary</h2>


            {/* SERVICE TOTALS */}
            <div className="checkout-bill-services">

              {cart.map((item) => (
                <div
                  className="checkout-bill-row"
                  key={item.id}
                >
                  <span>{item.name}</span>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}

            </div>


            <div className="checkout-divider" />


            <div className="checkout-bill-row">
              <span>Item total</span>
              <strong>₹{subtotal}</strong>
            </div>


            {discount > 0 && (
              <div className="checkout-bill-row checkout-discount-row">
                <span>
                  <Tag size={14} />
                  FIRST100
                </span>

                <strong>
                  -₹{discount}
                </strong>
              </div>
            )}


            <div className="checkout-divider" />


            <div className="checkout-total-row">

              <span>Total amount</span>

              <strong>
                ₹{total}
              </strong>

            </div>


            <button
            className="checkout-continue-button"
            onClick={
                token
                ? () => navigate("/payment")
                : handleLogin
            }
            >
            <span>
                {token
                ? "Continue to Payment"
                : "Login to Continue"}
            </span>

            <ArrowRight size={18} />
            </button>


            {!token && (
              <p className="checkout-login-note">
                Login or sign up is required before placing your
                booking.
              </p>
            )}

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Checkout;