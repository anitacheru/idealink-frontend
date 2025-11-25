import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import InvestorDashboard from "./pages/InvestorDashboard";
import IdeaGeneratorDashboard from "./pages/IdeaGeneratorDashboard";
import ExpressionsOfInterest from "./pages/ExpressionsOfInterest";
import IdeaDetailView from "./pages/IdeaDetailView";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/investor/dashboard"
        element={
          <ProtectedRoute>
            <InvestorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generator/dashboard"
        element={
          <ProtectedRoute>
            <IdeaGeneratorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expressions"
        element={
          <ProtectedRoute>
            <ExpressionsOfInterest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/idea/:id"
        element={
          <ProtectedRoute>
            <IdeaDetailView />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
