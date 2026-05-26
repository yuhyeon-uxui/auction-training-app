import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlossaryPopup from './components/GlossaryPopup';
import Login from './pages/Login';
import Home from './pages/Home';
import Study from './pages/Study';
import Bidding from './pages/Bidding';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateStreak = async (currentSession) => {
    if (!currentSession?.user) return;
    const metadata = currentSession.user.user_metadata || {};
    const lastLogin = metadata.last_login;
    let streak = metadata.streak || 1;
    
    // Get today's date string in local timezone (e.g., '2026. 5. 26.')
    const today = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
    
    if (lastLogin !== today) {
      if (lastLogin) {
        // Parse dates to compare day differences
        // '2026. 5. 26.' -> replace spaces and split
        const lastParts = lastLogin.replace(/\s/g, '').replace(/\.$/, '').split('.');
        const todayParts = today.replace(/\s/g, '').replace(/\.$/, '').split('.');
        if (lastParts.length === 3 && todayParts.length === 3) {
          const lastDate = new Date(lastParts[0], lastParts[1] - 1, lastParts[2]);
          const currDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
          const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak += 1;
          } else if (diffDays > 1) {
            streak = 1;
          }
        }
      }
      // Update supabase auth metadata
      const { data, error } = await supabase.auth.updateUser({
        data: { last_login: today, streak }
      });
      if (!error && data?.user) {
        setSession({ ...currentSession, user: data.user });
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Supabase session error:', error);
      setSession(data?.session || null);
      if (data?.session) updateStreak(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession && _event === 'SIGNED_IN') {
        updateStreak(newSession);
      }
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
                  <Route path="/settings" element={session ? <Settings session={session} /> : <Navigate to="/login" />} />
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
