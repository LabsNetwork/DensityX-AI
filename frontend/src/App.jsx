
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { UserWebsite } from "./components/UserWebsite";
import Diagnostic from "./Diagnostic";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserWebsite />} />
        <Route path="/user" element={<UserWebsite />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="*" element={<UserWebsite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;