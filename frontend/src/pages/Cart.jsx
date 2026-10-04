import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  Clock3,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

import "../App.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
    discount,
    total,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />

        <main className="empty-cart-new">
          <div className="empty-cart-icon-new">
            <span>🛒</span>
          </div>

          <h1>Your cart is empty</h1>

          <p>
            Looks like you haven't added any services yet.
            <br />
            Explore our services and book what you need.
          </p>

          <button
            className="empty-cart-button"
            onClick={() => navigate("/")}
          >
            Browse Services
          </button>
        </main>
      </div>
    );
  }

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <Navbar />

      <main className="cart-main-new">

        {/* TOP */}
        <div className="cart-top-new">
          <button
            className="cart-back-new"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Continue browsing
          </button>

          <div>
            <h1>Your Cart</h1>
            <p>
              {itemCount} service
              {itemCount !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        <div className="cart-layout-new">

          {/* LEFT */}
          <section className="cart-left-new">

            <div className="cart-section-card">

              <div className="cart-section-header">
                <div>
                  <h2>Selected Services</h2>
                  <p>
                    Review your services before checkout
                  </p>
                </div>

                <span className="cart-item-count">
                  {itemCount} item
                  {itemCount !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="cart-service-list">

                {cart.map((item) => {

                  const imagePath = item.image
                    ? item.image
                    : item.categoryId
                    ? `/service-images/${item.categoryId}/${item.id}.png`
                    : null;

                  return (
                    <div
                      className="cart-service-item"
                      key={item.id}
                    >

                      {/* IMAGE */}
                      <div className="cart-service-image">
                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt={item.name}
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                              event.currentTarget.parentElement.classList.add(
                                "image-fallback"
                              );
                            }}
                          />
                        ) : (
                          <span>🔧</span>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="cart-service-details">

                        <h3>{item.name}</h3>

                        {item.description && (
                          <p>{item.description}</p>
                        )}

                        <span className="cart-service-price">
                          ₹{item.price} per service
                        </span>

                        <div className="cart-quantity">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="cart-service-right">

                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>

                        <button
                          className="cart-remove-button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          title="Remove service"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            {/* COUPON */}
            <div className="cart-coupon-card">

              <div className="coupon-icon">
                <Tag size={21} />
              </div>

              <div className="coupon-content">
                <div className="coupon-title-row">
                  <h3>FIRST100</h3>

                  <span className="coupon-applied">
                    ✓ Applied
                  </span>
                </div>

                <p>
                  ₹100 off on your first booking
                </p>
              </div>

              <strong className="coupon-saving">
                -₹100
              </strong>

            </div>

            {/* TRUST */}
            <div className="cart-trust-row">

              <div className="cart-trust-item">
                <ShieldCheck size={19} />
                <div>
                  <strong>Verified Professionals</strong>
                  <span>Trusted service partners</span>
                </div>
              </div>

              <div className="cart-trust-item">
                <Clock3 size={19} />
                <div>
                  <strong>Doorstep Service</strong>
                  <span>Convenient service at home</span>
                </div>
              </div>

            </div>

          </section>

          {/* RIGHT */}
          <aside className="cart-summary-new">

            <div className="summary-card-new">

              <h2>Bill Summary</h2>

              <div className="summary-row-new">
                <span>Item total</span>
                <strong>₹{subtotal}</strong>
              </div>

              <div className="summary-row-new discount-row-new">
                <span>
                  <Tag size={15} />
                  FIRST100
                </span>

                <strong>-₹{discount}</strong>
              </div>

              <div className="summary-divider-new" />

              <div className="summary-total-new">
                <div>
                  <span>Total Amount</span>
                  <small>Inclusive of applicable charges</small>
                </div>

                <strong>₹{total}</strong>
              </div>

              <div className="first-booking-box">
                <div className="first-booking-icon">
                  🎉
                </div>

                <div>
                  <strong>First booking offer applied</strong>
                  <p>
                    You saved ₹{discount} on this booking.
                  </p>
                </div>
              </div>

              <button
                className="proceed-checkout-new"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ChevronRight size={19} />
              </button>

              <p className="checkout-note">
                Login or signup will be required before
                placing your booking.
              </p>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}

export default Cart;