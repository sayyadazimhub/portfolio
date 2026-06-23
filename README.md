# Portfolio Website

A modern, responsive, and interactive portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js). This project showcases my skills, projects, experience, and education with a premium design featuring smooth animations and a cohesive color scheme.

## 🚀 Features

- **Modern UI/UX**: Built with React and Tailwind CSS for a sleek, responsive design.
- **Smooth Animations**: Powered by Framer Motion for engaging user interactions.
- **Dynamic Content**: Projects, skills, experience, and education data fetched from a backend API.
- **Contact Form**: Functional contact form integrated with the backend.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Dark Mode Aesthetic**: Premium dark theme with gradient accents.

## 🛠️ Tech Stack

### Client
- **React**: Frontend library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Library for production-ready animations.
- **React Router**: Declarative routing for React applications.
- **Axios**: Promise-based HTTP client for the browser.
- **React Icons**: Popular icons included as React components.

### Server
- **Node.js**: JavaScript runtime built on Chrome's V8 engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing portfolio data.
- **Mongoose**: Elegant mongodb object modeling for node.js.
- **Dotenv**: Module to load environment variables.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing.

## 📂 Project Structure

```
Portfolio/
├── Client/          # Frontend React application
│   ├── public/      # Static assets
│   ├── src/         # Source code
│   │   ├── assets/  # Images and other assets
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/   # Page components
│   │   ├── utils/   # Utility functions (API setup)
│   │   ├── App.jsx  # Main application component
│   │   └── main.jsx # Entry point
│   └── ...
└── Server/          # Backend Node.js application
    ├── src/         # Source code
    │   ├── controllers/ # Request handlers
    │   ├── models/  # Mongoose models
    │   ├── routes/  # API routes
    │   └── server.js # Server entry point
    └── ...
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Portfolio
    ```

2.  **Setup Server:**

    Navigate to the server directory and install dependencies:

    ```bash
    cd Server
    npm install
    ```

    Create a `.env` file in the `Server` directory with your MongoDB connection string and port:

    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/portfolio
    ```

3.  **Setup Client:**

    Navigate to the client directory and install dependencies:

    ```bash
    cd ../Client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**

    In the `Server` directory:

    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**

    In the `Client` directory:

    ```bash
    npm run dev
    ```
    The client will start on `http://localhost:5173` (or the port shown in the terminal).

## 📄 License

This project is licensed under the ISC License.
