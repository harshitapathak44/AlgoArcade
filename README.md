# AlgoArcade

A gamified platform for mastering Data Structures & Algorithms through interactive puzzles, visualizations, and competitive challenges.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

## Overview

Learning Data Structures and Algorithms can quickly become repetitive and hard to stay motivated with. AlgoArcade reframes DSA practice as a game-like experience — users solve interactive puzzles, earn XP, unlock levels, build daily streaks, collect badges, and compete on a global leaderboard.

Built as a hackathon project, AlgoArcade combines full-stack web development with an applied, engaging approach to DSA education.

## Features

- **JWT Authentication** — secure login and registration with bcrypt password hashing
- **6 DSA Topic Categories** covering arrays, stacks, trees, graphs, and more
- **25+ Puzzle Challenges** across multiple difficulty levels
- **XP & Level System** — 500 XP per level, with 9 progressive ranks from Novice Coder to Code Overlord
- **Badges & Achievements** earned as users progress
- **Global Leaderboard** showing the top 20 ranked users
- **Progress Tracking** per topic and puzzle
- **Daily Streaks** to encourage consistent practice
- **Sorting Algorithm Visualizer** — animated Bubble, Selection, Insertion, Merge, and Quick Sort with adjustable speed
- **Responsive Dark UI** with a gaming-inspired theme

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, JWT, bcrypt |
| Database | MongoDB, Mongoose |
| Tooling | Git, GitHub, VS Code |

## Project Structure

```
algoarcade/
├── backend/
│   ├── models/          # User, Topic, Puzzle schemas
│   ├── routes/          # auth, topics, puzzles, users, leaderboard
│   ├── middleware/       # JWT auth middleware
│   ├── server.js         # Express app entry point
│   └── seed.js           # Database seeder
└── frontend/
    └── src/
        ├── context/       # Global auth state
        ├── pages/         # Home, Auth, Dashboard, Topics, Puzzle, Leaderboard, Profile, Visualizer
        └── components/    # Navbar, LoadingScreen
```

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- npm v8+

### Installation

```bash
git clone https://github.com/harshitapathak44/AlgoArcade.git
cd AlgoArcade
```

**Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/algoarcade
JWT_SECRET=your_super_secret_key_change_this_please
NODE_ENV=development
```

```bash
node seed.js
npm run dev        # runs on http://localhost:5000
```

**Frontend:**
```bash
cd ../frontend
npm install
npm start           # runs on http://localhost:3000
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user 🔒 |
| GET | `/api/topics` | Get all DSA topics |
| GET | `/api/topics/:id` | Get a topic and its puzzles |
| GET | `/api/puzzles/:id` | Get a single puzzle 🔒 |
| POST | `/api/puzzles/:id/submit` | Submit an answer 🔒 |
| GET | `/api/users/progress` | Get progress stats 🔒 |
| GET | `/api/leaderboard` | Get global top-20 rankings |

🔒 Requires an `Authorization: Bearer <token>` header.

## Rank Progression

| Level | Rank |
|---:|---|
| 1 | Novice Coder |
| 5 | Bit Flipper |
| 10 | Stack Overflow |
| 15 | Queue Master |
| 20 | Tree Climber |
| 25 | Graph Walker |
| 30 | Algorithm Wizard |
| 40 | Data Structure Sage |
| 50 | Code Overlord |

## Team — Syntax Squad

- Aaradhya Singh
- Akriti Gupta
- Anushka Pandey
- Harshita Pathak

## License

Licensed under the [MIT License](LICENSE).
