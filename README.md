<div align="center">

CipherStudio - Full-Stack React IDE

A browser-based React IDE with full user authentication, file management, and a live preview compiler.

<!-- GitHub Badges -->

<p>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/React-61DAFB%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3Dblack" alt="React" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Node.js-339933%3Fstyle%3Dfor-the-badge%26logo%3Dnode.js%26logoColor%3Dwhite" alt="Node.js" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/MongoDB-47A248%3Fstyle%3Dfor-the-badge%26logo%3Dmongodb%26logoColor%3Dwhite" alt="MongoDB" />
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Render-46E3B7%3Fstyle%3Dfor-the-badge%26logo%3Drender%26logoColor%3Dblack" alt="Render" />
</p>

</div>

🚀 Live Demo

Frontend (Vercel): (https://cipherstudiofullstack.vercel.app/)

Backend (Render): https://cipherstudio-full-stack.onrender.com/
📸 Application Showcase

Here is the main dashboard where users can manage their projects, and the IDE itself.

Dashboard

Main IDE (Light Mode)

[Drag-and-drop a screenshot of your DashboardPage here]

[Drag-and-drop a screenshot of your IDEPage here]

Users can see all projects or create new ones.

A 3-pane layout with file explorer, code editor, and live preview.

(You can take screenshots and drag them directly into this file on GitHub to upload them)

📋 About The Project

This project is a full-stack, browser-based React IDE created for the CipherSchools Full Stack Assignment. It simulates a real-world development environment where users can register, log in, create projects, write React code, and see a live preview.

All projects, files, and file content are saved to a central MongoDB database, allowing users to log in and continue their work from any device.

✨ Features Checklist

This project successfully implements all core requirements and several bonus features:

Core Requirements

[x] Full-Stack User Authentication: Secure user registration and login with JWT (JSON Web Tokens).

[x] Project Dashboard: Users can create new projects and see a list of their existing ones.

[x] Code Editor: A rich code editor provided by Sandpack.

[x] Live Preview: A real-time preview of the React app that updates as the user types.

[x] Database Persistence: All projects, files, and file content are saved in MongoDB, not localStorage.

Bonus Features

[x] File Management:

[x] Create Files: Users can create new files.

[x] Create Folders: Users can create new folders.

[x] Delete Files/Folders: Users can delete any file or folder (recursively for folders).

[x] Rename Files/Folders: Users can rename any file or folder.

[x] Theme Switcher (Dark/Light): A toggle in the IDE header to switch between light and dark themes.

🛠️ Tech Stack

This project is a monorepo containing two separate applications:

Frontend (Root /)

Framework: React (Vite)

Routing: react-router-dom

API Client: axios

IDE Core: @codesandbox/sandpack-react

Styling: Vanilla CSS

Deployment: Vercel

Backend (/backend)

Runtime: Node.js

Framework: Express.js

Database: MongoDB (with Mongoose)

Authentication: jsonwebtoken (JWT) & bcryptjs for password hashing

CORS: cors package

Deployment: Render

⚙️ How to Run Locally

This project has two parts that must be run simultaneously.

Prerequisites

Node.js (v18 or newer)

A MongoDB Atlas account (or a local MongoDB instance)

1. Backend Setup

Navigate into the backend directory:

cd backend


Install backend dependencies:

npm install


Create a .env file in the /backend folder and add your secret keys:

MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_jwt_key_that_is_long"


Start the backend server:

node index.js


The server will be running on http://localhost:5000.

2. Frontend Setup

Open a new terminal and stay in the root (/) directory.

Install frontend dependencies:

npm install


Start the frontend development server:

npm run dev


The app will be running on http://localhost:5173.

Open http://localhost:5173 in your browser to use the application.
