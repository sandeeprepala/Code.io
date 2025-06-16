import './App.css'
import toast, { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Problems from './pages/Problems';
import Profile from './pages/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProblemById from './pages/ProblemById';
// import CodeColab from './pages/CodeColab';
// import Collaboration from './pages/Collaboration';
// import io from'socket.io-client';
import { useEffect } from 'react';

// const socket = io(import.meta.env.VITE_BACKEND_URL);
function App() {
//   useEffect(() => {
//   return () => {
//     socket.disconnect();
//   };
// }, []);

  return (
    <>
      <Toaster />
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/problems" element={<Problems/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/problems/:id" element={<ProblemById/>} />
          {/* <Route path="/codeColab/:roomId" element={<CodeColab />} />
          <Route path="/collaboration" element={<Collaboration/>} /> */}
        
      </Routes>
        <Footer/>
      </Router>
    </>
  )
}

export default App
