import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const HomePage = lazy(() => import('mainPage/HomePage'));
const Courses = lazy(() => import('coursePage/Course'));

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
          </ul>
        </nav>

        <Suspense fallback={<div>Loading…</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
