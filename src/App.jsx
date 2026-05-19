import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-bg-main text-text-main">
        <Sidebar onLogout={() => supabase.auth.signOut()} />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home session={session} />} />
            <Route path="/study" element={<Study session={session} />} />
            <Route path="/bid" element={<Bidding session={session} />} />
            <Route path="/profile" element={<Profile session={session} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <GlossaryPopup />
      </div>
    </BrowserRouter>
  );
}

export default App;
