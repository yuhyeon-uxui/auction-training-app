import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ onLogout, session, isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', label: '메인 홈', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { path: '/study', label: '개념 배움터', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> },
    { path: '/bid', label: '가상 입찰 훈련소', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> },
    { path: '/profile', label: '나의 학습현황', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> }
  ];

  return (
    <div className={`fixed md:static inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-300 ease-in-out w-full md:w-64 bg-bg-main md:bg-bg-sidebar border-none md:border-r border-gray-800 p-8 md:p-6 flex flex-col h-full z-50`}>
      <div className="text-2xl md:text-xl font-bold text-white mb-12 md:mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-accent-blue to-purple-500 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M17 2v20"/><path d="M7 22V6a2 2 0 0 1 2-2h8"/><path d="M11 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M11 10h2"/><path d="M11 14h2"/></svg>
          </div>
          부메이트
        </div>
        <button className="md:hidden text-text-muted hover:text-white" onClick={() => setIsOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div className="mb-6 mt-10 md:mt-0 px-2 md:px-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 md:pl-3 flex items-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 ml-1 md:ml-0 md:w-[16px] md:h-[16px]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input type="text" className="w-full bg-gray-800/40 border border-transparent hover:bg-gray-800/60 text-white text-base md:text-sm rounded-xl md:rounded-lg pl-12 md:pl-10 pr-4 py-3.5 md:py-2.5 focus:outline-none focus:border-gray-700 focus:bg-gray-800 transition-colors placeholder-gray-500" placeholder="Search" />
        </div>
      </div>
      
      <ul className="flex-1 flex flex-col gap-4 md:gap-2 md:block md:space-y-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                to={item.path} 
                onClick={() => setIsOpen && setIsOpen(false)}
                className={`flex items-center justify-center md:justify-start gap-3 w-full px-4 py-4 md:py-3 rounded-xl md:rounded-lg text-lg md:text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-gray-800 text-white shadow-sm border border-gray-700' 
                    : 'text-text-muted hover:bg-gray-800/40 hover:text-gray-300 border border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      
      {session ? (
        <button onClick={onLogout} className="mt-auto w-full text-center md:text-left px-4 py-4 md:py-3 text-lg md:text-sm font-medium text-danger hover:bg-danger/10 rounded-xl md:rounded-lg transition-colors border-b-2 md:border-b-0 md:border-l-4 border-transparent">
          로그아웃
        </button>
      ) : (
        <button onClick={() => { navigate('/login'); setIsOpen && setIsOpen(false); }} className="mt-auto w-full text-center px-4 py-4 md:py-3 text-lg md:text-sm font-bold text-white bg-accent-blue hover:bg-blue-600 rounded-xl md:rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">
          로그인 / 가입하기
        </button>
      )}
    </div>
  );
}
