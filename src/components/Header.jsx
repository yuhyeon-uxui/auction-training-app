import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ session, toggleMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': 
        return (
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-tr from-accent-blue to-purple-500 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M17 2v20"/><path d="M7 22V6a2 2 0 0 1 2-2h8"/><path d="M11 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M11 10h2"/><path d="M11 14h2"/></svg>
            </div>
            <span>부메이트</span>
          </div>
        );
      case '/study': return '개념 배움터';
      case '/bid': return '가상 입찰 훈련소';
      case '/profile': return '나의 학습현황';
      default: return '부메이트';
    }
  };

  return (
    <div className="h-20 border-b border-gray-800 bg-bg-main/90 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-text-muted hover:text-white" onClick={toggleMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide flex items-center">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-5">
        {session && (
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className={`p-2 transition-colors duration-300 cursor-pointer rounded-full ${isNotifOpen ? 'bg-gray-800 text-white' : 'text-text-muted hover:text-white hover:bg-gray-800/50'}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {/* <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-blue rounded-full border-2 border-bg-main shadow-[0_0_8px_#3B82F6]"></span> */}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-bg-card border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-bg-main/50">
                    <h3 className="font-bold text-white text-lg">알림</h3>
                  </div>
                  <div className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 border border-gray-700/50 shadow-inner">
                      <span className="text-3xl grayscale opacity-50">📭</span>
                    </div>
                    <p className="text-white font-bold mb-1">도착한 알림이 없어요</p>
                    <p className="text-sm text-text-muted">새로운 소식이 생기면 알려드릴게요!</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <div 
          onClick={() => session && navigate('/settings')}
          className={`flex items-center gap-3 ${session ? 'pl-5 border-l border-gray-800 cursor-pointer group' : ''}`}
        >
          <div className="text-sm font-medium hidden sm:block text-right transition-colors group-hover:text-accent-light">
            <div className="text-white group-hover:text-accent-light">{session?.user?.user_metadata?.nickname || session?.user?.email?.split('@')[0] || '비회원'}</div>
            <div className="text-xs text-text-muted">예비 입찰자</div>
          </div>
          {session ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-light flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform overflow-hidden">
              {session.user.user_metadata?.avatar_url ? (
                <img src={session.user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (session.user.user_metadata?.nickname || session.user.email).charAt(0).toUpperCase()
              )}
            </div>
          ) : (
             <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-text-muted border border-gray-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
