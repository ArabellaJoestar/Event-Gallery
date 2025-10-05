import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEvent />} />
        <Route path="/edit/:id" element={<EditEvent/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
