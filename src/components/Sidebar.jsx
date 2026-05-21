import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ onLogout, session }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', label: '메인 홈' },
    { path: '/study', label: '개념 배움터' },
    { path: '/bid', label: '가상 입찰 훈련소' },
    { path: '/profile', label: '프로필 (성장 시각화)' }
  ];

  return (
    <div className="w-64 bg-bg-sidebar border-r border-gray-800 p-6 flex flex-col h-full z-10">
      <div className="text-xl font-bold text-white mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-accent-blue rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        경매 훈련소
      </div>
      
      <ul className="flex-1 space-y-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-accent-blue/10 text-accent-blue border-l-4 border-accent-blue' 
                    : 'text-text-muted hover:bg-bg-card hover:text-white border-l-4 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      
      {session ? (
        <button onClick={onLogout} className="mt-auto w-full text-left px-4 py-3 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors border-l-4 border-transparent">
          로그아웃
        </button>
      ) : (
        <button onClick={() => navigate('/login')} className="mt-auto w-full text-center px-4 py-3 text-sm font-medium text-white bg-accent-blue hover:bg-blue-600 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">
          로그인 / 가입하기
        </button>
      )}
    </div>
  );
}
