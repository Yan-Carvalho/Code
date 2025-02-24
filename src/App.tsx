import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { Navbar } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import QRGenerator from './pages/QRGenerator';
import SingleQRGenerator from './pages/SingleQRGenerator';
import BarcodeGenerator from './pages/BarcodeGenerator';
import SingleBarcodeGenerator from './pages/SingleBarcodeGenerator';
import { useAuthStore } from './store/authStore';
import { MainHeader } from './components/MainHeader';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <MainHeader />
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/payment"
          element={
            <RequireAuth>
              <Payment />
            </RequireAuth>
          }
        />
        <Route
          path="/qr-generator"
          element={
            <RequireAuth>
              <QRGenerator />
            </RequireAuth>
          }
        />
        <Route
          path="/single-qr-generator"
          element={
            <RequireAuth>
              <SingleQRGenerator />
            </RequireAuth>
          }
        />
        <Route
          path="/barcode-generator"
          element={
            <RequireAuth>
              <BarcodeGenerator />
            </RequireAuth>
          }
        />
        <Route
          path="/single-barcode-generator"
          element={
            <RequireAuth>
              <SingleBarcodeGenerator />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;