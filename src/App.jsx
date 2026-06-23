import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Guides from "./pages/Guide";
import GuideDashboard from "./pages/GuideDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guide-dashboard" element={<GuideDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}