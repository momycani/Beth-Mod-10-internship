import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./styles/style.css"
import Home from "./pages/Home";
import ForYou from "./pages/ForYou";
import Book from "./pages/Book";
import Player from "./pages/Player";
import ChoosePlan from "./pages/ChoosePlan";
import Settings from "./pages/Settings";
import Library from "./pages/Library"; 
import LoginModal from "./components/home/LoginModal.jsx";
import SignUpModal from "./components/home/SignUpModal.jsx";
import Layout from "./components/layout/Layout";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const openLogin = () => { setSignUpOpen(false); setLoginOpen(true); };
  const openSignUp = () => { setLoginOpen(false); setSignUpOpen(true); };

  const closeLogin = () => setLoginOpen(false);
  const closeSignUp = () => setSignUpOpen(false);

  return ( 
    <>   
    <Routes>
      <Route path="/" element={<Home onLoginClick={openLogin} />} />     
      <Route element={<Layout />}>   
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/choose-plan" element={<ChoosePlan />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/library" element={<Library />} />
      </Route>  
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>   
    
    <LoginModal open={loginOpen} onClose={closeLogin} onOpenSignUp={openSignUp} />
    <SignUpModal open={signUpOpen} onClose={closeSignUp} onGoToLogin={openLogin} />
    </>
  );
}

