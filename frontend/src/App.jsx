import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
