import './index.css'
import { LoginPage } from './login/LoginPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from './login/RegisterPage';
import { DashboardPage } from './dashboard/DashboardPage';
import { HistoryPage } from './dashboard/HistoryPage';
import { DeletePage } from './dashboard/DeletePage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
