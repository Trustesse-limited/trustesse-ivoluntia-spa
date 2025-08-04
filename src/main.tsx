import React from "react";
import './index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";

import Dashboard from "@/pages/Dashboard";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
