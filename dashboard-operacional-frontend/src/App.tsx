import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import Suspects from "./routes/Suspects";
import WebChart from "./routes/Web";
import Layout from "./components/layout/layout";
import Worksheet from "./routes/Worksheet";
import Operations from "./routes/Operations";
import SuspectsDetails from "./routes/suspectDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/planilhas" element={<Worksheet />} />
        <Route path="/operacoes" element={<Operations />} />
        <Route path="/alvos" element={<Suspects />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard/detalhesSuspeito/:id"
          element={<SuspectsDetails />}
        />
        <Route path="/teia" element={<WebChart />} />
      </Route>
    </Routes>
  );
}

export default App;
