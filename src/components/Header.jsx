import { useLocation } from 'react-router-dom';

export default function Header({ session, toggleMenu }) {
  const location = useLocation();
  
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
          <button className="relative p-2 text-text-muted hover:text-white transition-colors duration-300">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-blue rounded-full border-2 border-bg-main shadow-[0_0_8px_#3B82F6]"></span>
          </button>
        )}
        <div className={`flex items-center gap-3 ${session ? 'pl-5 border-l border-gray-800' : ''}`}>
          <div className="text-sm font-medium hidden sm:block text-right">
            <div className="text-white">{session?.user?.email?.split('@')[0] || '비회원'}</div>
            <div className="text-xs text-text-muted">{session ? '예비 입찰자' : '로그인이 필요합니다'}</div>
          </div>
          {session ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-light flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer hover:scale-105 transition-transform">
              {session.user.email.charAt(0).toUpperCase()}
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
