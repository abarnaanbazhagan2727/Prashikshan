# Prashikshan

Prashikshan is an AI-powered learning platform designed to help students learn, practice, assess their skills, and discover career opportunities through personalized learning experiences.

## Project Structure

```
prashikshan-project/
├── backend/          Node.js + Express + MongoDB API
│   ├── config/db.js
│   ├── controllers/  (auth, assessment, dashboard, project logic)
│   ├── middleware/   (auth guard, error handler)
│   ├── models/       (User, Assessment, Project — Mongoose schemas)
│   ├── routes/       (auth, assessments, dashboard, projects)
│   ├── server.js     entry point
│   ├── package.json
│   └── .env.example  environment variables template
└── frontend/
    └── index.html    Single-file UI prototype (PRASHIKSHAN)
```

## Getting Started

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT Secret
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API will start on the port set in `.env` (`PORT=5000` by default).

### Frontend Setup

The frontend (`frontend/index.html`) is a responsive web application prototype. You can:
- Open `frontend/index.html` directly in your browser, or
- Serve it using any static file server:
  ```bash
  npx serve frontend
  ```

## Configuration & Environment Variables

Make sure to configure the `.env` file in `backend/`:
- `PORT`: Port on which the API runs (default: 5000)
- `MONGO_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for signing JWT tokens
- `FRONTEND_URL`: URL of the frontend application for CORS
