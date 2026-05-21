import { useLocation } from 'react-router-dom';

export default function Header({ session }) {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return '메인 홈 대시보드';
      case '/study': return '개념 배움터';
      case '/bid': return '가상 입찰 훈련소';
      case '/profile': return '나의 성장 통계';
      default: return '경매 훈련소';
    }
  };

  return (
    <div className="h-20 border-b border-gray-800 bg-bg-main/90 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
      <h1 className="text-xl font-bold text-white tracking-wide">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-text-muted hover:text-white transition-colors duration-300">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-blue rounded-full border-2 border-bg-main shadow-[0_0_8px_#3B82F6]"></span>
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-gray-800">
          <div className="text-sm font-medium hidden sm:block text-right">
            <div className="text-white">{session?.user?.email?.split('@')[0] || '비회원'}</div>
            <div className="text-xs text-text-muted">{session ? '예비 입찰자' : '로그인이 필요합니다'}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-light flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer hover:scale-105 transition-transform">
            {session?.user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      </div>
    </div>
  );
}
