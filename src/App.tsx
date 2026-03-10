import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import "./styles/style.css";
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
import PublicLayout from "./components/layout/PublicLayout";
import Search from "./pages/Search";
import Checkout from "./pages/Checkout";
import MinimalLayout from "./components/layout/MinimalLayout";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState("/foryou");

  const navigate = useNavigate();

  const openLogin = () => {
    setLoginRedirectPath("/foryou");
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  const openSignUp = () => {
    setLoginRedirectPath("/foryou");
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const closeLogin = () => setLoginOpen(false);
  const closeSignUp = () => setSignUpOpen(false);

  const handleRequireLogin = (redirectPath = "/foryou") => {
    setLoginRedirectPath(redirectPath);
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  function GuestLibraryRoute({
  children,
  onRequireLogin,
}: {
  children: JSX.Element;
  onRequireLogin: (redirectPath?: string) => void;
}) {
  const isGuest = localStorage.getItem("isGuest") === "true";

  useEffect(() => {
    if (isGuest) {
      onRequireLogin("/library");
    }
  }, [isGuest, onRequireLogin]);

  if (isGuest) {
    return <Navigate to="/foryou" replace />;
  }

  return children;
}

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home onLoginClick={openLogin} />} />
          <Route path="/choose-plan" element={<ChoosePlan />} />
        </Route>

        <Route element={<MinimalLayout />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/search" element={<Search />} />
          <Route path="/book/:id" element={<Book onRequireLogin={openLogin} />} />
          <Route path="/player/:id" element={<Player onRequireLogin={openLogin} />} />
          <Route path="/settings" element={<Settings onRequireLogin={handleRequireLogin} />} />
          <Route path="/library" element={<GuestLibraryRoute onRequireLogin={handleRequireLogin}>
            <Library />
          </GuestLibraryRoute>} />
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal
        open={loginOpen}
        onClose={closeLogin}
        onOpenSignUp={openSignUp}
        onLoginSuccess={() => {
          setLoginOpen(false);
          navigate(loginRedirectPath);
          setLoginRedirectPath("/foryou");
        }}
      />
      <SignUpModal open={signUpOpen} onClose={closeSignUp} onGoToLogin={openLogin} />
    </>
  );
}
