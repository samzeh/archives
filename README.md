# The Archives

## Project Overview
Welcome to The Archives.

Explore book recommendations from 10k+ of GoodReads most popular books (full list: https://github.com/zygmuntz/goodbooks-10k.git).

It includes a full-stack web application for book discovery, tracking, and recommendations. Users can search for books, add them to their profile, rate and comment on books, and view book recommendations.

The app uses a React frontend, Express/Node.js and FastAPI backends, Firestore for user data, and Postgres for book data.

---

## Features
- User authentication (signup, login, password reset)
- Search for books by title
- Add books to your profile ("to read" or "finished")
- Rate and comment on books
- View your personal library in a carousel
- Book details modal with genres, ratings, and comments
- Batch fetch of book details for efficient profile display
- Responsive, modern UI

---

## Project Structure
```
archives_front/
├── backend/
│   ├── express-backend/      # Node.js/Express API for book data retrieval (Postgres)
│   │   ├── db.js
│   │   ├── server.js
│   └── model-backend/        # FastAPI Python backend for recommendations
│       ├── app.py
│       ├── requirements.txt
│       └── data/
├── the_archives/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── firebase/         # Firestore functions
│   │   ├── pages/            # Main pages (Profile, Home, etc.)
│   │   ├── styles/           # CSS
│   │   └── utils/            # Utility functions
│   ├── public/
│   └── package.json
```

---

## Setup Instructions

### 1. Clone the repository
```
git clone <your-repo-url>
cd archives_front
```

### 2. Install dependencies
- **Frontend:**
  ```
  cd the_archives
  npm install
  ```
- **Express Backend:**
  ```
  cd ../backend/express-backend
  npm install
  ```
- **Python Model Backend:**
  ```
  cd ../model-backend
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  ```

### 3. Environment Configuration
- **Firestore:**
  - Set up a Firebase project and Firestore database.
  - Add your Firebase config to `the_archives/src/firebase/firebase.ts`.
- **Postgres:**
  - Set up a Postgres database and update connection details in `backend/express-backend/db.js`.
- **(Optional) .env files:**
  - Add any required environment variables for API keys, DB connections, etc.

### 4. Running the App
- **Start Express backend:**
  ```
  cd backend/express-backend
  npm start
  # Runs on http://localhost:3000
  ```
- **Start Python model backend:**
  ```
  cd backend/model-backend
  source .venv/bin/activate
  uvicorn app:app --reload --port 8000
  # Runs on http://localhost:8000
  ```
- **Start React frontend:**
  ```
  cd the_archives
  npm run dev
  # Runs on http://localhost:5173
  ```

---

## How It Works
- **Frontend (React):**
  - Handles UI, authentication, and user interactions.
  - Fetches user profile books from Firestore and book details from the Express backend.
  - Uses React Query for efficient data fetching and caching.
- **Express Backend:**
  - Provides REST API for book search and batch book detail fetching from Postgres.
  - Handles CORS for frontend communication.
- **Model Backend (FastAPI):**
  - Handles book recommendation model
- **Firestore:**
  - Stores user profile books, ratings, and comments.
- **Postgres:**
  - Stores main book data (title, author, genres, etc.).

---

## License
MIT
