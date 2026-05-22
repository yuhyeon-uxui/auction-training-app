import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Settings({ session }) {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState({ nickname: '', avatarUrl: '' });

  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata || {};
      const currentNickname = metadata.nickname || session.user.email?.split('@')[0] || '';
      const currentAvatar = metadata.avatar_url || '';
      setNickname(currentNickname);
      setAvatarUrl(currentAvatar);
      setOriginalData({ nickname: currentNickname, avatarUrl: currentAvatar });
    }
  }, [session]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake local preview for now since we don't have a storage bucket guaranteed
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isDirty = () => {
    if (nickname !== originalData.nickname) return true;
    if (avatarUrl !== originalData.avatarUrl) return true;
    if (password && password === confirmPassword) return true;
    return false;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {};
      
      // Update metadata if changed
      if (nickname !== originalData.nickname || avatarUrl !== originalData.avatarUrl) {
        updates.data = {
          nickname,
          avatar_url: avatarUrl
        };
      }
      
      // Update password if provided
      if (password && password === confirmPassword) {
        updates.password = password;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
        
        alert('🎉 프로필이 성공적으로 업데이트되었습니다!');
        setOriginalData({ nickname, avatarUrl });
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(error);
      alert('업데이트 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold mb-3">나의 프로필 수정</h2>
        <p className="text-text-muted">닉네임, 프로필 이미지, 비밀번호를 변경할 수 있습니다.</p>
      </div>

      <div className="bg-bg-card border border-gray-800 rounded-2xl p-8 shadow-xl">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4 group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-blue to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                nickname.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <span className="text-sm text-text-muted font-medium bg-gray-800/50 px-3 py-1 rounded-full">이미지 변경을 원하시면 클릭하세요</span>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">닉네임</label>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-[#121214] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
              placeholder="새로운 닉네임을 입력하세요"
            />
          </div>

          <div className="pt-4 border-t border-gray-800">
            <label className="block text-sm font-bold text-text-muted mb-2">새 비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121214] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
              placeholder="변경할 비밀번호를 입력하세요 (선택사항)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">새 비밀번호 확인</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-[#121214] border ${password && confirmPassword && password !== confirmPassword ? 'border-danger focus:border-danger focus:ring-danger' : 'border-gray-700 focus:border-accent-blue focus:ring-accent-blue'} text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all`}
              placeholder="변경할 비밀번호를 다시 입력하세요"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-danger text-sm mt-2 font-medium">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <button 
            onClick={handleSave}
            disabled={!isDirty() || loading || (password && password !== confirmPassword)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isDirty() && (!password || password === confirmPassword)
                ? 'bg-accent-blue hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
