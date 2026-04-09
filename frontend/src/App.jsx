import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";

/**
 * Root application component.
 * Defines the two main routes:
 *   /         — Home page (upload + job description form)
 *   /results  — Results page (analysis output)
 */
function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
