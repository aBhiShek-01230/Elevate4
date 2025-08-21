ELEVATE – Smart Education Platform

ELEVATE is a comprehensive e-learning platform designed to enhance online learning experiences for students and teachers. It includes AI-driven assistance, interactive virtual labs, real-time communication, and an online code compiler.

Features

Separate Teacher & Student Modules

Teachers can create courses and batches.

Students can enroll in courses and track their progress.

Real-Time Messaging

Facilitates seamless communication between students and teachers using Socket.IO.

Interactive Virtual Labs

Labs for Chemistry, Physics, and Electronics implemented with Kaboom.js.

AI Assistance

Personalized learning paths and guidance powered by Gemini API.

Online Code Compiler

Students can practice coding in real-time using Piston API.


Tech Stack

Frontend: React.js, Tailwind CSS, HTML5, CSS3

Backend: Node.js, Express.js

Database: MongoDB

Real-Time Communication: Socket.IO

AI Integration: Gemini API

Compiler API: Piston API

Interactive Labs: Kaboom.js



Installation & Setup

Clone the repository:

git clone https://github.com/username/elevate.git
cd elevate


Install backend dependencies:

cd server
npm install


Install frontend dependencies:

cd ../client
npm install


Create a .env file in the backend folder and add:

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GEMINI_API_KEY=<your_gemini_api_key>


Start the backend server:

cd ../server
npm run dev


Start the frontend server:

cd ../client
npm start


Open your browser at http://localhost:3000

Live Demo & GitHub

Live Demo: [Link to deployed site]

GitHub Repository: https://github.com/username/elevate

Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

License

MIT License © 2025 Abhishek Kumar Anand
