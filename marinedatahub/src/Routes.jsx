import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/ui/Header";

// Existing pages
import Dashboard from "./pages/dashboard";
import DataIngestion from "./pages/data-ingestion";
import DataAnalysis from "./pages/data-analysis";
import OceanographicMapping from "./pages/oceanographic-mapping";
import SpeciesIdentification from "./pages/species-identification";
import DataExport from "./pages/data-export";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Header />
        <RouterRoutes>
          {/* Auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          
          {/* Main application routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/data-ingestion" element={<DataIngestion />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
          <Route path="/oceanographic-mapping" element={<OceanographicMapping />} />
          <Route path="/species-identification" element={<SpeciesIdentification />} />
          <Route path="/data-export" element={<DataExport />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;