# The Archives

## Project Overview

https://github.com/user-attachments/assets/7e75f475-4c25-4182-9726-a85987f7a0e5

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


## Quickstart & Local Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd archives_front
```

### 2. Prepare Data & Model Artifacts

**You must generate the ML model artifacts before running the Python backend!**

1. Ensure you have the raw data files in `backend/model-backend/data/raw/` (books.csv, ratings.csv).
2. Open and run all cells in the notebook:
   - `backend/model-backend/notebooks/hybrid_model.ipynb`
   - This will generate the required model files (e.g., `artifacts.pkl`, `artifacts.pkl.gz`) in `backend/model-backend/data/processed/`.

If you skip this step, the model backend will not work.

### 3. Install dependencies

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
  pip install --upgrade pip
  pip install -r requirements.txt
  ```

### 4. Environment Configuration

- **Firestore:**
  - Set up a Firebase project and Firestore database.
  - Add your Firebase config to `the_archives/src/firebase/firebase.ts`.
- **Postgres:**
  - Set up a Postgres database and update connection details in `backend/express-backend/.env` (see sample below).
- **.env file for Express Backend:**
  - Create `backend/express-backend/.env` with:
    ```
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_PORT=5432
    DB_DATABASE=your_db_name
    FRONTEND_URL=http://localhost:5173
    ```

### 5. Running the App Locally

**Start all three services in separate terminals:**

- **Express backend:**
  ```
  cd backend/express-backend
  npm run dev
  # Runs on http://localhost:3000
  ```
- **Python model backend:**
  ```
  cd backend/model-backend
  source .venv/bin/activate
  uvicorn app:app --reload --port 8000
  # Runs on http://localhost:8000
  ```
- **React frontend:**
  ```
  cd the_archives
  npm run dev
  # Runs on http://localhost:5173
  ```

---

## Model Preparation Details

The recommendation model requires precomputed artifacts. To generate them:

1. Open `backend/model-backend/notebooks/hybrid_model.ipynb` in Jupyter or VS Code.
2. Run all cells. This will process the data and save the model artifacts to `backend/model-backend/data/processed/`.
3. These files are required for the FastAPI backend to start and serve recommendations.

If you ever change the data or want to retrain, rerun the notebook.

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
