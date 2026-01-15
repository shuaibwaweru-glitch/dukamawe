// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Login from './pages/auth/Login';
import SignUpPage from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import CreateOrder from './pages/orders/CreateOrder';
import OrderDetails from './pages/orders/OrderDetails';
import TrackOrder from './pages/orders/TrackOrder';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierOrderDetails from './pages/supplier/OrderDetails';
import SeedData from './pages/admin/SeedData';
import SetupBuyer from './pages/profile/SetupBuyer';
import './styles/brutal-design-system.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in/*" element={<Login />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Admin route - for seeding data */}
        <Route path="/admin/seed" element={<SeedData />} />
        
        {/* Buyer setup route */}
        <Route
          path="/setup/buyer"
          element={
            <>
              <SignedIn>
                <SetupBuyer />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        
        {/* Buyer routes */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        
        <Route
          path="/orders/create"
          element={
            <>
              <SignedIn>
                <CreateOrder />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <>
              <SignedIn>
                <OrderDetails />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/track/:orderId"
          element={
            <>
              <SignedIn>
                <TrackOrder />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        
        {/* Supplier routes */}
        <Route
          path="/supplier/dashboard"
          element={
            <>
              <SignedIn>
                <SupplierDashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        
        <Route
          path="/supplier/orders/:orderId"
          element={
            <>
              <SignedIn>
                <SupplierOrderDetails />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;