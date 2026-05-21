import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else if (data.user) {
      await supabase.from('profiles').insert([{ id: data.user.id }]);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setError('비밀번호 재설정 이메일을 보냈습니다.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card-style w-[400px]">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => window.location.href = '/'} className="text-sm text-text-muted hover:text-white flex items-center gap-1">
            <span>←</span> 메인으로
          </button>
        </div>
        <h2 className="text-2xl font-bold text-accent-blue text-center mb-6">VIRTUAL BIDDING</h2>
        {error && <div className="text-danger text-sm mb-4 text-center">{error}</div>}
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">이메일</label>
            <input 
              type="email" 
              className="w-full p-3 bg-bg-main border border-gray-800 rounded-lg outline-none focus:border-accent-blue transition-colors text-white"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">비밀번호</label>
            <input 
              type="password" 
              className="w-full p-3 bg-bg-main border border-gray-800 rounded-lg outline-none focus:border-accent-blue transition-colors text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="button" onClick={handleLogin} className="btn-primary mt-2">로그인 시작하기</button>
          <button type="button" onClick={handleSignup} className="w-full py-3 mt-3 bg-transparent border border-gray-800 text-text-muted rounded-lg font-semibold hover:text-white hover:border-gray-500 transition-all">새 계정 만들기</button>
        </form>

        <div className="flex items-center text-sm text-text-muted my-6">
          <div className="flex-1 border-b border-gray-800"></div>
          <span className="px-2">또는 간편 로그인</span>
          <div className="flex-1 border-b border-gray-800"></div>
        </div>

        <button onClick={handleGoogleLogin} className="w-full py-3 bg-bg-main text-white border border-gray-800 rounded-lg flex items-center justify-center gap-2 hover:bg-bg-cardHover hover:border-gray-500 transition-all">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google로 계속하기
        </button>

        <div className="mt-4 text-center">
          <button onClick={handleResetPassword} className="text-sm text-text-muted hover:text-accent-blue underline">비밀번호를 잊으셨나요?</button>
        </div>
      </div>
    </div>
  );
}
