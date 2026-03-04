
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AdminDashboard from "./AdminDashboard";
import Diagnostic from "./Diagnostic";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;