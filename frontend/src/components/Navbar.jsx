import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <div className="navbar">

      {/* LOGO */}
      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        <div className="navbar-logo-badge">
          RG
        </div>

        <span className="navbar-logo-text">
          RepairGo
        </span>
      </div>


      {/* LOCATION */}
      <div className="navbar-location">

        <MapPin
          size={16}
          color="#888"
        />

        <span className="navbar-location-text">
          Athwa Gate, Surat
        </span>

        <ChevronDown
          size={14}
          color="#888"
        />

      </div>


      {/* SEARCH */}
      <div
        className="navbar-search"
        onClick={() => navigate("/search")}
      >

        <Search
          size={17}
          color="#888"
        />

        <input
          type="text"
          placeholder="Search for a service..."
          readOnly
        />

      </div>


      {/* RIGHT SIDE */}
      <div className="navbar-icons">

        {/* CART */}
        <div
          className="navbar-icon-circle cart-navbar-icon"
          onClick={() => navigate("/cart")}
          title="Cart"
        >

          <ShoppingCart
            size={19}
            color="#1c1c1c"
          />

          {cartCount > 0 && (
            <span className="cart-count-badge">
              {cartCount}
            </span>
          )}

        </div>


        {/* USER */}
        <div
          className="navbar-icon-circle"
          onClick={() =>
            user
              ? navigate("/bookings")
              : navigate("/login")
          }
          title={
            user
              ? "My Account"
              : "Login"
          }
        >

          <User
            size={19}
            color="#1c1c1c"
          />

        </div>

      </div>

    </div>
  );
}

export default Navbar;