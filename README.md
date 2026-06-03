 # AcademiaEWS

  AcademiaEWS is an Academic Early Warning System web application that predicts whether a student is academically **At
  Risk** or likely to **Succeed**. The system uses student profile, academic load, performance, and Virtual Learning
  Environment activity data as input, then sends the data to a Flask machine learning backend for prediction.

  ## Project Overview

  The project consists of two main parts:

  - **Frontend:** React + Vite dashboard for user login, prediction input, result visualization, prediction history, and
  local data management.
  - **Backend:** Flask API that loads a trained Random Forest model and scaler, performs feature engineering, and
  returns prediction results.

  ## Main Features

  - Student risk prediction using a trained Random Forest classifier
  - Input form for student background, academic load, VLE activity, and performance metrics
  - Automatic feature engineering before prediction
  - Risk result shown as `AT RISK` or `SUCCESS`
  - Risk percentage visualization
  - Top contributing variables displayed in a bar chart
  - Prediction history saved in browser localStorage
  - Search and filter prediction history
  - Delete single records or clear all saved prediction history
  - Simple localStorage-based register/login flow

  ## Machine Learning Backend

  The backend is built with Flask and exposes:

  - `GET /`
    Health check endpoint.

  - `POST /predict`
    Accepts student academic data and returns prediction output.

  The backend loads:

  - `random_forest_model_v1.pkl`
  - `scaler_v1.pkl`

  The trained model is a `RandomForestClassifier` with:

  - 100 estimators
  - Gini criterion
  - Max depth of 20
  - Random state 42
  - 19 final features after feature engineering

  The backend creates additional engineered features such as:

  - `click_trend`
  - `learning_efficiency`
  - `delay_stress_score`
  - `struggle_index`
  - `score_per_credit`
  - `is_overloaded`

  ## Example Prediction Result

  A sample local backend test returned:

  ```json
  {
    "status": "success",
    "prediction": 1,
    "label": "SUCCESS",
    "riskPercent": 11.0,
    "contributions": [
      { "name": "KONSISTENSI AKHIR (30H)", "value": 28.32 },
      { "name": "TOTAL AKTIVITAS (VLE)", "value": 16.07 },
      { "name": "KUALITAS NILAI TUGAS", "value": 11.6 }
    ]
  }

  prediction = 0 means AT RISK, while prediction = 1 means SUCCESS.

  ## Tech Stack

  ### Frontend

  - React 19
  - Vite
  - Tailwind CSS
  - React Router
  - Recharts
  - Framer Motion
  - Lucide React
  - Bootstrap

  ### Backend

  - Flask
  - Flask-CORS
  - Pandas
  - NumPy
  - Scikit-learn
  - Joblib
  - Gunicorn

  ## Project Structure

  AOLMachineLearning/
  ├── backend/
  │   ├── app.py
  │   ├── app.ipynb
  │   ├── requirements.txt
  │   ├── random_forest_model_v1.pkl
  │   └── scaler_v1.pkl
  │
  └── AcademiaEWS/
      ├── src/
      │   ├── App.jsx
      │   ├── main.jsx
      │   ├── index.css
      │   ├── dashboard/
      │   │   ├── DashboardPage.jsx
      │       ├── LoginPage.jsx
      │       └── RegisterPage.jsx
      ├── package.json
      ├── vite.config.js
      └── vercel.json

## Setup and Installation

  ### Prerequisites

  Make sure you have these installed:

  - Python 3.13
  - Node.js and npm
  - Git

  This project has two separate apps:

  - Backend Flask API in `backend/`
  - Frontend React app in `AcademiaEWS/`

  ---

  ## Backend Setup

  Open a terminal in the project root:

  ```bash
  cd backend

  Create and activate a virtual environment.

  ### Windows PowerShell

  python -m venv .venv
  .venv\Scripts\Activate.ps1

  ### macOS / Linux

  python -m venv .venv
  source .venv/bin/activate

  Install backend dependencies:

  pip install -r requirements.txt

  Run the Flask backend:

  python app.py

  The backend will run at:

  http://localhost:5000

  You can test the backend health check by opening:

  http://localhost:5000/

  Expected response:

  {
    "status": "ok",
    "service": "AcademiaEWS backend"
  }

  ———

  ## Frontend Setup

  Open a new terminal from the project root:

  cd AcademiaEWS

  Install frontend dependencies:

  npm install

  Create a .env file inside the AcademiaEWS/ folder:

  VITE_API_BASE_URL=http://localhost:5000

  Run the frontend development server:

  npm run dev

  The frontend will usually run at:

  http://localhost:5173

  Open that URL in your browser.

  ———

  ## How to Use

  1. Register an account using a Gmail address and password with at least 8 characters.
  2. Log in with the registered account.
  3. Go to the dashboard.
  4. Fill in the student profile, academic load, VLE activity, and performance data.
  5. Click Analyze Academic Data.
  6. The system will show:
      - Prediction status: AT RISK or SUCCESS
      - Risk percentage
      - Important contributing variables
      - Recommended action

  7. Prediction records are saved in browser localStorage.
  8. Use the History page to search and filter previous predictions.
  9. Use the Manage Data page to delete records.

  ———

  ## Running Both Apps Together

  You need two terminals.

  Terminal 1:

  cd backend
  python app.py

  Terminal 2:

  cd AcademiaEWS
  npm run dev

  Then open:

  http://localhost:5173

  ———

  ## Production Build

  To build the frontend for production:

  cd AcademiaEWS
  npm run build

  To preview the production build locally:

  npm run preview

  ———

  ## Environment Variables

  ### Backend

  The backend supports custom CORS origins:

  CORS_ORIGINS=http://localhost:5173

  For multiple origins:

  CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

  ### Frontend

  The frontend uses this environment variable to connect to the backend:

  VITE_API_BASE_URL=http://localhost:5000

  If this is not set, the frontend defaults to:

  https://academiaews.onrender.com

 ## Notes

  The current repository contains the trained model files and application code, but does not include the original
  training dataset or full model evaluation metrics. The notebook mainly contains Flask app testing logs, so model
  accuracy and training results should not be claimed unless added from the original training process.

## Website Link
https://academiaews-weld.vercel.app/
