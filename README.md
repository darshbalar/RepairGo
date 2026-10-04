# RepairGo 🔧

RepairGo is a MERN-based home repair and service booking platform that connects customers with technicians for different household repair and maintenance services.

## 🚀 Features

### 👤 Customer Features
- Browse home repair services without login
- Explore services by category
- Add multiple services to cart
- View cart and manage quantities
- First-booking discount
- Service address management
- Online and cash payment options
- Secure customer authentication
- Place repair/service bookings
- View booking history

### 🧑‍🔧 Technician Features
- Technician registration
- Mobile number + OTP authentication
- Technician profile and service category
- Experience and skills management
- Service area configuration
- Technician availability toggle
- Receive nearby/matching service requests
- Accept or decline booking requests
- View active bookings
- View completed booking history

### 🔐 Authentication & Security
- JWT-based authentication
- Customer email/password login
- Technician mobile + OTP login
- Protected API routes
- Role-based access control
- Environment variables for sensitive configuration

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Vite
- Axios
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- REST API

## 📂 Project Structure

```text
RepairGo/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── .gitignore
├── package.json
└── README.md
```