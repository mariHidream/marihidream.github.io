
import { Routes, Route, useLocation } from 'react-router-dom';

import NavBar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';


function App() {

  const location = useLocation();

  return (
    <>
      <NavBar/>
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
      </Routes>
    </>
  );
}

export default App;
