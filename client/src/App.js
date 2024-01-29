import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StockDetails from "./pages/StockDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/Routes/Private";
import ForgotPasssword from "./pages/Auth/ForgotPasssword";
import Profile from "./pages/user/Profile";
import Trade from "./pages/Trade";
import HistoryTransaction from "./pages/HistoryTransaction";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stock/:slug" element={<StockDetails />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/historytransaction" element={<HistoryTransaction />} />
        <Route path="user/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
