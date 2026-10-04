import { useNavigate } from "react-router-dom";
import {
  Zap,
  Wrench,
  Snowflake,
  Hammer,
  Settings,
  Sparkles,
  Search,
  ShoppingCart,
  User,
  LogIn,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../App.css";

const CATEGORIES = [
  {
    id: "electrician",
    label: "Electrician",
    icon: Zap,
    color: "#FDE9C8",
  },
  {
    id: "plumber",
    label: "Plumber",
    icon: Wrench,
    color: "#D6EDEA",
  },
  {
    id: "ac_repair",
    label: "AC Repair",
    icon: Snowflake,
    color: "#DCEAFB",
  },
  {
    id: "carpenter",
    label: "Carpenter",
    icon: Hammer,
    color: "#F3E1D8",
  },
  {
    id: "appliance_repair",
    label: "Appliance Repair",
    icon: Settings,
    color: "#E9E4F5",
  },
  {
    id: "home_cleaning",
    label: "Home Cleaning",
    icon: Sparkles,
    color: "#F4E2ED",
  },
];

function Home() {
  const navigate = useNavigate();

  const { cart } = useCart();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const goToServices = (categoryId) => {
    navigate("/services", {
      state: {
        category: categoryId,
      },
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="home-screen">

      {/* NAVBAR */}
      <Navbar />


      {/* HERO SECTION */}
      <section className="home-hero">

        <div className="home-hero-content">

          <div className="home-hero-badge">
            Trusted home services
          </div>

          <h1>
            {user?.name
              ? `Hi ${user.name.split(" ")[0]}, what needs fixing today?`
              : "What needs fixing today?"}
          </h1>

          <p>
            Professional repair and maintenance services
            at your doorstep.
          </p>

          <div
            className="home-search-box"
            onClick={() => navigate("/search")}
          >
            <Search size={20} />

            <span>
              Search for a service
            </span>
          </div>

        </div>

      </section>


      {/* CATEGORIES */}
      <section className="home-section">

        <div className="home-section-heading">

          <div>
            <h2>
              Book a service
            </h2>

            <p>
              Choose what you need help with
            </p>
          </div>

        </div>


        <div className="home-category-grid">

          {CATEGORIES.map((category) => {

            const Icon = category.icon;

            return (
              <button
                key={category.id}
                className="home-category-card"
                onClick={() =>
                  goToServices(category.id)
                }
              >

                <div
                  className="home-category-icon-wrap"
                  style={{
                    background: category.color,
                  }}
                >
                  <Icon
                    size={32}
                    strokeWidth={1.8}
                  />
                </div>

                <span>
                  {category.label}
                </span>

              </button>
            );
          })}

        </div>

      </section>


      {/* FIRST BOOKING OFFER */}
      <section className="home-banner">

        <div>

          <div className="home-banner-badge">
            NEW
          </div>

          <h2>
            Get ₹100 OFF on your first booking
          </h2>

          <p>
            Book any eligible service and enjoy
            your first-booking discount.
          </p>

        </div>

        <button
          onClick={() =>
            goToServices("electrician")
          }
        >
          Explore Services
        </button>

      </section>


      {/* POPULAR SERVICES */}
      <section className="home-section">

        <div className="home-section-heading">

          <div>
            <h2>
              Popular services
            </h2>

            <p>
              Services customers commonly book
            </p>
          </div>

        </div>


        <div className="popular-service-grid">

          <button
            onClick={() =>
              goToServices("electrician")
            }
          >
            <span>⚡</span>

            <strong>
              Electrical Repair
            </strong>

            <small>
              Fan, switch & wiring
            </small>
          </button>


          <button
            onClick={() =>
              goToServices("ac_repair")
            }
          >
            <span>❄️</span>

            <strong>
              AC Service
            </strong>

            <small>
              Cleaning & repair
            </small>
          </button>


          <button
            onClick={() =>
              goToServices("plumber")
            }
          >
            <span>🔧</span>

            <strong>
              Plumbing
            </strong>

            <small>
              Tap, pipe & leakage
            </small>
          </button>


          <button
            onClick={() =>
              goToServices("home_cleaning")
            }
          >
            <span>✨</span>

            <strong>
              Home Cleaning
            </strong>

            <small>
              Deep cleaning services
            </small>
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="repairgo-footer">

        <div className="footer-main">

          {/* BRAND */}
          <div className="footer-brand">

            <div className="footer-logo">

              <div className="footer-logo-badge">
                RG
              </div>

              <span>
                RepairGo
              </span>

            </div>

            <p>
              Reliable repair and maintenance
              services at your doorstep.
            </p>

          </div>


          {/* COMPANY */}
          <div className="footer-column">

            <h3>
              Company
            </h3>

            <button>
              About us
            </button>

            <button>
              Contact us
            </button>

            <button>
              Terms & conditions
            </button>

            <button>
              Privacy policy
            </button>

            <button>
              Careers
            </button>

          </div>


          {/* FOR CUSTOMERS */}
          <div className="footer-column">

            <h3>
              For customers
            </h3>

            <button
              onClick={() =>
                navigate("/bookings")
              }
            >
              My bookings
            </button>

            <button
              onClick={() =>
                navigate("/")
              }
            >
              Categories
            </button>

            <button>
              Help & support
            </button>

            <button>
              Contact us
            </button>

          </div>


          {/* FOR PROFESSIONALS */}
          <div className="footer-column">

            <h3>
              For professionals
            </h3>

            <button
              onClick={() =>
                navigate("/technician-auth")
              }
            >
              Register as a professional
            </button>

            <button
              onClick={() =>
                navigate("/technician-auth")
              }
            >
              Professional login
            </button>

            <button>
              Become a partner
            </button>

          </div>


          {/* SOCIAL LINKS */}
          <div className="footer-column">

            <h3>
              Social links
            </h3>

            <div className="social-icons">

              <button title="X">
                𝕏
              </button>

              <button title="Facebook">
                f
              </button>

              <button title="Instagram">
                ◎
              </button>

              <button title="LinkedIn">
                in
              </button>

            </div>


            <div className="footer-account-links">

              {!user ? (
                <>
                  <button
                    onClick={() =>
                      navigate("/login")
                    }
                  >
                    Login
                  </button>

                  <button
                    onClick={() =>
                      navigate("/signup")
                    }
                  >
                    Create account
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      navigate("/bookings")
                    }
                  >
                    My profile
                  </button>

                  <button
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  navigate("/cart")
                }
              >
                Cart
                {cartCount > 0 &&
                  ` (${cartCount})`}
              </button>

            </div>

          </div>

        </div>


        {/* FOOTER BOTTOM */}
        <div className="footer-bottom">

          <span>
            © 2026 RepairGo. All rights reserved.
          </span>

          <span>
            Trusted home services
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;