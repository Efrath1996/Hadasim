import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register';
import OwnerDashboard from './components/Dashboard/OwnerDashboard.js';
import SupplierDashboard from './components/Dashboard/SupplierDashboard.js';
import Header from './components/Header'; 

function AppWrapper() {
  const location = useLocation();

  const hideHeaderRoutes = ['/', '/login', '/register'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/owner_dashboard" element={<OwnerDashboard />} />
        <Route path="/supplier_dashboard" element={<SupplierDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
