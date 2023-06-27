import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Fabricantes } from "./components/Fabricantes";
import { Productos } from "./components/Productos";
import { Menu } from "./components/Menu";

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Menu />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fabricantes" element={<Fabricantes />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
