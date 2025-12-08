import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import HomeInput from "./components/HomeInput"
import Layout from "./components/layout/Layout"
import EvidenceDetailPage from "./pages/EvidenceDetailPage"
import TrialsDetailPage from "./pages/TrialsDetailPage"
import PatentsDetailPage from "./pages/PatentsDetailPage"
import MarketDetailPage from "./pages/MarketDetailPage"

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toaster />
        <Routes>
          <Route path="/" element={<HomeInput />} />
          <Route path="/evidence" element={<EvidenceDetailPage />} />
          <Route path="/trials" element={<TrialsDetailPage />} />
          <Route path="/patents" element={<PatentsDetailPage />} />
          <Route path="/market" element={<MarketDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
