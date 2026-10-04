import { useLocation, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  Plus,
  Check,
  ShieldCheck,
  Clock3,
  Star,
  Grid2X2,
  Wrench,
  Headphones,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";

import { SERVICE_CATALOG } from "../data/serviceCatalog";

import { useCart } from "../context/CartContext";

import "../App.css";


// ======================================================
// CATEGORY HERO IMAGES
// ======================================================

const HERO_IMAGES = {
  electrician: "/service-images/electrician/hero.png",
  plumber: "/service-images/plumber/hero.png",
  ac_repair: "/service-images/ac_repair/hero.png",
  carpenter: "/service-images/carpenter/hero.png",
  appliance_repair: "/service-images/appliance_repair/hero.png",
  home_cleaning: "/service-images/home_cleaning/hero.png",
};


// ======================================================
// CATEGORY ACCENTS
// ======================================================

const CATEGORY_ACCENTS = {
  electrician: "#008f80",
  plumber: "#1685a0",
  ac_repair: "#3178b9",
  carpenter: "#9a6548",
  appliance_repair: "#7358a5",
  ro_service: "#2386a8",
  tv_repair: "#6655a0",
  washing_machine: "#3474a8",
  home_cleaning: "#a35b82",
};


// ======================================================
// CATEGORY DESCRIPTIONS
// ======================================================

const CATEGORY_DESCRIPTIONS = {
  electrician:
    "Safe, reliable and professional electrician services delivered at your doorstep.",

  plumber:
    "Reliable plumbing solutions for taps, pipes, bathrooms and kitchens.",

  ac_repair:
    "Professional AC cleaning, repair, installation and maintenance at your doorstep.",

  carpenter:
    "Trusted carpentry services for doors, furniture, beds, cupboards and more.",

  appliance_repair:
    "Reliable repair and inspection services for your everyday home appliances.",

  ro_service:
    "Professional RO and water purifier service, repair, cleaning and installation.",

  tv_repair:
    "Expert TV installation, mounting, inspection and repair services at home.",

  washing_machine:
    "Professional washing machine installation, cleaning, inspection and repair.",

  home_cleaning:
    "Professional home, kitchen, bathroom, sofa and carpet cleaning services.",
};


// ======================================================
// MAIN COMPONENT
// ======================================================

function Services() {
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart, cart } = useCart();


  // ----------------------------------------------------
  // GET CATEGORY FROM URL STATE
  // ----------------------------------------------------

  const categoryId = location.state?.category;


  // ----------------------------------------------------
  // FIND CATEGORY FROM SERVICE CATALOG
  // ----------------------------------------------------

  const categoryData = SERVICE_CATALOG.find(
    (category) => category.id === categoryId
  );


  // ----------------------------------------------------
  // CART COUNT
  // ----------------------------------------------------

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );


  // ----------------------------------------------------
  // CATEGORY DATA
  // ----------------------------------------------------

  const accent =
    CATEGORY_ACCENTS[categoryId] || "#008f80";

  const heroImage =
    HERO_IMAGES[categoryId];

  const description =
    CATEGORY_DESCRIPTIONS[categoryId] ||
    `Professional ${
      categoryData?.label?.toLowerCase() || "home"
    } services delivered at your doorstep.`;


  // ----------------------------------------------------
  // FIND SERVICE IN CART
  // ----------------------------------------------------

  const getCartItem = (serviceId) => {
    return cart.find(
      (item) => item.id === serviceId
    );
  };


  // ----------------------------------------------------
  // ADD SERVICE TO CART
  // ----------------------------------------------------
  //
  // IMPORTANT:
  // categoryId was already being stored.
  // Now we ALSO store category.
  //
  // Backend requires:
  // category: "electrician"
  // category: "plumber"
  // category: "ac_repair"
  // etc.
  //
  // ----------------------------------------------------

  const handleAdd = (service) => {
    addToCart({
      ...service,

      // Existing frontend field
      categoryId,

      // New backend-required field
      category: categoryId,

      image: `/service-images/${categoryId}/${service.id}.png`,
    });
  };


  // ----------------------------------------------------
  // CATEGORY NOT FOUND
  // ----------------------------------------------------

  if (!categoryData) {
    return (
      <div className="services-page">

        <Navbar />

        <main className="services-container">

          <div className="services-empty">

            <h2>
              Category not found
            </h2>

            <p>
              Please choose a service category
              from the home page.
            </p>

            <button
              onClick={() => navigate("/")}
            >
              Browse Categories
            </button>

          </div>

        </main>

      </div>
    );
  }


  // ----------------------------------------------------
  // TOTAL SERVICES
  // ----------------------------------------------------

  const totalServices =
    categoryData.sections.reduce(
      (total, section) =>
        total + section.services.length,
      0
    );


  // ----------------------------------------------------
  // SCROLL TO SERVICE SECTION
  // ----------------------------------------------------

  const scrollToSection = (sectionIndex) => {
    const element =
      document.getElementById(
        `service-section-${sectionIndex}`
      );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  // ----------------------------------------------------
  // SERVICE IMAGE PATH
  // ----------------------------------------------------

  const getServiceImage = (service) => {
    return `/service-images/${categoryId}/${service.id}.png`;
  };


  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="services-page">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section
        className="service-hero"
        style={{
          "--category-accent": accent,
        }}
      >

        {/* HERO CONTENT */}

        <div className="service-hero-content">


          {/* BREADCRUMB */}

          <div className="service-breadcrumb">

            <button
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <span>
              ›
            </span>

            <strong>
              {categoryData.label}
            </strong>

          </div>


          {/* SMALL LABEL */}

          <span className="service-hero-label">
            REPAIRGO SERVICES
          </span>


          {/* TITLE */}

          <h1>
            {categoryData.label} Services
          </h1>


          {/* DESCRIPTION */}

          <p>
            {description}
          </p>


          {/* TRUST FEATURES */}

          <div className="service-trust-row">


            {/* VERIFIED */}

            <div className="service-trust-item">

              <div className="service-trust-icon">
                <ShieldCheck size={20} />
              </div>

              <span>
                Verified
                <br />
                Professionals
              </span>

            </div>


            {/* ON TIME */}

            <div className="service-trust-item">

              <div className="service-trust-icon">
                <Clock3 size={20} />
              </div>

              <span>
                On-time
                <br />
                Service
              </span>

            </div>


            {/* QUALITY */}

            <div className="service-trust-item">

              <div className="service-trust-icon">
                <Star size={20} />
              </div>

              <span>
                Quality
                <br />
                Assurance
              </span>

            </div>

          </div>

        </div>


        {/* HERO IMAGE */}

        {heroImage && (
          <div className="service-hero-image-wrapper">

            <img
              src={heroImage}
              alt={`${categoryData.label} services`}
              className="service-hero-image"

              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />

          </div>
        )}

      </section>


      {/* =================================================
          CATEGORY TABS
      ================================================= */}

      <div className="service-tabs-wrapper">

        <div className="service-tabs">


          {/* ALL SERVICES */}

          <button
            className="service-tab active"

            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >

            <Grid2X2 size={17} />

            All Services

          </button>


          {/* SECTION TABS */}

          {categoryData.sections.map(
            (section, index) => (

              <button
                key={section.title}
                className="service-tab"

                onClick={() =>
                  scrollToSection(index)
                }
              >

                <Wrench size={17} />

                {section.title}

              </button>

            )
          )}

        </div>

      </div>


      {/* =================================================
          MARKETPLACE AREA
      ================================================= */}

      <main className="services-marketplace">


        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="services-sidebar">


          {/* SIDEBAR CATEGORY CARD */}

          <div className="sidebar-card">

            <h2>

              {categoryData.label}

              <br />

              Services

            </h2>


            <div className="sidebar-menu">


              {/* POPULAR */}

              <button
                className="sidebar-menu-item active"

                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >

                <Star size={19} />

                <span>
                  Popular Services
                </span>

                <ChevronRight
                  size={16}
                  className="sidebar-arrow"
                />

              </button>


              {/* CATEGORY SECTIONS */}

              {categoryData.sections.map(
                (section, index) => (

                  <button
                    key={section.title}
                    className="sidebar-menu-item"

                    onClick={() =>
                      scrollToSection(index)
                    }
                  >

                    <Wrench size={19} />

                    <span>
                      {section.title}
                    </span>

                    <ChevronRight
                      size={16}
                      className="sidebar-arrow"
                    />

                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              SUPPORT CARD
          ================================================= */}

          <div className="sidebar-support-card">

            <div className="support-icon">
              <Headphones size={20} />
            </div>

            <h3>
              Need something else?
            </h3>

            <p>
              Can't find your service?
              Contact our support team.
            </p>

            <button>

              <Headphones size={16} />

              Contact Support

            </button>

          </div>

        </aside>


        {/* =================================================
            SERVICES RESULTS
        ================================================= */}

        <section className="services-results">


          {/* RESULTS HEADER */}

          <div className="services-results-header">

            <div>

              <span className="services-small-label">
                POPULAR SERVICES
              </span>

              <h2>
                Popular {categoryData.label} Services
              </h2>

              <p>
                Most commonly booked services
                by RepairGo customers
              </p>

            </div>


            <span className="services-total-count">
              {totalServices} services
            </span>

          </div>


          {/* =================================================
              SERVICE SECTIONS
          ================================================= */}

          {categoryData.sections.map(
            (section, sectionIndex) => (

              <section
                className="service-section-new"

                id={`service-section-${sectionIndex}`}

                key={section.title}
              >


                {/* SECTION HEADER */}

                <div className="service-section-heading-new">

                  <h2>
                    {section.title}
                  </h2>

                  <span>
                    {section.services.length} services
                  </span>

                </div>


                {/* =================================================
                    SERVICE GRID
                ================================================= */}

                <div className="service-grid-new">

                  {section.services.map(
                    (service) => {

                      const cartItem =
                        getCartItem(service.id);

                      const imagePath =
                        getServiceImage(service);


                      return (

                        <div
                          className="service-card-market"

                          id={`service-${service.id}`}

                          key={service.id}
                        >


                          {/* =================================================
                              SERVICE IMAGE
                          ================================================= */}

                          <div className="service-card-image-market">

                            <img
                              src={imagePath}

                              alt={service.name}

                              className="service-card-real-image"

                              onError={(event) => {

                                /*
                                 * Prevent infinite
                                 * fallback loop.
                                 */

                                if (
                                  event.currentTarget
                                    .dataset
                                    .fallbackApplied
                                ) {
                                  return;
                                }


                                event.currentTarget
                                  .dataset
                                  .fallbackApplied =
                                  "true";


                                /*
                                 * If service image
                                 * doesn't exist,
                                 * use category hero.
                                 */

                                event.currentTarget.src =
                                  heroImage;

                              }}
                            />

                          </div>


                          {/* =================================================
                              SERVICE INFORMATION
                          ================================================= */}

                          <div className="service-card-info-market">

                            <h3>
                              {service.name}
                            </h3>

                            <p>
                              {service.description}
                            </p>

                            <div className="service-meta-market">

                              <Clock3 size={15} />

                              <span>
                                30–45 mins
                              </span>

                            </div>

                          </div>


                          {/* =================================================
                              PRICE + ADD
                          ================================================= */}

                          <div className="service-card-action-market">

                            <strong>
                              ₹{service.price}
                            </strong>


                            {cartItem ? (

                              /* =================================================
                                  ALREADY ADDED
                              ================================================= */

                              <button
                                className="service-add-market added"

                                onClick={() =>
                                  navigate("/cart")
                                }
                              >

                                <Check size={15} />

                                Added

                                <span>
                                  {cartItem.quantity}
                                </span>

                              </button>

                            ) : (

                              /* =================================================
                                  ADD TO CART
                              ================================================= */

                              <button
                                className="service-add-market"

                                onClick={() =>
                                  handleAdd(service)
                                }
                              >

                                <Plus size={16} />

                                Add

                              </button>

                            )}

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              </section>

            )
          )}

        </section>

      </main>


      {/* =================================================
          FLOATING CART
      ================================================= */}

      {cartCount > 0 && (

        <button
          className="floating-cart-new"

          onClick={() =>
            navigate("/cart")
          }
        >

          <ShoppingCart size={20} />

          <span>
            View Cart
          </span>

          <strong>
            {cartCount}
          </strong>

          <span className="floating-cart-arrow">
            →
          </span>

        </button>

      )}

    </div>
  );
}


export default Services;