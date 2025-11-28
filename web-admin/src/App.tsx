import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Schools } from "@/pages/Schools";
import { Upload } from "@/pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="schools" element={<Schools />} />
          <Route path="upload" element={<Upload />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
