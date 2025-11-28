import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Schools } from "@/pages/Schools";
import { SchoolDetail } from "@/pages/SchoolDetail";
import { Compare } from "@/pages/Compare";
import { About } from "@/pages/About";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Contact } from "@/pages/Contact";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { NotFound } from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="schools" element={<Schools />} />
          <Route path="schools/:id" element={<SchoolDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
