# 🛍️ E-Commerce Website

A full-stack, responsive e-commerce platform built using the **MERN** stack (MongoDB, Express.js, React, Node.js) with user authentication, admin dashboard, product management, cart, and Esewa-integrated checkout.

## 🚀 Live Demo

🔗 [View Website](https://stylemeofficial.com/)  
📸 [Admin Dashboard Screenshots](https://github.com/Nabin0224/styleme-dashboard-images.git)

---

## 📌 Features

- 🔐 **Authentication**: JWT-based login system with Google Sign-In integration.
- 👗 **Product Management**: Admin can add, edit, and delete products with images, sizes, quantities, and colors.
- 🛒 **Cart and Checkout**: Smooth cart experience with **Esewa payment gateway** integration.
- 🧾 **Order Management**: Orders saved to database with tracking and QR code generation for admin.
- 📦 **User Dashboard**: Users can view order history, update profile, and track orders.
- 🎨 **Responsive UI**: Built with TailwindCSS for mobile-first design.
- ⚙️ **Reusable Components**: Forms and UI built with React Hook Form and component-driven structure.
- 🌐 **Deployment**: Hosted on Hostinger VPS with domain, SSL, and environment setup.

---

## 🛠️ Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS  
- Redux Toolkit  
- React Hook Form  
- Google Auth  

**Backend**  
- Node.js  
- Express.js  
- MongoDB  
- JWT (JSON Web Tokens)

**Deployment**  
- Hostinger VPS  
- MongoDB Atlas / Local  
- PM2 & Nginx

---

## 📁 Project Structure

```bash
client/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── App.jsx

server/
├── controllers/
├── models/
├── routes/
├── middleware/
└── server.js
