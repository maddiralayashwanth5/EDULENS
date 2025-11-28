import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Institutions } from "@/pages/Institutions";
import { Schools } from "@/pages/Schools";
import { Upload } from "@/pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="institutions" element={<Institutions />} />
          <Route path="schools" element={<Schools />} />
          <Route path="colleges" element={<Institutions />} />
          <Route path="universities" element={<Institutions />} />
          <Route path="coaching" element={<Institutions />} />
          <Route path="societies" element={<Institutions />} />
          <Route path="vocational" element={<Institutions />} />
          <Route path="upload" element={<Upload />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
