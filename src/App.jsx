import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlossaryPopup from './components/GlossaryPopup';
import Login from './pages/Login';
import Home from './pages/Home';
import Study from './pages/Study';
import Bidding from './pages/Bidding';
import Profile from './pages/Profile';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Supabase session error:', error);
      setSession(data?.session || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
        <Route path="*" element={
          <div className="flex h-screen overflow-hidden bg-bg-main text-text-main font-['Inter'] relative">
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}
            <Sidebar onLogout={() => supabase.auth.signOut()} session={session} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <Header session={session} toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
              <div className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Home session={session} />} />
                  <Route path="/study" element={session ? <Study session={session} /> : <Navigate to="/login" />} />
                  <Route path="/bid" element={session ? <Bidding session={session} /> : <Navigate to="/login" />} />
                  <Route path="/profile" element={session ? <Profile session={session} /> : <Navigate to="/login" />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
            <GlossaryPopup />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
