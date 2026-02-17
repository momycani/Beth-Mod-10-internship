import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import "./styles/style.css"
import Home from "./pages/Home";
import ForYou from "./pages/ForYou";
import Book from "./pages/Book";
import Player from "./pages/Player";
import ChoosePlan from "./pages/ChoosePlan";
import Settings from "./pages/Settings";
import Library from "./pages/Library"; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/for-you" element={<ForYou />} />
      <Route path="/book/:id" element={<Book />} />
      <Route path="/player/:id" element={<Player />} />
      <Route path="/choose-plan" element={<ChoosePlan />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/library" element={<Library />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

